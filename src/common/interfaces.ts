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

}

export interface QuizQuestion {
  questionTitle: string;
  options: QuizOption[];
  correctAnswer: number;
}

export interface QuizOption {
  optionText: string;
  isCorrect: boolean;
}