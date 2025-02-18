import { useTournament } from '../context/TournamentContext';
import { useState } from 'react';

function KnockoutStage() {
  const { knockoutMatches, updateKnockoutMatch } = useTournament();
  const [scores, setScores] = useState({});

  const handleScoreChange = (matchId, team, score) => {
    setScores(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: score
      }
    }));
  };

  const handleConfirmMatch = (matchId) => {
    const matchScores = scores[matchId];
    if (matchScores?.team1 != null && matchScores?.team2 != null) {
      updateKnockoutMatch(matchId, parseInt(matchScores.team1), parseInt(matchScores.team2));
    }
  };

  const renderMatch = (match) => (
    <div key={match.id} style={styles.match}>
      <span style={styles.teamName}>{match.team1.name}</span>
      <input
        type="number"
        min="0"
        value={scores[match.id]?.team1 || ''}
        onChange={(e) => handleScoreChange(match.id, 'team1', e.target.value)}
        disabled={match.isCompleted}
        style={styles.scoreInput}
      />
      <span>vs</span>
      <input
        type="number"
        min="0"
        value={scores[match.id]?.team2 || ''}
        onChange={(e) => handleScoreChange(match.id, 'team2', e.target.value)}
        disabled={match.isCompleted}
        style={styles.scoreInput}
      />
      <span style={styles.teamName}>{match.team2.name}</span>
      {!match.isCompleted && scores[match.id]?.team1 != null && scores[match.id]?.team2 != null && (
        <button 
          onClick={() => handleConfirmMatch(match.id)}
          style={styles.confirmButton}
        >
          Confirm
        </button>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      <h1>Final Stage</h1>
      
      <div style={styles.semifinals}>
        <h2>Semi-finals</h2>
        {knockoutMatches.semifinals.map(match => renderMatch(match))}
      </div>

      {knockoutMatches.final && (
        <div style={styles.final}>
          <h2>Final</h2>
          {renderMatch(knockoutMatches.final)}
        </div>
      )}

      {knockoutMatches.final?.isCompleted && (
        <div style={styles.winner}>
          <h2>Tournament Winner</h2>
          <div style={styles.winnerName}>
            {knockoutMatches.final.team1Score > knockoutMatches.final.team2Score 
              ? knockoutMatches.final.team1.name 
              : knockoutMatches.final.team2.name}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  semifinals: {
    marginBottom: '40px'
  },
  final: {
    marginBottom: '40px'
  },
  match: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  teamName: {
    minWidth: '120px',
    fontWeight: 'bold'
  },
  scoreInput: {
    width: '50px',
    padding: '5px',
    textAlign: 'center'
  },
  confirmButton: {
    marginLeft: '10px',
    padding: '5px 10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  winner: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#ffc107',
    borderRadius: '8px'
  },
  winnerName: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '10px'
  }
};

export default KnockoutStage; 