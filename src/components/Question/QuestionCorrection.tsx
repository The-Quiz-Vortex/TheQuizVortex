import Question from "./Question.tsx";

function QuestionCorrection({ questions, selections }) {
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