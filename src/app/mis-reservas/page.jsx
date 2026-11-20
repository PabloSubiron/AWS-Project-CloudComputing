import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './page.module.css';
import { api } from '../../lib/api';

const FACILITY_LABELS = {
    PADEL_CENTRAL: 'Pádel Central',
    PADEL_EXTERIOR: 'Pádel Exterior',
    PADEL: 'Pádel',
    ATLETISMO: 'Atletismo',
    PISCINA: 'Piscina',
};

export default function MisReservas() {
    const navigate = useNavigate();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('socio');
        if (!stored) {
            navigate('/login');
            return;
        }
        
        const socio = JSON.parse(stored);
        if (socio.isGuest) {
            navigate('/');
            return;
        }

        cargarReservas(socio.id);
    }, [navigate]);

    const cargarReservas = async (userId) => {
        try {
            setLoading(true);
            const data = await api.getUserReservations(userId);
            setReservas(data);
        } catch (err) {
            console.error(err);
            setError('Error al cargar reservas');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = async (id) => {
        if (!window.confirm("¿Seguro que quieres anular esta reserva?")) return;
        
        try {
            await api.deleteReservation(id);
            setReservas(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            alert(err.message);
        }
    };

    const formatearFecha = (fechaStr) => {
        const [year, month, day] = fechaStr.split('-').map(Number);
        const d = new Date(year, month - 1, day);
        return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <section className={styles.hero}>
                    <div className={styles.heroOverlay}>
                        <div className={styles.heroContent}>
                            <h1>Mis Reservas</h1>
                            <p className={styles.tagline}>Gestiona y consulta tus reservas activas</p>
                        </div>
                    </div>
                </section>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <span className={styles.loadingText}>Cargando reservas...</span>
                </div>
            </div>
        );
    }

    const hoy = new Date();
    const todayString = hoy.toISOString().split('T')[0];
    
    const proximas = reservas.filter(r => r.date >= todayString);
    const historicas = reservas.filter(r => r.date < todayString);

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroOverlay}>
                    <div className={styles.heroContent}>
                        <h1>Mis Reservas</h1>
                        <p className={styles.tagline}>Gestiona y consulta tus reservas activas</p>
                    </div>
                </div>
            </section>

            <div className={styles.container}>
                {error && <div className={styles.errorBox}>⚠️ {error}</div>}
                
                <h2 className={styles.sectionTitle}>Próximas Reservas</h2>
                {proximas.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📅</div>
                        No tienes reservas próximas.
                    </div>
                ) : (
                    <div className={styles.reservasList}>
                        {proximas.map(r => (
                            <div key={r.id} className={styles.reservaCard}>
                                <div className={styles.reservaInfo}>
                                    <span className={styles.facilityBadge}>{FACILITY_LABELS[r.facility] || r.facility}</span>
                                    <span className={styles.reservaDate}>{formatearFecha(r.date)}</span>
                                    {r.timeSlot && <span className={styles.reservaTime}>🕐 {r.timeSlot}h</span>}
                                </div>
                                <button className={styles.cancelBtn} onClick={() => handleCancelar(r.id)}>
                                    Anular reserva
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                <h2 className={styles.sectionTitleHistory}>Historial</h2>
                {historicas.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📋</div>
                        Sin reservas anteriores.
                    </div>
                ) : (
                    <div className={styles.historicasList}>
                        {historicas.map(r => (
                            <div key={r.id} className={styles.historicaCard}>
                                <span className={styles.historicaFacility}>{FACILITY_LABELS[r.facility] || r.facility}</span>
                                <span className={styles.historicaDate}>{formatearFecha(r.date)}</span>
                                {r.timeSlot && <span className={styles.historicaTime}>{r.timeSlot}h</span>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}