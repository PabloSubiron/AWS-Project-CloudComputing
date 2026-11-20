import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './page.module.css';
import { api } from '../../lib/api';

export default function Incidencias() {
    const navigate = useNavigate();
    const [socio, setSocio] = useState(null);
    const [formData, setFormData] = useState({ facility: 'General', description: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('socio');
        if (stored) {
            setSocio(JSON.parse(stored));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.description.trim()) {
            setError('Por favor, indica una descripción de la incidencia.');
            return;
        }
        
        setError(null);
        setLoading(true);
        
        try {
            await api.createIncident({
                facility: formData.facility,
                description: formData.description,
                userId: socio && !socio.isGuest ? socio.id : null
            });
            setSuccess(true);
            setFormData({ facility: 'General', description: '' });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroOverlay}>
                    <div className={styles.heroContent}>
                        <h1>Incidencias</h1>
                        <p className={styles.tagline}>Ayúdanos a mantener las instalaciones en perfecto estado</p>
                    </div>
                </div>
            </section>

            <div className={styles.container}>
                <div className={styles.formCard}>
                    <h2 className={styles.formTitle}>Notificar Incidencia</h2>
                    <p className={styles.formDescription}>
                        Si has detectado algún desperfecto, avería o problema en nuestras instalaciones,
                        infórmanos para que podamos solucionarlo cuanto antes.
                    </p>

                    {success ? (
                        <div className={styles.successBox}>
                            <div className={styles.successIcon}>✅</div>
                            <h3>¡Gracias por avisarnos!</h3>
                            <p>Hemos registrado tu incidencia y nuestro equipo de mantenimiento la revisará.</p>
                            <button className={styles.newIncidentBtn} onClick={() => setSuccess(false)}>
                                Enviar otra incidencia
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Instalación afectada</label>
                                <select 
                                    className={styles.select}
                                    value={formData.facility}
                                    onChange={(e) => setFormData({...formData, facility: e.target.value})}
                                >
                                    <option value="General">Zonas Comunes (Baños, Pasillos, Exterior)</option>
                                    <option value="PADEL_CENTRAL">Pista de Pádel Central</option>
                                    <option value="PADEL_EXTERIOR">Pista de Pádel Exterior</option>
                                    <option value="PISCINA">Piscina</option>
                                    <option value="ATLETISMO">Pista de Atletismo</option>
                                </select>
                            </div>

                            <div className={styles.inputGroup}>
                                <label className={styles.inputLabel}>Descripción del problema</label>
                                <textarea 
                                    className={styles.textarea}
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    rows="5"
                                    placeholder="Ej: Se ha fundido un foco de la pista central, o hay agua en el vestuario..."
                                ></textarea>
                            </div>
                            
                            {(!socio || socio.isGuest) && (
                                <div className={styles.anonInfo}>
                                    Estás enviando esta incidencia de forma <strong>anónima</strong>. 
                                    Si prefieres que conste a tu nombre, <a href="/login">inicia sesión</a>.
                                </div>
                            )}

                            {error && <div className={styles.errorBox}>⚠️ {error}</div>}

                            <button type="submit" className={styles.submitBtn} disabled={loading}>
                                {loading ? 'Enviando...' : 'Notificar incidencia'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}