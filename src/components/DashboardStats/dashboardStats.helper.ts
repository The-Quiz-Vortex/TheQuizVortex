import { Quiz, QuizResult } from "../../common/interfaces.ts";

export const getOpenQuizzes = (allQuizzes: Quiz[]) => allQuizzes?.filter(quiz => quiz?.finishDate >= Date.now());
export const getPassedQuizResultsLastWeek = (allQuizzes: Quiz[], quizResultsLastWeek: QuizResult[]) => quizResultsLastWeek?.filter(result => allQuizzes.find(quiz => quiz.quizId === result.quizId)?.passingScore <= result.scorePercent);
export const getFailedQuizResultsLastWeek = (allQuizzes: Quiz[], quizResultsLastWeek: QuizResult[]) => quizResultsLastWeek?.filter(result => allQuizzes?.find(quiz => quiz.quizId === result.quizId)?.passingScore > result.scorePercent);
export const getPercentageScore = (quizzes: QuizResult[] | Quiz[], allResults: QuizResult[]) => `${(quizzes.reduce((sum, q) => sum + allResults?.find(r => r.quizId === q.quizId)?.scorePercent || 0, 0) / quizzes.length) || 0}%`;

export const filterQuizzesByResults = (allQuizzes: Quiz[], results: QuizResult[]) => allQuizzes.filter(q => !!results.find(r => r.quizId === q.quizId));