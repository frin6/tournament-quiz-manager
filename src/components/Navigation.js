import { Link } from 'react-router-dom';
import { useTournament } from '../context/TournamentContext';

function Navigation() {
  const { resetTournament } = useTournament();

  return (
    <nav style={styles.nav}>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Registration</Link>
        <Link to="/groups" style={styles.link}>Groups</Link>
        <Link to="/knockout" style={styles.link}>Final Stage</Link>
      </div>
      <button 
        onClick={resetTournament} 
        style={styles.resetButton}
      >
        Reset Tournament
      </button>
    </nav>
  );
}

const styles = {
  nav: {
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  links: {
    display: 'flex',
    gap: '1rem'
  },
  link: {
    textDecoration: 'none',
    color: '#007bff'
  },
  resetButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default Navigation; 