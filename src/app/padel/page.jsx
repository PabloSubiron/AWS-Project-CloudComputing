import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { api } from '../../lib/api';

const TIME_SLOTS = [
    '08:00', '09:30', '11:00', '12:30',
    '14:00', '15:30', '17:00', '18:30', '20:00', '21:30'
];

// --- Ficha Técnica Pádel ---
function FichaTecnicaPadel() {
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
                        <li><strong>Ubicación:</strong> Zona exterior y pabellón central del complejo deportivo.</li>
                        <li><strong>Horario:</strong> Lunes a domingo, 08:00 – 23:00.</li>
                        <li><strong>Normativa de uso:</strong> Reservar antes de jugar. Prohibido acceder con calzado inadecuado. Mantener la pista limpia. Respetar el tiempo de reserva.</li>
                        <li><strong>Material disponible:</strong> Palas de préstamo, pelotas, marcador, bancos, iluminación LED, acceso a vestuarios y duchas.</li>
                        <li><strong>Aforo máximo:</strong> 4 personas por pista.</li>
                    </ul>
                </div>
            )}
        </div>
    );
}

function Padel() {
    const navigate = useNavigate();
    const [socio, setSocio] = useState(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedPista, setSelectedPista] = useState('PADEL_CENTRAL');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [reservaHecha, setReservaHecha] = useState(false);
    const [reservasDia, setReservasDia] = useState([]); // Solo reservas del día seleccionado

    useEffect(() => {
        const stored = localStorage.getItem('socio');
        if (stored) setSocio(JSON.parse(stored));
    }, []);

    // Cargar reservas cuando cambia la fecha seleccionada o pista
    useEffect(() => {
        if (selectedDate) {
            api.getReservations(selectedPista, selectedDate)
                .then(data => setReservasDia(data))
                .catch(err => console.error(err));
        }
    }, [selectedDate, selectedPista]);

    const getDaysInMonth = (date) =>
        new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const getFirstDayOfMonth = (date) => {
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return (firstDay - 1 + 7) % 7;
    };

    const isSlotOccupied = (slot) => {
        return reservasDia.some(r => r.timeSlot === slot);
    };

    const handleDateSelect = (day) => {
        const today = new Date(); today.setHours(0,0,0,0);
        const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        if (selected < today) return;
        
        // Ajuste zona horaria si es necesario
        setSelectedDate(selected);
        setSelectedSlot(null);
        setShowCalendar(false);
        setReservaHecha(false);
    };

    const handleConfirmar = async () => {
        if (!socio) { navigate('/login'); return; }
        if (socio.isGuest) {
            alert('Los invitados no pueden reservar. Inicia sesión con una cuenta de socio.');
            return;
        }
        if (!selectedDate || !selectedSlot) return;

        try {
            await api.createReservation({
                facility: selectedPista,
                date: selectedDate,
                timeSlot: selectedSlot,
                userId: socio.id
            });
            // Recargar reservas para bloquear el slot visualmente
            const updated = await api.getReservations(selectedPista, selectedDate);
            setReservasDia(updated);
            setReservaHecha(true);
        } catch (err) {
            alert(err.message);
        }
    };

    const handlePrevMonth = () =>
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

    const handleNextMonth = () =>
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));

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
                    className={`${styles.calendarDay} ${isPast ? styles.calendarDayPast : ''} ${isSelected ? styles.calendarDatSelected : ''}`}
                    onClick={() => !isPast && handleDateSelect(day)}
                >
                    {day}
                </div>
            );
        }
        return days;
    };

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroImage}>
                    <img src="images/Arturo-Coello.jpg" alt="Pádel"
                        style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                </div>
                <div className={styles.heroOverlay}>
                    <div className={styles.heroContent}>
                        <div className={styles.heroBadge}>Instalación disponible</div>
                        <h1>Reserva tu pista de pádel</h1>
                        <p className={styles.tagline}>Pista profesional · Iluminación LED · Césped artificial</p>
                    </div>
                </div>
            </section>

            <div className={styles.container}>
                <section className={styles.infoSection}>
                    <img src="images/PistaPadel.jpeg" alt="Pista de Pádel"
                        style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                </section>

                <section className={styles.formSection}>
                    <div className={styles.pistaContainer}>
                        <h2 className={styles.pistaTitle}>Pista de Pádel</h2>
                        {/* Ficha técnica desplegable */}
                        <FichaTecnicaPadel />
                        
                        <p className={styles.pistaDescription}>
                            Pista de pádel profesional con iluminación LED y superficie de césped artificial de última generación. Perfecta para partidos individuales o dobles.
                        </p>

                        <div className={styles.detailsBox}>
                            <h3 className={styles.detailsBoxTitle}>Detalles de la instalación</h3>
                            
                            <div className={styles.pistaSelector}>
                                <button 
                                    className={`${styles.pistaOption} ${selectedPista === 'PADEL_CENTRAL' ? styles.pistaOptionActive : ''}`}
                                    onClick={() => {
                                        setSelectedPista('PADEL_CENTRAL');
                                        setSelectedSlot(null);
                                        setReservaHecha(false);
                                    }}
                                >
                                    <span className={styles.pistaOptionIcon}>🏟️</span>
                                    <span className={styles.pistaOptionName}>Pista Central</span>
                                    <span className={styles.pistaOptionLocation}>Complejo deportivo</span>
                                </button>
                                <button 
                                    className={`${styles.pistaOption} ${selectedPista === 'PADEL_EXTERIOR' ? styles.pistaOptionActive : ''}`}
                                    onClick={() => {
                                        setSelectedPista('PADEL_EXTERIOR');
                                        setSelectedSlot(null);
                                        setReservaHecha(false);
                                    }}
                                >
                                    <span className={styles.pistaOptionIcon}>🌿</span>
                                    <span className={styles.pistaOptionName}>Pista Exterior</span>
                                    <span className={styles.pistaOptionLocation}>Cercanías</span>
                                </button>
                            </div>

                            <div className={styles.detailItem}>
                                <span className={styles.detailIcon}>🕐</span>
                                <div className={styles.detailContent}>
                                    <strong>Horario</strong>
                                    <p>08:00 – 23:00</p>
                                </div>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailIcon}>⏱️</span>
                                <div className={styles.detailContent}>
                                    <strong>Duración de la reserva</strong>
                                    <p>90 minutos por sesión</p>
                                </div>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.detailIcon}>👥</span>
                                <div className={styles.detailContent}>
                                    <strong>Jugadores</strong>
                                    <p>2 a 4 jugadores por pista</p>
                                </div>
                            </div>

                            <div className={styles.detailItem}>
                                <span className={styles.detailIcon}>📍</span>
                                <div className={styles.detailContent}>
                                    <strong>Acceso</strong>
                                    <p>Con tarjeta de socio.</p>
                                </div>
                            </div>                            
                        </div>

                        {/* Selector de fecha */}
                        <div className={styles.reservarContainer}>
                            <button
                                className={styles.reservarBtn}
                                onClick={() => setShowCalendar(!showCalendar)}
                            >
                                📅 {selectedDate
                                    ? selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
                                    : 'Seleccionar fecha'}
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

                        {/* Selector de franja horaria */}
                        {selectedDate && !reservaHecha && (
                            <div className={styles.slotsSection}>
                                <h4 className={styles.slotsSectionTitle}>
                                    Franjas disponibles · {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
                                </h4>
                                <div className={styles.slotsGrid}>
                                    {TIME_SLOTS.map(slot => {
                                        const occupied = isSlotOccupied(slot);
                                        const selected = selectedSlot === slot;
                                        return (
                                            <button
                                                key={slot}
                                                className={`${styles.slotBtn} ${occupied ? styles.slotOccupied : ''} ${selected ? styles.slotSelected : ''}`}
                                                disabled={occupied}
                                                onClick={() => setSelectedSlot(slot)}
                                            >
                                                {slot}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className={styles.slotLegend}>
                                    <span className={styles.legendFree}>■ Libre</span>
                                    <span className={styles.legendSelected}>■ Seleccionado</span>
                                    <span className={styles.legendOccupied}>■ Ocupado</span>
                                </div>

                                {selectedSlot && (
                                    <div className={styles.confirmBox}>
                                        <div className={styles.confirmInfo}>
                                            <p>📅 {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                                            <p>🕐 {selectedSlot} – {
                                                TIME_SLOTS[TIME_SLOTS.indexOf(selectedSlot) + 1] || '23:00'
                                            } <span className={styles.confirmDuration}>(90 min)</span></p>
                                            {socio && <p>👤 {socio.nombre}</p>}
                                        </div>
                                        <button className={styles.confirmBtn} onClick={handleConfirmar}>
                                            {socio ? 'Confirmar reserva' : 'Iniciar sesión para reservar'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {reservaHecha && (
                            <div className={styles.successBox}>
                                <div className={styles.successIcon}>✅</div>
                                <h4>¡Reserva confirmada!</h4>
                                <p>
                                    {selectedDate?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} · {selectedSlot}h
                                </p>
                                <button
                                    className={styles.newReservaBtn}
                                    onClick={() => {
                                        setReservaHecha(false);
                                        setSelectedSlot(null);
                                        setSelectedDate(null);
                                    }}
                                >
                                    Hacer otra reserva
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Padel;