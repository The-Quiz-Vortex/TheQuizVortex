export interface AppUser {
  uid: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePictureURL: string;
  role: string;
  createdOn: Date;
  blockedStatus: boolean;
}

export interface Quiz {
  title: string;
  timeLimit: number;
  visibility: string;
  categories: number[];
  questions: QuizQuestion[];
  author: string;
  createdOn: Date;
  totalPoints: number;
  quizId: string;
  passScore: number;
}

//Single quiz question
export interface QuizQuestion {
  questionTitle: string;
  options: QuizOption[];
  correctAnswer: number;
  points: number;
}

// Quiz options - A/B/C/D
export interface QuizOption {
  optionText: string;
  isCorrect: boolean;
}

export interface QuizResult {
  quizId: string;
  username: string;
  score: number;
  selectionArr: number[] | string[];
  completedAt: Date;
}
