import React from 'react';

const Hero = () => {
  return (
    <section className="hero" style={{
      padding: '80px 0',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)'
    }}>
      <div className="container">
        <h1 style={{
          fontSize: '3.5rem',
          marginBottom: '20px',
          background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.2
        }}>
          Plan Your Dream Journey
        </h1>
        <p style={{
          fontSize: '1.2rem',
          color: 'var(--text-light)',
          maxWidth: '600px',
          margin: '0 auto 40px'
        }}>
          Discover new destinations, organize your itinerary, and create memories that last a lifetime.
        </p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button style={{
            padding: '12px 30px',
            backgroundColor: 'var(--accent-color)',
            color: 'white',
            borderRadius: 'var(--radius-md)',
            fontSize: '1.1rem',
            fontWeight: 600,
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
          }}>
            Start Planning
          </button>
          <button style={{
            padding: '12px 30px',
            backgroundColor: 'white',
            color: 'var(--text-dark)',
            border: '1px solid #ddd',
            borderRadius: 'var(--radius-md)',
            fontSize: '1.1rem',
            fontWeight: 500
          }}>
            Explore Places
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
