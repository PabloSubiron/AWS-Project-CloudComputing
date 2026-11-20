import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, Home } from 'lucide-react'
import styles from './Navbar.module.css'

export default function Navbar() {
    const ANIM_DURATION = 300;
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [socio, setSocio] = useState(null);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const stored = localStorage.getItem('socio');
        if (stored) {
            try {
                const parsedUser = JSON.parse(stored);
                // Normalizamos el nombre para evitar errores (backend usa 'name', frontend antiguo usaba 'nombre')
                if (parsedUser) {
                    parsedUser.displayName = parsedUser.name || parsedUser.nombre || "Usuario";
                }
                setSocio(parsedUser);
            } catch (e) {
                console.error("Datos de sesión corruptos en Navbar, limpiando...");
                localStorage.removeItem('socio');
                setSocio(null);
            }
        } else {
            setSocio(null);
        }
    }, [location]);

    const toggleMenu = () => {
        if (isMenuOpen) closeMenu();
        else openMenu();
    };

    const openMenu = () => {
        setIsClosing(false);
        setIsMenuOpen(true);
    };

    const closeMenu = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsMenuOpen(false);
            setIsClosing(false);
        }, ANIM_DURATION);
    };

    const handleLogout = () => {
        localStorage.removeItem('socio');
        setSocio(null);
        navigate('/login');
        if (isMenuOpen) closeMenu();
    };

    useEffect(() => {
        if (!isMenuOpen && !isClosing) return;

        const handleOutside = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(e.target)
            ) {
                if (isMenuOpen) closeMenu();
            }
        };

        const handleKey = (e) => {
            if (e.key === "Escape" && isMenuOpen) closeMenu();
        };

        document.addEventListener("mousedown", handleOutside);
        document.addEventListener("touchstart", handleOutside);
        document.addEventListener("keydown", handleKey);

        return () => {
            document.removeEventListener("mousedown", handleOutside);
            document.removeEventListener("touchstart", handleOutside);
            document.removeEventListener("keydown", handleKey);
        };
    }, [isMenuOpen, isClosing]);

    const navLinks = [
        { to: "/", label: "Inicio" },
        { to: "/padel", label: "Pádel" },
        { to: "/atletismo", label: "Atletismo" },
        { to: "/piscina", label: "Piscina" },
        { to: "/incidencias", label: "Incidencias" },
        { to: "/somos", label: "Somos" },
        { to: "/contacto", label: "Contacto" },
    ];

    if (socio && !socio.isGuest) {
        navLinks.splice(1, 0, { to: "/mis-reservas", label: "Mis Reservas" });
    }

    return (
        <nav className={styles.nav}>
            <div className={styles.brand}>
                <Link to="/" title="Volver al inicio">
                    <img 
                        src="/images/Logo_AP_Sports-SinFondo.ico" 
                        alt="APSports Logo" 
                        style={{ height: '40px', width: 'auto' }} 
                    />
                </Link>
                <span>AP Sports</span>
                <Link to="/" title="Volver al inicio">
                    <Home size={24} style={{ display: 'inline-block', cursor: 'pointer', marginLeft: '16px' }} />
                </Link>
            </div>

            <ul className={styles.links}>
                {navLinks.map((link) => (
                    <li key={link.to}>
                        <Link to={link.to}>{link.label}</Link>
                    </li>
                ))}
            </ul>

            {/* Auth area (desktop) */}
            <div className={styles.auth}>
                {socio ? (
                    <div className={styles.user}>
                        <div className={styles.avatar}>
                            {socio.displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{socio.displayName.split(' ')[0]}</span>
                            <span className={styles.userRole}>{socio.isGuest ? 'Invitado' : 'Socio'}</span>
                        </div>
                        <button className={styles.logoutBtn} onClick={handleLogout} title="Cerrar sesión">
                            ⎋
                        </button>
                    </div>
                ) : (
                    <button className={styles.loginBtn} onClick={() => navigate('/login')}>
                        Acceder
                    </button>
                )}
            </div>

            {/* Botón del menú móvil */}
            <button
                ref={buttonRef}
                className={styles.menu}
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
                <span className={isMenuOpen ? styles.iconOpen : styles.iconClosed}>
                    {isMenuOpen && !isClosing ? <X size={20} /> : <Menu size={20} />}
                </span>
            </button>

            {(isMenuOpen || isClosing) && (
                <ul
                    ref={menuRef}
                    className={`${styles.mobileMenu} ${isClosing ? styles.closing : ''} ${isMenuOpen && !isClosing ? styles.menuVisible : ''}`}
                >
                    {navLinks.map((link) => (
                        <li key={link.to}>
                            <Link to={link.to} onClick={closeMenu}>{link.label}</Link>
                        </li>
                    ))}
                    <li className={styles.mobileDivider}></li>
                    {socio ? (
                        <>
                            <li className={styles.mobileUser}>
                                👤 <strong>{socio.displayName}</strong>
                            </li>
                            <li>
                                <button className={styles.mobileLogout} onClick={handleLogout}>
                                    Cerrar sesión
                                </button>
                            </li>
                        </>
                    ) : (
                        <li>
                            <button className={styles.mobileLogin} onClick={() => { navigate('/login'); closeMenu(); }}>
                                Acceder como socio
                            </button>
                        </li>
                    )}
                </ul>
            )}
        </nav>
    );
}