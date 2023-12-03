import {
  get,
  set,
  ref,
  remove,
  query,
  equalTo,
  orderByChild,
  update,
  push,
} from 'firebase/database';
import { db } from '../config/firebase-config.ts';
import { DataSnapshot } from 'firebase/database';
import { QuizFormData } from '../components/CreateQuiz/CreateQuiz.tsx';

const fromQuizDocument = async (snapshot: DataSnapshot) => {
  try {
    const quizDocument = snapshot.val();

    return Object.keys(quizDocument).map((key) => {
      const quiz = quizDocument[key];

      return {
        ...quiz,
        id: key,
        createdOn: new Date(quiz.createdOn),
      };
    });
  } catch (error) {
    console.error(error);
  }
};

export const addQuiz = async (content: QuizFormData, username: string) => {
  try {
    const result = await push(ref(db, 'quizzes'), {
      ...content,
      author: username,
      createdOn: Date.now(),
    });
    if (result.key) {
      const updateQuizId: { [key: string]: string | null | string[] } = {};
      updateQuizId[`/quizzes/${result.key}/quizId`] = result.key;
      await update(ref(db), updateQuizId);
      return getQuizById(result.key);
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateQuiz = async (id: string) => {
  try {
    const quizRef = ref(db, `quizzes/${id}`);
    await update(quizRef, {
      updatedOn: Date.now(),
    });
    const result = await getQuizById(id);
    return result;
  } catch (error) {
    console.error(error);
  }
};

export const getAllQuizzes = async () => {
  try {
    const snapshot = await get(ref(db, 'quizzes'));

    if (!snapshot.exists()) {
      return [];
    }

    return fromQuizDocument(snapshot);
  } catch (error) {
    console.error(error);
  }
};

export const getQuizById = async (id: string) => {
  try {
    const result = await get(ref(db, `quizzes/${id}`));

    if (!result.exists()) {
      throw new Error(`Quiz with id ${id} does not exist!`);
    }

    const quiz = result.val();
    quiz.id = id;
    quiz.createdOn = new Date(quiz.createdOn);

    return quiz;
  } catch (error) {
    console.error(error);
  }
};

export const deleteQuizById = async (id: string) => {
  try {
    await remove(ref(db, `quizzes/${id}`));
  } catch (error) {
    console.error(error);
  }
};

export const getQuizzesByAuthor = async (username: string) => {
  try {
    const snapshot = await get(
      query(ref(db, 'quizzes'), orderByChild('author'), equalTo(username))
    );

    if (!snapshot.exists()) {
      return [];
    }

    return fromQuizDocument(snapshot);
  } catch (error) {
    console.error(error);
  }
};

export const getQuizzesByTitle = async (title: string) => {
  try {
    const snapshot = await get(query(ref(db, 'quizzes'), orderByChild('title'), equalTo(title)));

    if (!snapshot.exists()) {
      return [];
    }

    return fromQuizDocument(snapshot);
  } catch (error) {
    console.error(error);
  }
};
