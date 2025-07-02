const About = () => {
  return (
    <div className="page-container">
      
      <section className="about-section">
        <h2>🌱 Nuestra Misión</h2>
        <p>
          EcoEventos es una plataforma dedicada a conectar personas con eventos ecológicos y sostenibles. 
          Creemos que pequeñas acciones comunitarias pueden generar un gran impacto en nuestro medio ambiente.
        </p>
      </section>

      <section className="about-section">
        <h2>🎯 Nuestro Objetivo</h2>
        <p>
          Promover la conciencia ambiental a través de eventos comunitarios que fomenten:
        </p>
        <ul>
          <li>🌊 Limpieza y conservación de espacios naturales</li>
          <li>🌳 Reforestación y cuidado de áreas verdes</li>
          <li>♻️ Reciclaje y economía circular</li>
          <li>🚶‍♀️ Turismo ecológico responsable</li>
          <li>🥬 Consumo de productos orgánicos y locales</li>
        </ul>
      </section>

      <section className="about-section">
        <h2>👥 ¿Quiénes Somos?</h2>
        <p>
          Somos una comunidad de personas comprometidas con el medio ambiente, que busca crear 
          espacios de encuentro para generar conciencia ecológica y promover acciones sostenibles 
          en nuestras comunidades.
        </p>
      </section>

      <section className="about-section">
        <h2>🚀 ¿Cómo Funciona?</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Explora Eventos</h3>
            <p>Descubre eventos ecológicos cerca de ti</p>
          </div>
          <div className="step">
            <h3>2. Regístrate</h3>
            <p>Únete a los eventos que más te interesen</p>
          </div>
          <div className="step">
            <h3>3. Participa</h3>
            <p>Contribuye activamente en las actividades</p>
          </div>
          <div className="step">
            <h3>4. Organiza</h3>
            <p>Crea tus propios eventos ecológicos</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
