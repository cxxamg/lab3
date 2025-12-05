import './styles/App.css'
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import LoginPage from './components/pages/LoginPage';
import MainPage from './components/pages/MainPage';
import RegistrationPage from './components/pages/RegistrationPage';
import { ProtectedRoute } from './router/ProtectedRouter';

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/registration" element={<RegistrationPage />}/>
          <Route path="/main" element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
            }
            />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>

  
  )
}


