import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/Login/LoginPage';
import LoginPageAdmin from './pages/admin/LoginPageAdmin';
import React from 'react';
import CreateDepartment from './pages/admin/CreateDepartement';
import CreatePrinter from './pages/admin/CreatePrinter';
import CreateTeacher from './pages/Chef/CreateTeacher';
import Home from './pages/home/Home';
import { AuthProvider } from './pages/context/AuthContext'; // Créez ce fichier (voir ci-dessous)
import Dashboard from './pages/Chef/dashboard';
import CreatePrintRequest from './pages/Enseignant/CreatePrintRequest';
import TeacherDashboard from './pages/Enseignant/TeacherDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import ShowRequestTeacher from './pages/Enseignant/ShowRequestTeacher';
import ShowRequestChef from './pages/Chef/ShowRequestChef';
import PrinterDashboard from './pages/Imprimeur/PrinterDashboard';
import ShowRequestPrinter from './pages/Imprimeur/ShowRequestPrinter'; 
import ShowRequestAdmin from './pages/admin/ShowPrintRequestAdmin';  
function App() {
  return (
    <AuthProvider>
      
        <Routes>
         <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/loginAdmin" element={<LoginPageAdmin />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/CreateDepartment" element={<CreateDepartment />} />
          <Route path="/CreatePrinter" element={<CreatePrinter />} />
          <Route path="/CreateTeacher" element={<CreateTeacher />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/CreatePrintRequest" element={<CreatePrintRequest />} />
          <Route path="/teacherDashboard" element={<TeacherDashboard />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/PrintRequest/:id" element={<ShowRequestTeacher />} />
          <Route path="/PrintRequestChef/:id" element={<ShowRequestChef />} />
          <Route path="/PrinterDashboard" element={<PrinterDashboard />} />
          <Route path="/PrintRequestPrinter/:id" element={<ShowRequestPrinter />} />
          <Route path="/PrintRequestAdmin/:id" element={<ShowRequestAdmin />} />
        </Routes>
      
    </AuthProvider>
  );
}

export default App;

