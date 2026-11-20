import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './page.module.css';
import { api } from '../../lib/api'; 

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ nif: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = await api.login(formData.nif, formData.password);
            // IMPORTANTE: user ahora tiene { id, nif, name, ... } desde el backend
            localStorage.setItem('socio', JSON.stringify(user));
            navigate('/');
        } catch (err) {
            console.error(err);
            setError(err.message || "Error de conexión");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginLeft}>
                <div className={styles.loginLeftContent}>
                    <div className={styles.brandMark}>
                        <div className={styles.brandIcon}>⚽</div>
                        <span>Cella Deportes</span>
                    </div>
                    <h1 className={styles.loginHeroTitle}>
                        Tu complejo deportivo,<br />
                        <span className={styles.accent}>siempre disponible.</span>
                    </h1>
                    <p className={styles.loginHeroText}>
                        Reserva instalaciones, consulta horarios y gestiona tu actividad deportiva.
                    </p>
                </div>
                <div className={styles.loginLeftBg}></div>
            </div>

            <div className={styles.loginRight}>
                <div className={styles.loginCard}>
                    <div className={styles.loginCardHeader}>
                        <h2>Acceso socios</h2>
                        <p>Introduce tus credenciales</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.loginForm}>
                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>NIF</label>
                            <input
                                type="text"
                                name="nif"
                                value={formData.nif}
                                onChange={handleChange}
                                placeholder="Ej: 12345678A"
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.inputLabel}>Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="******"
                                className={styles.input}
                                required
                            />
                        </div>

                        {error && <div className={styles.errorBox}>⚠️ {error}</div>}

                        <button type="submit" className={styles.submitBtn} disabled={loading}>
                            {loading ? 'Cargando...' : 'Entrar'}
                        </button>
                        
                        <button 
                            type="button" 
                            className={styles.guestBtn} 
                            onClick={() => {
                                localStorage.setItem('socio', JSON.stringify({ isGuest: true, displayName: "Invitado" }));
                                navigate('/');
                            }}
                            style={{ 
                                marginTop: '1rem', 
                                background: 'transparent', 
                                border: '1px solid #ccc', 
                                color: '#333',
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 'bold'
                            }}
                        >
                            Entrar como invitado
                        </button>
                    </form>
                    
                    <div className={styles.demoHint}>
                        <p>Demo: <strong>12345678A</strong> / <strong>1234</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;