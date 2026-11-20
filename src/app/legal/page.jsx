import React, { useState } from "react";
import { ArrowLeft, Scale, Shield, Cookie } from "lucide-react";
import "./page.module.css";

const TABS = [
    { id: "aviso", label: "Aviso Legal", icon: Scale },
    { id: "privacidad", label: "Privacidad", icon: Shield },
    { id: "cookies", label: "Cookies", icon: Cookie },
];

function AvisoLegal() {
    return (
        <div className="legal-body">
            <h2>Aviso Legal</h2>
            <p className="legal-updated">Última actualización: abril 2026</p>
            <h3>1. Titular del sitio web y la aplicación</h3>
            <p>
                En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de
                Servicios de la Sociedad de la Información y de Comercio Electrónico
                (LSSI-CE), se informa al usuario de que el titular de esta aplicación es:
            </p>
            <ul>
                <li><strong>Denominación social:</strong> Ayuntamiento de Cella</li>
                <li><strong>NIF/CIF:</strong> P4407600H</li>
                <li><strong>Domicilio social:</strong> Plaza Mayor, 1, 44370 Cella, Teruel</li>
                <li><strong>Correo electrónico:</strong> info@apsports.demo</li>
                <li><strong>Teléfono:</strong> +34 600 000 000</li>
            </ul>
            <h3>2. Objeto</h3>
            <p>
                La presente aplicación (en adelante, APSports) tiene como finalidad la
                reserva de espacios así como la inclusión en grupos de entrenamiento de
                los diferentes espacios deportivos ubicados en el municipio de Cellla (Teruel).
            </p>
            <h3>3. Condiciones de uso</h3>
            <p>
                El acceso a la aplicación atribuye la condición de usuario e implica la
                aceptación plena de las presentes condiciones. El usuario se compromete a
                hacer un uso adecuado de la aplicación conforme a la legislación vigente,
                las buenas costumbres y el orden público.
            </p>
            <h3>4. Propiedad intelectual e industrial</h3>
            <p>
                Todos los contenidos de la aplicación (textos, imágenes, código, marca,
                logotipos, diseño y estructura) son propiedad del titular o de terceros
                que han autorizado su uso, y están protegidos por la legislación sobre
                propiedad intelectual e industrial. Queda prohibida su reproducción,
                distribución o transformación sin autorización expresa.
            </p>
            <h3>6. Legislación aplicable y jurisdicción</h3>
            <p>
                Las presentes condiciones se rigen por la legislación española. Para la
                resolución de cualquier controversia se someterán a los juzgados y
                tribunales del domicilio del titular, salvo que la legislación aplicable
                disponga otra cosa.
            </p>
        </div>
    );
}

function PoliticaPrivacidad() {
    return (
        <div className="legal-body">
            <h2>Política de Privacidad</h2>
            <p className="legal-updated">Última actualización: abril 2026</p>
            <p>
                De conformidad con el Reglamento (UE) 2016/679 General de Protección de
                Datos (RGPD) y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección
                de Datos Personales y garantía de los derechos digitales (LOPDGDD), le
                informamos sobre el tratamiento de sus datos personales.
            </p>
            <h3>1. Responsable del tratamiento</h3>
            <ul>
                <li><strong>Identidad:</strong> Ayuntamiento de Cella</li>
                <li><strong>NIF/CIF:</strong> P4407600H</li>
                <li><strong>Dirección:</strong> Plaza Mayor, 1, 44370 Cella, Teruel</li>
                <li><strong>Correo electrónico:</strong> info@apsports.demo</li>
                <li><strong>Teléfono:</strong> +34 600 000 000</li>
            </ul>
            <h3>2. Datos que tratamos</h3>
            <p>En función de la versión y el uso de la aplicación, podremos tratar:</p>
            <ul>
                <li><strong>Datos identificativos:</strong> dni de usuario, contraseña de acceso, nombre o alias.</li>
            </ul>
            <h3>3. Finalidad del tratamiento</h3>
            <ul>
                <li>Gestión de reservas de espacio deportivos así como la inclusión en grupos de entrenamiento y recopilación de posibles incidencias.</li>
            </ul>
            <h3>4. Base legal del tratamiento</h3>
            <p>
                El tratamiento de datos de salud se fundamentará en el{" "}
                <strong>consentimiento explícito del interesado</strong> (Art. 6.1.a y Art. 9.2.a del RGPD).
            </p>
            <h3>5. Conservación de los datos</h3>
            <p>
                Los datos se conservarán durante el tiempo estrictamente necesario para la finalidad indicada y,
                como mínimo, durante los plazos legales exigidos.
            </p>
            <h3>7. Derechos del interesado</h3>
            <p>
                Tiene derecho a acceder, rectificar, suprimir, limitar, portar y
                oponerse al tratamiento de sus datos personales, así como a revocar su
                consentimiento en cualquier momento, dirigiéndose a info@apsports.demo.
            </p>
            <p>
                Si considera que sus derechos no han sido debidamente atendidos, puede
                presentar una reclamación ante la{" "}
                <strong>Agencia Española de Protección de Datos</strong> (
                <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a>).
            </p>
            <h3>8. Medidas de seguridad</h3>
            <p>
                Se aplicarán las medidas técnicas y organizativas adecuadas para
                garantizar la seguridad de los datos, conforme al Art. 32 del RGPD, en
                función del riesgo que suponga el tratamiento.
            </p>
            <h3>9. Evaluación de Impacto</h3>
            <p>
                De conformidad con el Art. 35 del RGPD, se realizará una Evaluación de
                Impacto en la Protección de Datos (EIPD) antes de implementar el
                tratamiento a gran escala de datos de salud en las versiones con
                persistencia y registro de usuarios.
            </p>
        </div>
    );
}

