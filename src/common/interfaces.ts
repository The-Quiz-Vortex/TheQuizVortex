export interface AppUser {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePictureURL: string;
  role: string;
  createdOn: Date;
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