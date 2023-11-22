import './App.css'
import { Route, Routes } from 'react-router-dom';
import Home from './views/Home/Home.tsx';
import Signin from './components/Signin/Signin.tsx';
import Signup from './components/Signup/Signup.tsx';

function App() {


  return (
    <div>
      <Routes>
        <Route path='/home' element={<Home />} />
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<Signin />} />
        <Route path='/sign-up' element={<Signup />} />



      </Routes>
    </div>
  )
}

export default App
