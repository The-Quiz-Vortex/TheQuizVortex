import { get, push, ref, update } from "firebase/database";
import { db } from "../config/firebase-config.ts";

export const saveQuizResult = async (
    selection: (number | null)[], 
    quizId: string, 
    username: string, 
    scorePoints: number,
    scorePercent: number) => {
    try {
        const result = await push(ref(db, 'quizResults'), {
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
    } catch (error) {
        console.error(error);
    }
};

export const getQuizResultId = async (id: string) => {
    try {
        const result = await get(ref(db, `quizResults/${id}`));

        if (!result.exists()) {
            throw new Error(`Quiz result with id ${id} does not exist!`);
        }

        const quizResult = result.val();

        return quizResult;
    } catch (error) {
        console.error(error);
    }
};