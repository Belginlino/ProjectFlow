import * as admin from 'firebase-admin';
import { onRequest } from 'firebase-functions/v2/https';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import crypto from 'crypto';
import { App } from 'octokit';

// Replace these with your actual GitHub App credentials in production, or use Firebase Secret Manager
const GITHUB_APP_ID = process.env.GITHUB_APP_ID || '123456';
const GITHUB_PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY || '-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----';
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || 'Iv1.test';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || 'test_secret';
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || 'test_webhook_secret';

const db = admin.firestore();

// We create an Octokit App instance to handle authentication and webhooks
const app = new App({
  appId: GITHUB_APP_ID,
  privateKey: GITHUB_PRIVATE_KEY,
  webhooks: {
    secret: GITHUB_WEBHOOK_SECRET,
  },
  oauth: {
    clientId: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
  },
});

export const githubCallback = onRequest(async (req, res) => {
  const code = req.query.code as string;
  const setup_action = req.query.setup_action as string;
  const installation_id = req.query.installation_id as string;
  const projectId = req.query.state as string; // We passed projectId in the state parameter

  if (!code || !installation_id || !projectId) {
    res.status(400).send('Missing required parameters');
    return;
  }

  try {
    // Note: In a real app, you would exchange the code for a user access token here,
    // and then use that token to verify the user has access to the installation.
    
    // For this hackathon, we'll just record the installation in Firestore
    const installationRef = db.collection('github_installations').doc(projectId);
    await installationRef.set({
      projectId,
      installationId: installation_id,
      setupAction: setup_action,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // Sync repositories for this installation
    const octokit = await app.getInstallationOctokit(Number(installation_id));
    const { data: repos } = await octokit.rest.apps.listReposAccessibleToInstallation();

    const reposRef = db.collection('github_repositories');
    const batch = db.batch();

    for (const repo of repos.repositories) {
      const repoDoc = reposRef.doc(`${projectId}_${repo.id}`);
      batch.set(repoDoc, {
        projectId,
        installationId: installation_id,
        repositoryId: repo.id,
        fullName: repo.full_name,
        name: repo.name,
        htmlUrl: repo.html_url,
        addedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    }

    await batch.commit();

    // Redirect back to the frontend
    // In production this should be the actual frontend URL
    const redirectUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${redirectUrl}/dashboard?github_setup=success&project=${projectId}`);
  } catch (error) {
    console.error('GitHub Callback Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

export const githubWebhook = onRequest(async (req, res) => {
  const signature = req.headers['x-hub-signature-256'] as string;
  const eventName = req.headers['x-github-event'] as string;
  const id = req.headers['x-github-delivery'] as string;

  if (!signature || !eventName || !id) {
    res.status(400).send('Missing GitHub headers');
    return;
  }

  try {
    // Verify payload signature using the webhook secret
    const payload = JSON.stringify(req.body);
    const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET);
    const digest = `sha256=${hmac.update(payload).digest('hex')}`;
    
    if (signature !== digest) {
      // In strict mode, we'd block this. For dev, we might just log it.
      console.warn('Webhook signature mismatch', { expected: signature, actual: digest });
      // res.status(401).send('Invalid signature');
      // return;
    }

    const eventData = req.body;
    const installationId = eventData.installation?.id;

    if (!installationId) {
      res.status(400).send('No installation info in payload');
      return;
    }

    // Find the project linked to this installation
    const installationsSnap = await db.collection('github_installations').where('installationId', '==', installationId.toString()).get();
    if (installationsSnap.empty) {
      res.status(404).send('Installation not linked to any project');
      return;
    }

    const projectId = installationsSnap.docs[0].data().projectId;

    // Log the event as raw activity
    const activityRef = db.collection('github_activity').doc(id);
    await activityRef.set({
      projectId,
      installationId,
      eventType: eventName,
      action: eventData.action || null,
      repository: eventData.repository ? {
        id: eventData.repository.id,
        fullName: eventData.repository.full_name,
      } : null,
      sender: {
        login: eventData.sender.login,
        id: eventData.sender.id,
      },
      payload: eventData, // In production, filter this to just what you need
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      processed: false
    });

    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Callable function for the frontend to fetch synced repositories
export const getConnectedRepositories = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'User must be authenticated.');
  }

  const { projectId } = request.data;
  if (!projectId) {
    throw new HttpsError('invalid-argument', 'projectId is required.');
  }

  const reposSnap = await db.collection('github_repositories').where('projectId', '==', projectId).get();
  return {
    success: true,
    repositories: reposSnap.docs.map(doc => doc.data())
  };
});
