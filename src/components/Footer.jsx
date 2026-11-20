import styles from './Footer.module.css';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';

export default function Footer({ onOpenLegal }) {
    console.log("Footer recibió onOpenLegal:", onOpenLegal);
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                {/* Social Media */}
                <div className={styles.section}>
                    <h3>Síguenos</h3>
                    <div className={styles.social}>
                        <a
                            href="https://www.facebook.com/apsports.demo"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <Facebook size={24} />
                        </a>
                        <a
                            href="https://www.instagram.com/apsports.demo"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <Instagram size={24} />
                        </a>
                        <a
                            href="https://x.com/apsports.demo"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="X (Twitter)"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a
                            href="https://wa.me/34600000000"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                        >
                            <MessageCircle size={24} />
                        </a>
                    </div>
                </div>

                {/* Contact Info */}
                <div className={styles.section}>
                    <h3>Contacto</h3>
                    <div className={styles.contact}>
                        <a
                            href="mailto:info@apsports.demo"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            📧 info@apsports.demo
                        </a>
                        < br/>
                        <a href="tel:+346000000">📱 +34 600 000 000 (Pablo)</a>
                        < br/>
                        <a
                            href="https://www.apsports.demo"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            🌐 www.apsports.demo
                        </a>
                    </div>
                </div>

                {/* About */}
                <div className={styles.section}>
                    <h3>APSports</h3>
                    <p className={styles.tagline}>Tu plataforma deportiva de confianza</p>
                    <p className={styles.description}>
                        Conectamos deportistas y organizadores para crear experiencias deportivas inolvidables.
                    </p>
                </div>
            </div>

            {/* Copyright */}
            <div className={styles.copyright}>
                <p>&copy; {new Date().getFullYear()} APSports. Todos los derechos reservados.</p>
                <div className={styles.legalLinks}>
                    <button onClick={() => onOpenLegal?.('aviso')} className={styles.legalLink}>Aviso legal</button>
                    <span>•</span>
                    <button onClick={() => onOpenLegal?.('privacidad')} className={styles.legalLink}>Privacidad</button>
                    <span>•</span>
                    <button onClick={() => onOpenLegal?.('cookies')} className={styles.legalLink}>Cookies</button>
                </div>
            </div>
        </footer>
    );
}
