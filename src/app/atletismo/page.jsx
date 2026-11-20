import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { api } from '../../lib/api';

const AFORO_MAX = 50;
const AFORO_GRUPO = 20;

// --- Ficha Técnica Atletismo ---
function FichaTecnicaAtletismo() {
    const [open, setOpen] = useState(false);
    return (
        <div style={{ marginBottom: '1.2rem' }}>
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    background: '#2d5a7b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.8rem 1.2rem',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    marginBottom: '0.5rem',
                }}
            >
                {open ? 'Ocultar ficha técnica' : 'Ver ficha técnica de la instalación'}
            </button>
            {open && (
                <div style={{
                    background: '#f8f9fc',
                    border: '1px solid #e0e7ef',
                    borderRadius: '8px',
                    padding: '1rem 1.2rem',
                    marginTop: '0.2rem',
                    fontSize: '0.98rem',
                    color: '#000000',
                }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li><strong>Ubicación:</strong> Complejo Deportivo Municipal, acceso por Av. del Deporte s/n.</li>
                        <li><strong>Horario:</strong> Lunes a domingo, 07:00 – 21:00.</li>
                        <li><strong>Normativa de uso:</strong> Uso exclusivo de calzado deportivo adecuado. Prohibido invadir los carriles reservados para entrenamientos. Respetar las indicaciones del personal.</li>
                        <li><strong>Material disponible:</strong> Vallas de atletismo, testigos de relevos, conos, cronómetro, acceso a vestuarios y duchas.</li>
                        <li><strong>Aforo máximo:</strong> 50 personas (20 plazas reservadas para grupo de entrenamiento).</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

function Atletismo() {
    const navigate = useNavigate();
    const [socio, setSocio] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [reservaHecha, setReservaHecha] = useState(false);
    
    // Grupo
    const [inscritoGrupo, setInscritoGrupo] = useState(false);
    const [grupoInscritos, setGrupoInscritos] = useState(0);
    const [grupoMensaje, setGrupoMensaje] = useState('');

    // Reservas del día seleccionado (count)
    const [reservasDiaCount, setReservasDiaCount] = useState(0);

    useEffect(() => {
        const stored = localStorage.getItem('socio');
        if (stored) setSocio(JSON.parse(stored));
    }, []);

    // Cargar info del grupo
    useEffect(() => {
        const userId = socio ? socio.id : null;
        api.getGroupInfo('ATLETISMO', userId).then(data => {
            setGrupoInscritos(data.count);
            setInscritoGrupo(data.isMember);
        });
    }, [socio]);

    // Cargar reservas del día
    useEffect(() => {
        if (selectedDate) {
            api.getReservations('ATLETISMO', selectedDate).then(data => {
                setReservasDiaCount(data.length);
            });
        }
    }, [selectedDate]);

    const getAforoDisponible = () => {
        return AFORO_MAX - AFORO_GRUPO - reservasDiaCount;
    };

    const getDaysInMonth = (date) =>
        new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const getFirstDayOfMonth = (date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return (firstDay - 1 + 7) % 7;
    };

    const handleDateSelect = (day) => {
        const today = new Date(); today.setHours(0,0,0,0);
        const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        if (selected < today) return;
        setSelectedDate(selected);
        setShowCalendar(false);
        setReservaHecha(false);
    };

    const handleReservar = async () => {
        if (!socio) { navigate('/login'); return; }
        if (socio.isGuest) {
            alert('Los invitados no pueden reservar. Inicia sesión con una cuenta de socio.');
            return;
        }
        if (!selectedDate) return;
        if (getAforoDisponible() <= 0) return;

        try {
            await api.createReservation({
                facility: 'ATLETISMO',
                date: selectedDate,
                userId: socio.id
            });
            setReservasDiaCount(prev => prev + 1);
            setReservaHecha(true);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleUnirseGrupo = async () => {
        if (!socio) { navigate('/login'); return; }
        if (socio.isGuest) {
            alert('Los invitados no pueden unirse a grupos.');
            return;
        }
        try {
            await api.joinGroup('ATLETISMO', socio.id);
            setInscritoGrupo(true);
            setGrupoInscritos(prev => prev + 1);
            setGrupoMensaje('¡Te has unido al grupo de entrenamiento!');
        } catch (err) {
            alert(err.message);
        }
    };

    const handlePrevMonth = () =>
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    const handleNextMonth = () =>
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

    const today = new Date(); today.setHours(0,0,0,0);
    const grupoPct = Math.round((grupoInscritos / AFORO_GRUPO) * 100);

    const renderCalendar = () => {
        const days = [];
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`e-${i}`} className={styles.calendarEmptyDay}></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const today = new Date(); today.setHours(0,0,0,0);
            const isPast = date < today;
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

            days.push(
                <div
                    key={day}
                    className={`${styles.calendarDay} ${isPast ? styles.calendarDayPast : ''} ${isSelected ? styles.selected : ''}`}
                    onClick={() => !isPast && handleDateSelect(day)}
                >
                    {day}
                </div>
            );
        }
        return days;
    };

    const aforoHoy = selectedDate ? getAforoDisponible() : AFORO_MAX - AFORO_GRUPO;

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroImage}>
                    <img src="images/atletismo1.jpeg" alt="Atletismo"
                        style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                </div>
                <div className={styles.heroOverlay}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroBadge}>Instalación disponible</div>
                        <h1>Pista de Atletismo</h1>
                        <p className={styles.tagline}>400 metros · 6 carriles · Superficie sintética de alta calidad</p>
                    </div>
                </div>
            </section>

            <div className={styles.container}>
                <section className={styles.infoSection}>
                    <img src="images/AtletaL.jpeg" alt="Pista de Atletismo"
                        style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                </section>

                <section className={styles.formSection}>
                    <div className={styles.pistaContainer}>
                        <h2 className={styles.pistaTitle}>Pista de Atletismo</h2>
                        {/* Ficha técnica desplegable */}
                        <FichaTecnicaAtletismo />

                        <p className={styles.pistaDescription}>
                            Pista de atletismo de 400 metros con 6 carriles y superficie sintética de alta calidad. Ideal para entrenar y competir a cualquier nivel.
                        </p>

                        <div className={styles.detailsBox}>
                            <h3 className={styles.detailsBoxTitle}>Detalles de la instalación</h3>
                            <div className={styles.detailItem}>
                                <span className={styles.detailIcon}>🕐</span>
                                <div className={styles.detailContent}>
                                    <strong>Horario</strong>
                                    <p>07:00 – 21:00</p>
                                </div>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailIcon}>👥</span>
                                <div className={styles.detailContent}>
                                    <strong>Aforo máximo</strong>
                                    <p>{AFORO_MAX} personas (incluyendo grupos de entrenamiento)</p>
                                </div>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailIcon}>📍</span>
                                <div className={styles.detailContent}>
                                    <strong>Acceso</strong>
                                    <p>Con tarjeta de socio. Entrada libre hasta completar aforo.</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.grupoBox}>
                            <h3 className={styles.grupoBoxTitle}>🏃 Grupo de Entrenamiento · Martes y Jueves 18:00h - 19:30h</h3>
                            <p className={styles.grupoBoxDesc}>
                                Sesiones dirigidas por monitor. Entrenamiento funcional para todos los niveles. El grupo reduce {AFORO_GRUPO} plazas del aforo general.
                            </p>
                            <div className={styles.grupoProgress}>
                                <div className={styles.grupoProgressLabel}>
                                    <span>Plazas ocupadas</span>
                                    <span>{grupoInscritos}/{AFORO_GRUPO}</span>
                                </div>
                                <div className={styles.grupoProgressBar}>
                                    <div className={styles.grupoProgressFill} style={{ width: `${grupoPct}%` }}></div>
                                </div>
                            </div>
                            {!inscritoGrupo ? (
                                <button
                                    className={styles.grupoBtn}
                                    onClick={handleUnirseGrupo}
                                    disabled={grupoInscritos >= AFORO_GRUPO}
                                >
                                    {grupoInscritos >= AFORO_GRUPO ? 'Grupo completo' : 'Unirse al grupo de entrenamiento'}
                                </button>
                            ) : (
                                <div className={styles.grupoSuccessMsg}>
                                    ✅ Ya estás inscrito en este grupo
                                </div>
                            )}
                            {grupoMensaje && !inscritoGrupo && (
                                <div className={styles.grupoSuccessMsg}>{grupoMensaje}</div>
                            )}
                        </div>

                        <div className={styles.reservasBox}>
                            <h3 className={styles.reservasBoxTitle}>📅 Reserva de entrada individual</h3>
                            <p className={styles.reservasBoxText}>
                                Accede libremente durante el horario. Plazas individuales disponibles hoy: <strong>{AFORO_MAX - AFORO_GRUPO} plazas</strong>
                            </p>
                        </div>

                        <div className={styles.reservarContainer}>
                            <button
                                className={styles.reservarBtn}
                                onClick={() => setShowCalendar(!showCalendar)}
                            >
                                📅 {selectedDate
                                    ? selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
                                    : 'Seleccionar fecha de visita'}
                            </button>

                            {showCalendar && (
                                <div className={styles.calendarPopup}>
                                    <div className={styles.calendarHeader}>
                                        <button className={styles.calendarNav} onClick={handlePrevMonth}>←</button>
                                        <h3 className={styles.calendarMonth}>
                                            {currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                        </h3>
                                        <button className={styles.calendarNav} onClick={handleNextMonth}>→</button>
                                    </div>
                                    <div className={styles.calendarWeekDays}>
                                        {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map(d =>
                                            <div key={d}>{d}</div>)}
                                    </div>
                                    <div className={styles.calendarDays}>{renderCalendar()}</div>
                                </div>
                            )}
                        </div>

                        {selectedDate && !reservaHecha && (
                            <div className={styles.confirmBox}>
                                <div className={styles.confirmInfo}>
                                    <p>📅 {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                    <p>🏃 Acceso libre · Horario completo 07:00 – 21:00</p>
                                    <p>👥 Plazas disponibles ese día: <strong>{aforoHoy}</strong></p>
                                    {socio && <p>👤 {socio.nombre}</p>}
                                </div>
                                <button className={styles.confirmBtn} onClick={handleReservar}>
                                    {socio ? 'Confirmar entrada' : 'Iniciar sesión para reservar'}
                                </button>
                            </div>
                        )}

                        {reservaHecha && (
                            <div className={styles.successBox}>
                                <div className={styles.successIcon}>✅</div>
                                <h4>¡Entrada confirmada!</h4>
                                <p>{selectedDate?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                <button
                                    className={styles.newReservaBtn}
                                    onClick={() => {
                                        setReservaHecha(false);
                                        setSelectedDate(null);
                                    }}
                                >
                                    Reservar otro día
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Atletismo;