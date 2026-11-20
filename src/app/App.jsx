import { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Padel from './padel/page';
import Atletismo from './atletismo/page';
import Piscina from './piscina/page';
import './App.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Contacto from './contacto/page';
import Somos from './somos/page';
import Login from './login/page';
import MisReservas from './mis-reservas/page';
import Incidencias from './incidencias/page';
import LegalScreen from './legal/page';

// Componente de protección de rutas robusto
// Evita pantalla en blanco si 'socio' no es un JSON válido
function ProtectedRoute({ children }) {
    const socioStr = localStorage.getItem('socio');
    
    if (!socioStr) {
        return <Navigate to="/login" replace />;
    }

    try {
        // Intentamos parsear para asegurar que los datos no están corruptos
        JSON.parse(socioStr);
        return children;
    } catch (e) {
        console.error("Sesión corrupta detectada, cerrando sesión...", e);
        localStorage.removeItem('socio');
        return <Navigate to="/login" replace />;
    }
}

function HomeScreen() {
    const navigate = useNavigate();

    const facilities = [
        {
            id: 1,
            title: 'Pista de Pádel',
            route: '/padel',
            image: 'images/PistaPadel.jpeg',
            description: 'Pista profesional con iluminación LED y superficie de césped artificial de última generación.',
            schedule: '08:00 – 22:00',
            meta: '90 min · Hasta 4 jugadores',
            badge: 'Reserva por franjas',
            badgeColor: '#646cff',
        },
        {
            id: 2,
            title: 'Pista de Atletismo',
            route: '/atletismo',
            image: 'images/PistaAtletismo.jpeg',
            description: 'Pista de 400 metros con 6 carriles y superficie sintética de alta calidad. Grupo de entrenamiento disponible.',
            schedule: '07:00 – 21:00',
            meta: 'Aforo: 50 personas',
            badge: 'Grupo de entrenamiento',
            badgeColor: '#f59e0b',
        },
        {
            id: 3,
            title: 'Piscina Climatizada',
            route: '/piscina',
            image: 'images/piscinaClimatizada.jpeg',
            description: 'Piscina de 25 metros con temperatura controlada todo el año. Clases dirigidas y acceso libre.',
            schedule: '08:00 – 22:00',
            meta: 'Aforo: 50 personas',
            badge: 'Grupo de natación',
            badgeColor: '#0ea5e9',
        },
    ];
    return (
        <div className="homeScreen">
            {/* Banner */}
            <div className="homeBanner">
                <div className="homeBannerImage">
                    <img src="images/somos.jpeg" alt="Banner"
                        style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                </div>
                <div className="homeBannerOverlay">
                    <div className="homeBannerContent">
                        <div className="homeBannerBadge">Municipio de Cella · Teruel</div>
                        <h1>Reserva tu Instalación Deportiva</h1>
                        <p>Accede a las mejores instalaciones deportivas del municipio. Reserva fácil, rápido y desde cualquier dispositivo.</p>
                    </div>
                </div>
            </div>

            {/* Stats strip */}
            <div className="homeStatsStrip">
                <div className="homeStatItem"><strong>3</strong><span>Instalaciones</span></div>
                <div className="homeStatItem"><strong>120+</strong><span>Socios activos</span></div>
                <div className="homeStatItem"><strong>14h</strong><span>Horario medio diario</span></div>
                <div className="homeStatItem"><strong>2</strong><span>Grupos de entreno</span></div>
            </div>

            {/* Facilities */}
            <div className="facilitiesContainer" id="instalaciones">
                <div className="facilitiesHeader">
                    <span className="facilitiesLabel">Lo que ofrecemos</span>
                    <h2>Instalaciones Disponibles</h2>
                    <p className="facilitiesSubtitle">Selecciona una instalación para consultar disponibilidad y realizar tu reserva</p>
                </div>

                <div className="facilitiesGrid">
                    {facilities.map((facility) => (
                        <div key={facility.id} className="facilityCard">
                            <div className="facilityImageWrapper">
                                <img src={facility.image} alt={facility.title} className="facilityImage" />
                                <div className="facilityImageOverlay">
                                    <button className="facilityQuickBtn" onClick={() => navigate(facility.route)}>
                                        {facility.emoji} Reservar ahora
                                    </button>
                                </div>
                            </div>
                            <div className="facilityContent">
                                <div className="facilityContentTop">
                                    <div className="facilityBadge" style={{ background: `${facility.badgeColor}18`, color: facility.badgeColor, borderColor: `${facility.badgeColor}33` }}>
                                        {facility.badge}
                                    </div>
                                    <h3>{facility.emoji} {facility.title}</h3>
                                    <p className="facilityDescription">{facility.description}</p>
                                </div>
                                <div className="facilityInfo">
                                    <span className="infoItem">🕐 {facility.schedule}</span>
                                    <span className="infoItem">ℹ️ {facility.meta}</span>
                                </div>
                            </div>
                            <div className="facilityFooter">
                                <button
                                    className="detailsBtn"
                                    onClick={() => navigate(facility.route)}
                                >
                                    Ver y reservar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="homeCtaSection">
                <div className="homeCtaContent">
                    <h2>¿Aún no eres socio?</h2>
                    <p>Contacta con el Ayuntamiento de Cella para darte de alta y empezar a disfrutar de todas las instalaciones.</p>
                    <button className="homeCtaBtn" onClick={() => navigate('/contacto')}>
                        Contactar con el ayuntamiento
                    </button>
                </div>
            </div>
        </div>
    );
}

function App() {
    const [legalVisible, setLegalVisible] = useState(false);
    const [legalTab, setLegalTab] = useState('aviso');

    const openLegal = (tab) => {
        console.log("Abriendo legal con pestaña:", tab);
        setLegalTab(tab);
        setLegalVisible(true);
    };

    return (
        <div className="app-layout">
            <Navbar />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/login" element={<Login />} />
                    
                    {/* Rutas protegidas */}
                    <Route 
                        path="/padel" 
                        element={
                            <ProtectedRoute>
                                <Padel />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/atletismo" 
                        element={
                            <ProtectedRoute>
                                <Atletismo />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/piscina" 
                        element={
                            <ProtectedRoute>
                                <Piscina />
                            </ProtectedRoute>
                        } 
                    />
                    
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/somos" element={<Somos />} />
                    
                    <Route 
                        path="/mis-reservas" 
                        element={
                            <ProtectedRoute>
                                <MisReservas />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="/incidencias" element={<Incidencias />} />
                    
                    {/* Redirección por defecto */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            <Footer onOpenLegal={openLegal} />

            {legalVisible && (
                <div className="legal-modal-overlay" onClick={() => setLegalVisible(false)}>
                    <div className="legal-modal-content" onClick={(e) => e.stopPropagation()}>
                        <LegalScreen
                            initialTab={legalTab}
                            onBack={() => setLegalVisible(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;