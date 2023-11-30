import { QuizQuestion } from "../../common/interfaces.ts";
import Question from "./Question.tsx";

interface QuestionCorrectionProps {
  questions: QuizQuestion[];
  selections: (number | null)[];
}

function QuestionCorrection({ questions, selections }: QuestionCorrectionProps) {
    return (
      <div className="correction">
        {questions.map((question, i) => {
          return (
            <Question
              hasButton={false}
              markSelection={selections[i]}
              showAnswer={true}
              data={question}
            />
          );
        })}
      </div>
    );
  }

  export default QuestionCorrection;