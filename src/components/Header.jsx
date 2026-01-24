import React from 'react';

const Header = () => {
  return (
    <header className="header" style={{
      height: 'var(--header-height)',
      backgroundColor: 'var(--white)',
      boxShadow: 'var(--shadow)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%'
      }}>
        <div className="logo" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'var(--primary-color)'
        }}>
          TravelPlanner
        </div>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <a href="#" style={{ fontWeight: 500 }}>Destinations</a>
          <a href="#" style={{ fontWeight: 500 }}>Planner</a>
          <button style={{
            padding: '8px 16px',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600
          }}>
            My Trips
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
