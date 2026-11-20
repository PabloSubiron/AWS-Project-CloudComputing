import styles from './page.module.css';
import { Users, Target, Heart, Trophy, Star, Shield } from 'lucide-react';

const teamMembers = [
    {
        name: "Pablo González",
        img: "/images/pablo.png",
        role: "Cofundador & Codirector",
        description: "Apasionado del deporte y la tecnología. Impulsor de APSport desde el primer día.",
    },
    {
        name: "Alejandro Lozano",
        img: "/images/ale.png",
        role: "Cofundador & Codirector",
        description: "Especialista en gestión de instalaciones deportivas con más de 10 años de experiencia.",
    },
];

const values = [
    {
        icon: <Heart size={36} />,
        title: "Pasión por el Deporte",
        description: "Creemos que el deporte transforma vidas. Cada reserva es una oportunidad para mejorar.",
    },
    {
        icon: <Users size={36} />,
        title: "Comunidad",
        description: "Fomentamos un espacio donde deportistas se encuentran, compiten y crecen juntos.",
    },
    {
        icon: <Shield size={36} />,
        title: "Confianza",
        description: "Transparencia y compromiso en cada servicio que ofrecemos a nuestros usuarios.",
    },
    {
        icon: <Star size={36} />,
        title: "Excelencia",
        description: "Instalaciones de primera calidad y un servicio que supera las expectativas.",
    },
];

const stats = [
    { number: "500+", label: "Reservas realizadas" },
    { number: "3", label: "Modalidades disponibles" },
    { number: "50+", label: "Usuarios activos" },
    { number: "98%", label: "Satisfacción" },
];

export default function Somos() {
    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroImage}>
                    <img
                    src="images/somos.jpeg"
                    alt="Somos"
                    width={1200}
                    height={500}
                    priority
                    style={{ objectFit: "cover", width: "100%", height: "100"}}
                    />
                </div>
                <div className={styles.heroOverlay}>
                    <div className={styles.heroContent}>
                        <h1>Sobre Nosotros</h1>
                        <p className={styles.tagline}>
                            Conoce al equipo detrás de APSport y nuestra misión
                        </p>
                    </div>
                </div>
            </section>

            {/* Misión */}
            <section className={styles.mission}>
                <div className={styles.missionContent}>
                    <div className={styles.missionIcon}>
                        <Target size={48} />
                    </div>
                    <h2>Nuestra Misión</h2>
                    <p>
                        En <strong>APSport</strong> queremos hacer que el acceso a instalaciones
                        deportivas sea sencillo, rápido y para todos. Nacimos con la idea de
                        conectar a deportistas con las pistas de pádel, atletismo y
                        piscina de Cella, todo desde una sola plataforma.
                    </p>
                    <p>
                        Creemos que reservar una pista no debería ser complicado. Por eso
                        hemos creado una herramienta intuitiva que te permite encontrar,
                        comparar y reservar en segundos.
                    </p>
                </div>
            </section>

            {/* Estadísticas */}
            <section className={styles.statsSection}>
                <div className={styles.statsGrid}>
                    {stats.map((stat) => (
                        <div key={stat.label} className={styles.statCard}>
                            <span className={styles.statNumber}>{stat.number}</span>
                            <span className={styles.statLabel}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Valores */}
            <section className={styles.valuesSection}>
                <h2>Nuestros Valores</h2>
                <div className={styles.valuesGrid}>
                    {values.map((value) => (
                        <div key={value.title} className={styles.valueCard}>
                            <div className={styles.valueIcon}>{value.icon}</div>
                            <h3>{value.title}</h3>
                            <p>{value.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Equipo */}
            <section className={styles.teamSection}>
                <h2>Nuestro Equipo</h2>
                <p className={styles.teamSubtitle}>
                    Las personas que hacen posible APSport cada día
                </p>
                <div className={styles.teamGrid}>
                    {teamMembers.map((member) => (
                        <div key={member.name} className={styles.teamCard}>
                            {member.img ? (
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className={styles.teamPhoto}
                                />
                            ) : (
                                <div className={styles.teamAvatar}>
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                            )}
                            <h3>{member.name}</h3>
                            <span className={styles.teamRole}>{member.role}</span>
                            <p>{member.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaContent}>
                    <Trophy size={48} />
                    <h2>¿Listo para empezar?</h2>
                    <p>
                        Únete a nuestra comunidad deportiva y reserva tu próxima pista hoy mismo.
                    </p>
                    <a href="/contacto" className={styles.ctaButton}>
                        Contáctanos
                    </a>
                </div>
            </section>
        </div>
    );
}