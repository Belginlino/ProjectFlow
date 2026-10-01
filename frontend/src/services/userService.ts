import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types';

export const userService = {
  async getMentorsByInstitution(institutionId: string): Promise<UserProfile[]> {
    try {
      const q = query(
        collection(db, 'users'),
        where('institutionId', '==', institutionId),
        where('role', '==', 'mentor')
      );
      
      const querySnapshot = await getDocs(q);
      const mentors: UserProfile[] = [];
      
      querySnapshot.forEach((doc) => {
        mentors.push(doc.data() as UserProfile);
      });
      
      return mentors;
    } catch (error) {
      console.error('Error fetching mentors:', error);
      return [];
    }
  }
};
