import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './views/Home/Home.tsx';
import Signin from './components/Signin/Signin.tsx';
import Signup from './components/Signup/Signup.tsx';
import Header from './components/Header/Header.tsx';
import { AuthContext } from './context/AuthContext.tsx';
import { useUserContext } from './helpers/useUserContext.ts';
import { ChakraProvider } from '@chakra-ui/react';
import _ from 'lodash';
import { CreateQuiz } from './components/CreateQuiz/CreateQuiz.tsx';
import CreateRoom from './components/CreateRoom/CreateRoom.tsx';
import MyProfile from './components/MyProfile/MyProfile.tsx';
import Quiz from './components/Quiz/Quiz.tsx';
import ManageUsers from './components/ManageUsers/ManageUsers.tsx';
import Scoreboard from './components/Scoreboard/Scoreboard.tsx';
import MyClassrooms from './components/MyClassrooms/MyClassrooms.tsx';
import BrowseQuizzes from './components/BrowseQuizzes/BrowseQuizzes.tsx';
import SingleClassroom from './components/SingleClassroom/SingleClassroom.tsx';
import Footer from './views/Footer/Footer.tsx';
import DashboardsStats from './components/DashboardStats/DashboardsStats.tsx';
import ScrollToTop from './components/ScrollToTop/ScrollToTop.tsx';
import EditQuiz from './components/EditQuiz/EditQuiz.tsx';
import React, { useState } from "react";

function App() {
  const { loading, user, appState, setAppState } = useUserContext();
  const [editMode, setEditMode] = useState<string | null>(null);

  return (
    <ChakraProvider>
      <div>
        {((!loading && user && !_.isEmpty(appState.userData)) || (!loading && !user)) && (
          <AuthContext.Provider value={{ ...appState, setUser: setAppState }}>
            <div>
              <Header />
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<DashboardsStats />} />
                <Route path="/dashboard-stats" element={<DashboardsStats />} />
                <Route path="/sign-in" element={<Signin />} />
                <Route path="/sign-up" element={<Signup />} />
                <Route path="/create-quiz" element={<CreateQuiz />} />
                <Route path="/create-room" element={<CreateRoom />} />
                <Route path="/my-classrooms" element={<MyClassrooms />} />
                <Route path="/classroom/:classRoomName" element={<SingleClassroom />} />
                <Route path="/my-profile" element={<MyProfile />} />
                <Route path="/admin-settings" element={<ManageUsers />} />
                <Route path="/quiz/:id" element={<Quiz />} />
                <Route path="/browse-quizzes" element={<BrowseQuizzes />} />
                <Route path="/scoreboard" element={<Scoreboard />} />
                <Route path="/edit-quiz/:quizId" element={<EditQuiz setEditMode={setEditMode} />} />
              </Routes>
            </div>
          </AuthContext.Provider>
        )}
      </div>
      <Footer />
    </ChakraProvider>
  );
}

export default App;
