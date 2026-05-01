import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Login } from './components/auth/Login';
import { Dashboard } from './components/shared/Dashboard';
import { MainLayout } from './components/layout/MainLayout';
import { Documentos } from './components/documentos/Documentos';

function App() {
  const [role, setRole] = useState<string | null>(localStorage.getItem('rol'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setRole={setRole} />} />

        {/* El Layout envuelve al Dashboard */}
        <Route element={role === 'ADMIN' ? <MainLayout /> : <Navigate to="/" />}>
  <Route path="/admin" element={<Dashboard />} />
  <Route path="/documentos" element={<Documentos />} /> {/* 👈 ESTE */}
</Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;