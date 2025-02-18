import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTournament } from '../context/TournamentContext';

function TeamRegistration() {
  const [teamName, setTeamName] = useState('');
  const { teams, addTeam, generateGroups } = useTournament();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (teamName.trim() && teams.length < 8) {
      addTeam(teamName.trim());
      setTeamName('');
    }
  };

  const handleStartTournament = () => {
    if (teams.length === 8) {
      generateGroups();
      navigate('/groups');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Team Registration</h1>
      <div style={styles.formContainer}>
        <h2>Add Team ({teams.length}/8)</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team name"
            style={styles.input}
          />
          <button 
            type="submit"
            disabled={teams.length >= 8}
            style={styles.button}
          >
            Add
          </button>
        </form>
      </div>

      <div style={styles.teamList}>
        <h2>Registered Teams:</h2>
        <ul style={styles.list}>
          {teams.map(team => (
            <li key={team.id} style={styles.listItem}>{team.name}</li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleStartTournament}
        disabled={teams.length !== 8}
        style={{...styles.button, ...styles.startButton}}
      >
        Start Tournament
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  formContainer: {
    marginBottom: '30px'
  },
  form: {
    display: 'flex',
    gap: '10px'
  },
  input: {
    padding: '8px',
    flex: 1,
    fontSize: '16px'
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  startButton: {
    backgroundColor: '#28a745',
    marginTop: '20px',
    width: '100%',
    padding: '12px'
  },
  teamList: {
    marginTop: '30px'
  },
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    padding: '8px',
    borderBottom: '1px solid #eee'
  }
};

export default TeamRegistration; 