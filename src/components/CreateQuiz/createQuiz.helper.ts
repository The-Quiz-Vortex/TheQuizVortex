import { createQuizFormValues } from "./createQuiz.validation.ts";

//Model data from create quiz form to pass to addQuiz in the format of quiz interface
export const modelQuizRawData = (data: createQuizFormValues) => {
    const convertedData = {
        title: data.title,
        visibility: data.visibility[0].value,
        timeLimit: data.timeLimit,
        categories: data.categories.map(category => category.value),
        questions: data.question.map((question) => ({
            questionTitle: question.questionTitle,
            options: [
                { optionText: question.optionA, isCorrect: question.correctAnswer[0].value === 'optionA' },
                { optionText: question.optionB, isCorrect: question.correctAnswer[0].value === 'optionB' },
                { optionText: question.optionC, isCorrect: question.correctAnswer[0].value === 'optionC' },
                { optionText: question.optionD, isCorrect: question.correctAnswer[0].value === 'optionD' }
            ],
            correctAnswer: question.correctAnswer[0].value === 'optionA' ? 0 :
                           question.correctAnswer[0].value === 'optionB' ? 1 :
                           question.correctAnswer[0].value === 'optionC' ? 2 : 3,
            points: question.points
        })),
        totalPoints: data.question.reduce((total, question) => total + question.points, 0)
    };

    return convertedData;
}