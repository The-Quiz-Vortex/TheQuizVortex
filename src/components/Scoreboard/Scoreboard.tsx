import React, { useEffect, useState } from 'react';
import { getQuizResultsByUsername } from '../../services/quizResult.services';
import { QuizResult } from '../../common/interfaces';
import { getCurrentUser } from '../../services/auth.services';

const Scoreboard: React.FC = () => {
  const [userQuizResults, setUserQuizResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    const fetchUserQuizResults = async () => {
      try {
        // Fetch the current authenticated user
        const currentUser = await getCurrentUser();
  
        if (currentUser && currentUser.uid) {
          // Use the UID from the current user to fetch quiz results
          getQuizResultsByUsername(currentUser.uid, setUserQuizResults);
        } else {
          console.error('User not authenticated or UID is null');
        }
      } catch (error) {
        console.error('Error fetching quiz results:', error);
      }
    };
  
    fetchUserQuizResults();
  }, []);

  return (
    <div>
      <h2>Your Quiz Results</h2>
      {userQuizResults.length === 0 ? (
        <p>No quiz results available.</p>
      ) : (
        <ul>
          {userQuizResults.map((result) => (
            <li key={result.quizResultId}>
              <p>Quiz ID: {result.quizId}</p>
              <p>Score Points: {result.scorePoints}</p>
              <p>Score Percent: {result.scorePercent}</p>
              {/* Add more details as needed */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Scoreboard;
