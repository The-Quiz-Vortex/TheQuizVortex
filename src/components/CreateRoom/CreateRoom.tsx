import { Input } from '@chakra-ui/react';
import { getAllQuizzes } from '../../services/quiz.services';
import { useUserContext } from '../../helpers/useUserContext';
import { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/users.services';
import Select from 'react-select';

const CreateRoom = () => {
  const { appState } = useUserContext();
  const [quizzes, setQuizzes] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    // Fetch data when the component mounts
    // Assuming getAllQuizzes and getAllUsers are asynchronous functions
    const fetchData = async () => {
      // Fetch quizzes
      const quizzesData = await getAllQuizzes();
      setQuizzes(quizzesData);

      // Fetch students
      const studentsData = await getAllUsers();
      setStudents(studentsData);
    };

    fetchData();
  }, []); // Empty dependency array to fetch data only once

  return (
    <>
      <Input placeholder="small size" size="sm" />

      <Select
        isMulti
        name="quizzes"
        options={quizzes
          .filter((quiz) => quiz.author === appState.userData?.username)
          .map((quiz) => ({ label: quiz.title, value: quiz.id }))}
        value={selectedQuizzes}
        onChange={(selectedOptions) => setSelectedQuizzes(selectedOptions)}
        className="basic-multi-select"
        classNamePrefix="select"
      />

      <Select
        isMulti
        name="students"
        options={students
          .filter((user) => user.role === 'student')
          .map((user) => ({ label: user.username, value: user.uid }))}
        value={selectedStudents}
        onChange={(selectedOptions) => setSelectedStudents(selectedOptions)}
        className="basic-multi-select"
        classNamePrefix="select"
      />
    </>
  );
};

export default CreateRoom;
