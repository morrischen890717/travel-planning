import React, { useState } from 'react';

const TripPlanner = () => {
  const [trips, setTrips] = useState([]);
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  const addTrip = (e) => {
    e.preventDefault();
    if (!destination || !date) return;
    
    setTrips([...trips, { 
      id: Date.now(), 
      destination, 
      date, 
      note 
    }]);
    setDestination('');
    setDate('');
    setNote('');
  };

  const removeTrip = (id) => {
    setTrips(trips.filter(trip => trip.id !== id));
  };

  return (
    <section className="trip-planner" id="planner" style={{
      padding: '60px 0',
      backgroundColor: 'var(--white)'
    }}>
      <div className="container">
        <h2 style={{
          textAlign: 'center',
          marginBottom: '40px',
          fontSize: '2rem',
          color: 'var(--text-dark)'
        }}>
          Build Your Itinerary
        </h2>
        
        <div className="planner-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'start'
        }}>
          {/* Add Form */}
          <div className="add-form-card" style={{
            padding: '30px',
            backgroundColor: 'var(--bg-light)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow)'
          }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>Add New Stop</h3>
            <form onSubmit={addTrip}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Destination</label>
                <input 
                  type="text" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Tokyo, Paris..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Date</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #ddd',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Notes</label>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Activities, hotels, reminders..."
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid #ddd',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button type="submit" style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}>
                Add to Itinerary
              </button>
            </form>
          </div>

          {/* Itinerary List */}
          <div className="itinerary-list">
            <h3 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>Your Plan</h3>
            {trips.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                border: '2px dashed #ddd',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-light)'
              }}>
                <p>No destinations added yet. Start planning!</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {trips.map(trip => (
                  <div key={trip.id} style={{
                    padding: '20px',
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: '4px solid var(--secondary-color)',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{trip.destination}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '4px' }}>{trip.date}</p>
                      {trip.note && <p style={{ fontSize: '0.9rem', color: '#555' }}>{trip.note}</p>}
                    </div>
                    <button 
                      onClick={() => removeTrip(trip.id)}
                      style={{
                        padding: '8px',
                        color: 'var(--accent-color)',
                        background: 'none',
                        fontSize: '0.9rem'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripPlanner;
