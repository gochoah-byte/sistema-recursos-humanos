import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

export const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Links de navegación para el Sidebar
  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Empleados', path: '/empleados', icon: '👥' },
    { name: 'Documentos', path: '/documentos', icon: '📄' },
    { name: 'Nómina', path: '/nomina', icon: '💰' },
    { name: 'Usuarios', path: '/usuarios', icon: '🔐' },
    { name: 'Auditoría', path: '/auditoria', icon: '📋' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload(); // Recarga para limpiar los estados
  };

  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      
      {/* SIDEBAR (Barra Lateral Izquierda) */}
      <div className="w-64 bg-[#a4ab9a] rounded-tr-[100px] flex flex-col pt-12 pb-8 z-10 shadow-xl">
        <div className="px-8 mb-10">
          <h2 className="text-white text-2xl font-bold">RRHH</h2>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-full transition-all ${
                location.pathname === item.path 
                  ? 'bg-white text-[#a4ab9a] shadow-md font-bold' 
                  : 'text-white hover:bg-[#b2b9aa]'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="px-8 mt-auto">
          <button 
            onClick={handleLogout}
            className="text-white text-sm font-medium hover:underline"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* ÁREA CENTRAL */}
      <div className="flex-1 flex flex-col relative">
        
        {/* TOPBAR (Buscador Superior) */}
        <div className="h-24 flex items-center justify-center pt-8">
          <div className="w-[450px] bg-[#fbeae0] h-10 rounded-full flex items-center px-4 text-[#a4ab9a]">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              type="text" 
              className="bg-transparent border-none outline-none w-full text-gray-700 placeholder-[#a4ab9a]"
              placeholder="Buscar DPI o nombre..."
            />
          </div>
        </div>

        {/* CONTENIDO DE LA PÁGINA */}
        <div className="flex-1 overflow-y-auto px-16 pb-12 pt-8">
          <Outlet />
        </div>

      </div>
    </div>
  );
};