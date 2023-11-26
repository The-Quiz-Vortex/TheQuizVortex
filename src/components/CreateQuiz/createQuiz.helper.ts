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
        options: question.options.map((option, index) => ({
          optionText: option.optionText,
          isCorrect: question.correctAnswer[0].value === `option${index + 1}`
        })),
        correctAnswer: Number(question.correctAnswer[0].value.slice(6)) - 1,
        points: question.points
      })),
      totalPoints: data.question.reduce((total, question) => total + question.points, 0)
    };
  
    return convertedData;
  }
  