import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => <div style={{ color: 'red' }}><h1>Panel de Administrador</h1><p>Conectado a la BD</p></div>;
const RRHHDashboard = () => <div style={{ color: 'green' }}><h1>Panel de RRHH</h1><p>Conectado a la BD</p></div>;
const EmpleadoDashboard = () => <div style={{ color: 'blue' }}><h1>Panel de Empleado</h1><p>Conectado a la BD</p></div>;

const Login = ({ setRole }: { setRole: (role: string) => void }) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:3000/usuarios/login', {
        correo,
        contrasena 
      });

      if (response.data && response.data.access_token) {
        const { access_token, usuario } = response.data;

        localStorage.setItem('token', access_token);
        localStorage.setItem('rol', usuario.rol);

        setRole(usuario.rol);

        if (usuario.rol === 'ADMIN') navigate('/admin');
        else if (usuario.rol === 'RRHH') navigate('/rrhh');
        else navigate('/empleado');
      }
    } catch (err: any) {
      setError('Correo o contraseña incorrectos');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '50px auto', maxWidth: '300px' }}>
      <h2>Login Real (DB)</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Correo" onChange={e => setCorreo(e.target.value)} style={{ width: '90%', marginBottom: '10px' }} required />
        <input type="password" placeholder="Contraseña" onChange={e => setContrasena(e.target.value)} style={{ width: '90%', marginBottom: '10px' }} required />
        <button type="submit" style={{ width: '100%' }}>Entrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

function App() {
  const [role, setRole] = useState<string | null>(localStorage.getItem('rol'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login setRole={setRole} />} />

        <Route path="/admin" element={role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/rrhh" element={role === 'RRHH' ? <RRHHDashboard /> : <Navigate to="/" />} />
        <Route path="/empleado" element={role === 'EMPLEADO' ? <EmpleadoDashboard /> : <Navigate to="/" />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;