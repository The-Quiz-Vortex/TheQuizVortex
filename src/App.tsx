import './App.css'
import { Route, Routes } from 'react-router-dom';
import Home from './views/Home/Home.tsx';
import Signin from './components/Signin/Signin.tsx';
import Signup from './components/Signup/Signup.tsx';
import { AuthContext } from './context/AuthContext.tsx';
import { useUserContext } from './helpers/useUserContext.ts';
import _ from 'lodash';

function App() {
  const {
    loading,
    user,
    appState,
    setAppState } = useUserContext()

  return (
    <>
      {((!loading && user && !_.isEmpty(appState.userData)) || (!loading && !user)) &&
        (<AuthContext.Provider value={{ ...appState, setUser: setAppState }}>
          <div>
            <Routes>
              <Route path='/home' element={<Home />} />
              <Route path='/' element={<Home />} />
              <Route path='/sign-in' element={<Signin />} />
              <Route path='/sign-up' element={<Signup />} />
            </Routes>
          </div>
        </AuthContext.Provider>)}
    </>
  )
}

export default App
