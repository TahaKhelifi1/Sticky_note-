import LandingPage from './components/Landing/LandingPage';
import './index.scss';
import './App.scss';
import SignUp from './components/Sign/SignUp'
import Login from './components/Sign/Login'
import NotesApp from './components/Notes/NotesApp';
import SettingsPage from './components/Settings/SettingsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResetPassword from './components/Sign/ResetPassword'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './Guards/ProtectedRoute';
import AuthProvider from './Context/AuthContext';
import NoteProvider from './Context/NoteContext';
import Admin from './components/Admin/AdminDashboard';

function App() {
  return (
    <AuthProvider>
    <NoteProvider>
    <Router basename="/">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path='/reset-password/:token' element={<ResetPassword/>}/>
        <Route path='/dashboard' element={<ProtectedRoute><NotesApp/></ProtectedRoute>}/>
        <Route path='/settings' element={<ProtectedRoute><SettingsPage/></ProtectedRoute>}/>
        <Route path='/admin' element={<ProtectedRoute><Admin/></ProtectedRoute>}/>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
    </Router>
    </NoteProvider>
    </AuthProvider>
    
  )
}

export default App
