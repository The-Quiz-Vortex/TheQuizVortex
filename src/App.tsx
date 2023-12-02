import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './views/Home/Home.tsx';
import Signin from './components/Signin/Signin.tsx';
import Signup from './components/Signup/Signup.tsx';
import Header from './components/Header/Header.tsx';
import Dashboard from './components/Dashboard/Dashboard.tsx';
import { AuthContext } from './context/AuthContext.tsx';
import { useUserContext } from './helpers/useUserContext.ts';
import { ChakraProvider } from '@chakra-ui/react';
import _ from 'lodash';
import { CreateQuiz } from './components/CreateQuiz/CreateQuiz.tsx';
import MyProfile from './components/MyProfile/MyProfile.tsx';
import Quiz from './components/Quiz/Quiz.tsx';
import QuizList from './components/QuizList/QuizList.tsx';
import ManageUsers from './components/ManageUsers/ManageUsers.tsx';

function App() {
  const { loading, user, appState, setAppState } = useUserContext();

  return (
    <ChakraProvider>
      <div>
        {((!loading && user && !_.isEmpty(appState.userData)) || (!loading && !user)) && (
          <AuthContext.Provider value={{ ...appState, setUser: setAppState }}>
            <div>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sign-in" element={<Signin />} />
                <Route path="/sign-up" element={<Signup />} />
                <Route path="/create-quiz" element={<CreateQuiz />} />
                <Route path="/my-profile" element={<MyProfile />} />
                <Route path="/admin-settings" element={<ManageUsers />} />
                <Route path="/quiz/:id" element={<Quiz />} />
                <Route path="/quiz/quiz-list" element={<QuizList />} />
              </Routes>
            </div>
          </AuthContext.Provider>
        )}
      </div>
    </ChakraProvider>
  );
}

export default App;
