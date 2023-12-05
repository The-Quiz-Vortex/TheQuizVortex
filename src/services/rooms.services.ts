import { ref, get, DataSnapshot } from 'firebase/database';
import { db } from '../config/firebase-config';
import { Classroom } from '../common/interfaces';

export const getAllClassrooms = async (): Promise<Classroom[] | undefined> => {
  try {
    const snapshot: DataSnapshot = await get(ref(db, 'classRooms'));

    if (!snapshot.exists()) {
      return [];
    }

    const classroomsArray: Classroom[] = [];

    snapshot.forEach((childSnapshot) => {
      const classroom = childSnapshot.val();
      classroomsArray.push(classroom);
    });

    return classroomsArray;
  } catch (error) {
    console.error(error);
  }
};
