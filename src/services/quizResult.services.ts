import {
    get,
    push,
    ref,
    update,
    query,
    orderByChild,
    equalTo,
    DataSnapshot,
    onValue,
  } from "firebase/database";
  import { db } from "../config/firebase-config.ts";
  import { QuizResult } from "../common/interfaces";
  
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
        username, // Store the username directly under the quiz result
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
  
      return result;
    } catch (error) {
      console.error(error);
      throw error; // Propagate the error
    }
  };
  
  export const getQuizResultsByUsername = async (
    username: string,
    setResults: React.Dispatch<React.SetStateAction<QuizResult[]>>
  ) => {
    try {
      const quizResultsQuery = query(
        ref(db, "quizResults"),
        orderByChild("selection/username"),
        equalTo(username)
      );
  
      onValue(quizResultsQuery, (snapshot) => {
        const results: QuizResult[] = [];
  
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const result = {
              quizResultId: childSnapshot.key,
              ...childSnapshot.val(),
            };
            results.push(result);
          });
        }
  
        setResults(results);
      });
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      throw error; // Propagate the error
    }
  };
  