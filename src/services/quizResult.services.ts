import {
  get,
  push,
  ref,
  update,
  query,
  orderByChild,
  equalTo,
  DataSnapshot,
  startAt,
  endAt,
} from "firebase/database";
import { db } from "../config/firebase-config.ts";

const fromQuizResultDocument = async (snapshot: DataSnapshot) => {
  try {
    const quizResultDocument = snapshot.val();

    return Object.keys(quizResultDocument).map((key) => {
      const quiz = quizResultDocument[key];

      return quiz;
    });
  } catch (error) {
    console.error(error);
  }
};

export const saveQuizResult = async (
  selection: (number | null)[],
  quizId: string,
  username: string,
  scorePoints: number,
  scorePercent: number
): Promise<DataSnapshot> => {
  try {
    const result = await push(ref(db, "quizResults"), {
      selection,
      quizId,
      username,
      scorePoints,
      scorePercent,
      completedAt: Date.now(),
    });

    if (result.key) {
      const updateResultQuizId: { [key: string]: string | null | string[] } = {};
      updateResultQuizId[`/quizResults/${result.key}/quizResultId`] = result.key;
      await update(ref(db), updateResultQuizId);
      return getQuizResultId(result.key);
    }

    // If result.key is undefined, throw an error
    throw new Error("Quiz result key is undefined");
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error
  }
};

export const getQuizResultId = async (id: string): Promise<DataSnapshot> => {
  try {
    const result = await get(ref(db, `quizResults/${id}`));

    if (!result.exists()) {
      throw new Error(`Quiz result with id ${id} does not exist!`);
    }

    return result.val();
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error
  }
};

export const getQuizResultsByUsername = async (username: string) => {
  try {
    const snapshot = await get(query(
      ref(db, "quizResults"),
      orderByChild("username"),
      equalTo(username)
    ));

    if (!snapshot.exists()) {
      return [];
    }

    return fromQuizResultDocument(snapshot);
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    throw error; // Propagate the error
  }
};

export const getAllResults = async () => {
  try {
    const snapshot = await get(ref(db, 'quizResults'));

    if (!snapshot.exists()) {
      return [];
    }
    return fromQuizResultDocument(snapshot);
  } catch (error) {
    console.error(error);
  }
}

export const getQuizResultsLastWeek = async () => {
  try {
    // Get the current date
    const now = new Date();

    // Get the date one week ago
    const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

    // Convert the dates to timestamps
    const nowTimestamp = now.getTime();
    const oneWeekAgoTimestamp = oneWeekAgo.getTime();

    const snapshot = await get(query(ref(db, 'quizResults'), orderByChild('completedAt'), startAt(oneWeekAgoTimestamp), endAt(nowTimestamp)));

    if (!snapshot.exists()) {
      return [];
    }
    
    return fromQuizResultDocument(snapshot);
  } catch (error) {
    console.error(error);
  }
}