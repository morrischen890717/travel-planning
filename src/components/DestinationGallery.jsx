import React from 'react';

const destinations = [
  {
    id: 1,
    name: 'Kyoto, Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    description: 'Ancient temples, traditional tea houses, and sublime gardens.'
  },
  {
    id: 2,
    name: 'Santorini, Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    description: 'Whitewashed houses clinging to cliffs above an underwater caldera.'
  },
  {
    id: 3,
    name: 'Machu Picchu, Peru',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80',
    description: 'Iconic Incan citadel set high in the Andes Mountains.'
  },
  {
    id: 4,
    name: 'Reykjavik, Iceland',
    image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=800&q=80',
    description: 'Gateway to the blue lagoon, auroras, and dramatic landscapes.'
  }
];

const DestinationGallery = () => {
  return (
    <section id="explore" style={{ padding: '60px 0' }}>
      <div className="container">
        <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2rem' }}>
          Popular Destinations
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px'
        }}>
          {destinations.map(dest => (
            <div key={dest.id} style={{
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
              backgroundColor: 'white',
              transition: 'transform 0.3s'
            }}>
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <img 
                  src={dest.image} 
                  alt={dest.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ marginBottom: '10px', fontSize: '1.2rem' }}>{dest.name}</h3>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '15px' }}>
                  {dest.description}
                </p>
                <button style={{
                  color: 'var(--primary-color)',
                  fontWeight: 600,
                  background: 'none',
                  padding: 0
                }}>
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationGallery;
