import { useState } from "react";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import styles from "./page.module.css";

export default function Contacto() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
    };

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroImage}>
                <img
                src="images/contacto.webp"
                alt="Contacto"
                width={1200}
                height={500}
                priority
                style={{ objectFit: "cover", width: "100%", height: "100"}}
                />
                </div>
                <div className={styles.heroOverlay}>
                    <div className={styles.heroContent}>
                        <h1>Contáctanos</h1>
                        <p className={styles.tagline}>
                            Estamos aquí para responder tus preguntas y ayudarte con tus reservas
                        </p>
                    </div>
                </div>
            </section>

            <div className={styles.container}>
                {/* Contact Form */}
                <section className={styles.formSection}>
                    <h2>Envíanos un Mensaje</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Nombre *</label>
                            <input
                                type="text"
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({ ...formData, name: e.target.value })
                                }
                                placeholder="Tu nombre completo"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message">Mensaje *</label>
                            <textarea
                                id="message"
                                required
                                rows={6}
                                value={formData.message}
                                onChange={(e) =>
                                    setFormData({ ...formData, message: e.target.value })
                                }
                                placeholder="Cuéntanos tu consulta sobre nuestras instalaciones..."
                            />
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                        >
                            Enviar Mensaje
                        </button>

                        {submitted && (
                            <div className={styles.successMessage}>
                                ¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.
                            </div>
                        )}
                    </form>
                    <div>   
                        <img
                            src="images/black-white_APSport.png"
                            alt="Contacto"
                            priority
                            style={{ objectFit: "cover", width: "70%", height: "400", padding: "60px"}}
                        />
                    </div>
                </section>

                {/* Contact Info */}
                <section className={styles.infoSection}>
                    <h2>Información de Contacto</h2>

                    <div className={styles.contactCards}>
                        <div className={styles.contactCard}>
                            <Mail size={32} />
                            <h3>Email</h3>
                            <a href="mailto:info@apsports.demo">info@apsports.demo</a>
                        </div>

                        <div className={styles.contactCard}>
                            <Phone size={32} />
                            <h3>Teléfono</h3>
                            <a href="tel:+34600000000">+34 600 000 000</a>
                        </div>

                        <div className={styles.contactCard}>
                            <MessageCircle size={32} />
                            <h3>WhatsApp</h3>
                            <a
                                href="https://wa.me/34600000000?text=Hola,%20estoy%20interesado%20en%20reservar%20en%20APSport"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.whatsappBtn}
                            >
                                Contactar por WhatsApp
                            </a>
                        </div>

                        <div className={styles.contactCard}>
                            <MapPin size={32} />
                            <h3>Ubicación</h3>
                            <p>Plaza Mayor, 1, 44370, Cella, Teruel</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}