function PoliticaCookies() {
    return (
        <div className="legal-body">
            <h2>Política de Cookies</h2>
            <p className="legal-updated">Última actualización: abril 2026</p>
            <h3>1. ¿Qué son las cookies?</h3>
            <p>
                Las cookies son pequeños archivos de texto que los sitios web y 
                aplicaciones web almacenan en el navegador del usuario para recordar 
                información sobre su visita y facilitar ciertas funcionalidades.
            </p>
            <h3>2. Cookies utilizadas en esta aplicación</h3>
            <p>
                En APSport utilizamos <strong>cookies técnicas</strong> estrictamente 
                necesarias para permitir el inicio de sesión y mantener la sesión del 
                usuario autenticado mientras navega por la aplicación. Estas cookies 
                no recopilan datos personales con fines publicitarios ni de análisis.
            </p>
            <ul>
                <li><strong>Cookies de sesión:</strong> Permiten que el usuario permanezca autenticado durante su navegación. Se eliminan al cerrar el navegador o cerrar sesión.</li>
            </ul>
            <h3>3. Almacenamiento local</h3>
            <p>
                Además, la aplicación puede utilizar la memoria temporal del navegador 
                (por ejemplo, el estado de React en memoria o almacenamiento local) 
                para el funcionamiento durante la sesión. Esta información no persiste 
                tras cerrar la aplicación y no se utiliza para identificar al usuario 
                fuera de la sesión activa.
            </p>
            <h3>4. Consentimiento</h3>
            <p>
                Al tratarse de cookies técnicas necesarias para el funcionamiento del 
                sistema de autenticación, no requieren consentimiento expreso según 
                el Art. 22.2 de la LSSI-CE. No se utilizan cookies de terceros ni de análisis.
            </p>
            <h3>5. Cómo gestionar las cookies</h3>
            <p>
                El usuario puede configurar su navegador para rechazar o eliminar 
                cookies, aunque esto podría impedir el acceso o el correcto 
                funcionamiento de las áreas privadas que requieren autenticación.
            </p>
        </div>
    );
}

export default function LegalScreen({ initialTab = "aviso", onBack }) {
    const [activeTab, setActiveTab] = useState(initialTab);

    return (
        <div className="legal-screen">
            <div className="legal-header">
                <button className="legal-back-btn" onClick={onBack}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="legal-header-title">Información Legal</h1>
            </div>

            <div className="legal-tabs">
                {TABS.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        className={`legal-tab ${activeTab === id ? "active" : ""}`}
                        onClick={() => setActiveTab(id)}
                    >
                        <Icon size={16} />
                        <span>{label}</span>
                    </button>
                ))}
            </div>

            <div className="legal-content" tabIndex={-1}>
                {activeTab === "aviso" && <AvisoLegal />}
                {activeTab === "privacidad" && <PoliticaPrivacidad />}
                {activeTab === "cookies" && <PoliticaCookies />}
            </div>
        </div>
    );
}