import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Login } from './components/auth/Login';
import { Dashboard } from './components/shared/Dashboard';
import { MainLayout } from './components/layout/MainLayout';
import { Documentos } from './components/documentos/Documentos';
import { EmpleadosList } from './components/empleados/EmpleadosList';

function App() {
  const [role, setRole] = useState<string | null>(localStorage.getItem('rol'));

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login setRole={setRole} />} />

        {/* RUTAS PRIVADAS */}
        <Route element={role === 'ADMIN' ? <MainLayout /> : <Navigate to="/" />}>

          <Route path="/admin" element={<Dashboard />} />
          <Route path="/empleados" element={<EmpleadosList />} />
          <Route path="/documentos" element={<Documentos />} />

        </Route>

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;