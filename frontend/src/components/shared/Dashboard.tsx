import React from 'react';
import { AdminDashboard } from './AdminDashboard.tsx'; // Mueve tu código actual aquí
import { RrhhDashboard } from './RrhhDashboard.tsx'; // Crea uno para RRHH
import { EmpleadoDashboard } from './EmpleadoDashboard.tsx'; // Crea uno para el Empleado

export const Dashboard: React.FC = () => {
  const role = localStorage.getItem('rol');

  // Renderizado condicional del dashboard principal
  switch (role) {
    case 'ADMIN':
      return <AdminDashboard />; // Tu código actual de Dashboard va dentro de este componente
    case 'RRHH':
      return <RrhhDashboard />;
    case 'EMPLEADO':
      return <EmpleadoDashboard />;
    default:
      return <div>Rol no reconocido.</div>;
  }
};