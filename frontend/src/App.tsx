import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Login } from './components/auth/Login';
import { Dashboard } from './components/shared/Dashboard';
import { MainLayout } from './components/layout/MainLayout';
import { Documentos } from './components/documentos/Documentos';
import { EmpleadosList } from './components/empleados/EmpleadosList';
// Importa tus otros componentes aquí... (Perfil, Nomina, etc.)

function App() {
  const [role, setRole] = useState<string | null>(localStorage.getItem('rol'));

  // Verificar si hay una sesión activa sin importar el rol
  const isAuthenticated = !!role;

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login setRole={setRole} />} />

        {/* RUTAS PRIVADAS (Para cualquier usuario logueado) */}
        <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/" />}>
          
          {/* Dashboard General (El componente Dashboard manejará qué mostrar según el rol) */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* === RUTAS ADMINISTRADOR === */}
          {role === 'ADMIN' && (
            <>
              <Route path="/usuarios" element={<div>Gestión de Usuarios</div>} />
              <Route path="/departamentos" element={<div>Departamentos</div>} />
              <Route path="/puestos" element={<div>Puestos</div>} />
              <Route path="/auditoria" element={<div>Auditoría</div>} />
              <Route path="/configuracion" element={<div>Configuración</div>} />
            </>
          )}

          {/* === RUTAS COMPARTIDAS (ADMIN y RRHH) === */}
          {(role === 'ADMIN' || role === 'RRHH') && (
            <>
              <Route path="/empleados" element={<EmpleadosList />} />
              <Route path="/documentos" element={<Documentos />} />
              <Route path="/nomina" element={<div>Nómina</div>} />
              <Route path="/reportes" element={<div>Reportes</div>} />
            </>
          )}

          {/* === RUTAS RRHH === */}
          {role === 'RRHH' && (
            <>
              <Route path="/asistencia" element={<div>Control de Asistencia</div>} />
              <Route path="/contratos" element={<div>Contratos</div>} />
            </>
          )}

          {/* === RUTAS EMPLEADO === */}
          {role === 'EMPLEADO' && (
            <>
              <Route path="/mi-perfil" element={<div>Mi Perfil</div>} />
              <Route path="/mis-pagos" element={<div>Mis Pagos</div>} />
              <Route path="/mis-vacaciones" element={<div>Mis Vacaciones</div>} />
            </>
          )}

          {/* Redirección por defecto al dashboard si entran a una ruta permitida pero base */}
          <Route path="/admin" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* CATCH ALL: Si la ruta no existe o no tiene permisos, va al login/dashboard */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;