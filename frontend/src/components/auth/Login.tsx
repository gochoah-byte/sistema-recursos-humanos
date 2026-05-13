import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../service/api';

interface LoginProps {
  setRole: (role: string | null) => void;
}

export const Login: React.FC<LoginProps> = ({ setRole }) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Usamos la instancia "api" en lugar de la URL completa
      const response = await api.post('/usuarios/login', {
        correo,
        contrasena,
      });

      if (response.data && response.data.access_token) {
        const { access_token, usuario } = response.data;

        // Guardamos los datos de la sesión
        localStorage.setItem('token', access_token);
        localStorage.setItem('rol', usuario.rol);
        
        // Guardamos empleado_id si existe (para empleados)
        // Si no existe (como en Admin), lo removemos del localStorage
        if (usuario.empleado_id) {
          localStorage.setItem('empleadoId', usuario.empleado_id);
        } else {
          localStorage.removeItem('empleadoId');
        }

        setRole(usuario.rol);

        // Redirigimos según el rol (como lo tenías configurado)
        if (usuario.rol === 'ADMIN') navigate('/admin');
        else if (usuario.rol === 'RRHH') navigate('/rrhh');
        else navigate('/empleado');
      }
    } catch (err: any) {
      setError('Correo o contraseña incorrectos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9e9d9] flex items-center justify-center p-4">
      {/* Tarjeta con esquinas redondeadas simulando un folder */}
      <div className="bg-white p-10 w-full max-w-md rounded-tr-[40px] rounded-bl-[15px] shadow-lg border border-[#f3dec9]">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#8c967a]">Sistema de RRHH</h1>
          <p className="text-[#5a5a5a] mt-2">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[#5a5a5a] font-medium mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#94a187]"
              placeholder="admin@empresa.com"
              required
            />
          </div>

          <div>
            <label className="block text-[#5a5a5a] font-medium mb-2">Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#94a187]"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#94a187] hover:bg-[#8c967a] text-white font-bold py-3 px-4 rounded-tr-[20px] rounded-bl-[10px] transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Iniciando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};