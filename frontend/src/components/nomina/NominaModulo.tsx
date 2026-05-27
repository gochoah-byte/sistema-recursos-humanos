import React, { useEffect, useState } from 'react';
import { NominaService } from '../../service/nomina.service';

interface DetalleNomina {
  id: number;
  empleado_nombre: string;
  salario_base: number;
  bonificaciones: number;
  deducciones: number;
  salario_neto: number;
}

interface PeriodoNomina {
  id: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  detalles?: DetalleNomina[];
}

export const NominaModulo: React.FC = () => {
  const [periodos, setPeriodos] = useState<PeriodoNomina[]>([]);
  const [periodoActivo, setPeriodoActivo] = useState<PeriodoNomina | null>(null);
  const [loading, setLoading] = useState(false);
  const [generando, setGenerando] = useState(false);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    cargarPeriodos();
  }, []);

  const cargarPeriodos = async () => {
    setLoading(true);
    try {
      const data = await NominaService.getPeriodos();
      setPeriodos(data);
    } catch (err) {
      setError('Error cargando períodos');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarNomina = async () => {
    if (!fechaInicio || !fechaFin) {
      setError('Debes seleccionar fecha de inicio y fin');
      return;
    }
    setGenerando(true);
    setError('');
    try {
      await NominaService.generarNomina({ fecha_inicio: fechaInicio, fecha_fin: fechaFin });
      alert('¡Nómina generada exitosamente!');
      cargarPeriodos();
    } catch (err) {
      setError('Error al generar la nómina');
    } finally {
      setGenerando(false);
    }
  };

  const handleVerDetalle = async (periodo: PeriodoNomina) => {
    try {
      const detalles = await NominaService.getDetalles(periodo.id);
      setPeriodoActivo({ ...periodo, detalles });
    } catch (err) {
      setError('Error cargando detalles');
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '24px', color: '#333' }}>Módulo de Nómina</h2>

      {error && (
        <div style={{ background: '#fee', border: '1px solid #fcc', padding: '10px', borderRadius: '6px', marginBottom: '16px', color: '#c00' }}>
          {error}
        </div>
      )}

      <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '28px' }}>
        <h3 style={{ marginBottom: '16px', color: '#444' }}>Generar Nueva Nómina</h3>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#555' }}>Fecha Inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', color: '#555' }}>Fecha Fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px' }}
            />
          </div>
          <button
            onClick={handleGenerarNomina}
            disabled={generando}
            style={{ padding: '8px 24px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' }}
          >
            {generando ? 'Generando...' : 'Generar Nómina'}
          </button>
        </div>
      </div>

      <h3 style={{ marginBottom: '12px', color: '#444' }}>Períodos de Nómina</h3>
      {loading ? (
        <p>Cargando...</p>
      ) : periodos.length === 0 ? (
        <p style={{ color: '#888' }}>No hay períodos generados aún.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '28px' }}>
          <thead>
            <tr style={{ background: '#1a237e', color: 'white' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '10px 14px', textAlign: 'left' }}>Fecha Inicio</th>
              <th style={{ padding: '10px 14px', textAlign: 'left' }}>Fecha Fin</th>
              <th style={{ padding: '10px 14px', textAlign: 'left' }}>Estado</th>
              <th style={{ padding: '10px 14px', textAlign: 'left' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {periodos.map((p, i) => (
              <tr key={p.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9', borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px 14px' }}>{p.id}</td>
                <td style={{ padding: '10px 14px' }}>{p.fecha_inicio}</td>
                <td style={{ padding: '10px 14px' }}>{p.fecha_fin}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ background: p.estado === 'CERRADO' ? '#fdecea' : '#e8f5e9', color: p.estado === 'CERRADO' ? '#c62828' : '#2e7d32', padding: '3px 10px', borderRadius: '12px', fontSize: '12px' }}>
                    {p.estado}
                  </span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <button
                    onClick={() => handleVerDetalle(p)}
                    style={{ padding: '5px 14px', background: '#1a237e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Ver Planilla
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {periodoActivo?.detalles && (
        <div>
          <h3 style={{ marginBottom: '12px', color: '#444' }}>
            Planilla — Período {periodoActivo.id} ({periodoActivo.fecha_inicio} al {periodoActivo.fecha_fin})
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#2e7d32', color: 'white' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left' }}>Empleado</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Salario Base</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Bonificaciones</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Deducciones</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>Salario Neto</th>
              </tr>
            </thead>
            <tbody>
              {periodoActivo.detalles.map((d, i) => (
                <tr key={d.id} style={{ background: i % 2 === 0 ? '#fff' : '#f9f9f9', borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px 14px' }}>{d.empleado_nombre}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>Q{d.salario_base?.toFixed(2)}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>Q{d.bonificaciones?.toFixed(2)}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>Q{d.deducciones?.toFixed(2)}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 'bold', color: '#2e7d32' }}>Q{d.salario_neto?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};