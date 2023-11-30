interface ResultProps {
  wrong: number;
  correct: number;
  empty: number;
}

function Results({ wrong, correct, empty }: ResultProps) {

    return (
      <div className="result">
        <div className="result-item is-correct">
          <span className="result-count">{correct}</span>
          <span className="result-text">
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="css-i6dzq1"
              viewBox="0 0 24 24"
            >
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
              <path d="M22 4L12 14.01 9 11.01"></path>
            </svg>
            CORRECT
          </span>
        </div>
        <div className="result-item is-wrong">
          <span className="result-count">{wrong}</span>
          <span className="result-text">
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="css-i6dzq1"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M15 9L9 15"></path>
              <path d="M9 9L15 15"></path>
            </svg>
            WRONG
          </span>
        </div>
        <div className="result-item is-empty">
          <span className="result-count">{empty}</span>
          <span className="result-text">
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="css-i6dzq1"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 12L16 12"></path>
            </svg>
            EMPTY
          </span>
        </div>
      </div>
    );
  }

  export default Results;