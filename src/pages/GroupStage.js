import { useTournament } from '../context/TournamentContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function GroupStage() {
  const { groups, matches, updateMatchScore, generateKnockoutStage } = useTournament();
  const navigate = useNavigate();
  const [scores, setScores] = useState({});

  const handleScoreChange = (groupId, matchId, team, score) => {
    const matchKey = `${groupId}-${matchId}`;
    setScores(prev => ({
      ...prev,
      [matchKey]: {
        ...prev[matchKey],
        [team]: score
      }
    }));
  };

  const handleConfirmMatch = (groupId, matchId) => {
    const matchKey = `${groupId}-${matchId}`;
    const matchScores = scores[matchKey];
    if (matchScores?.team1 != null && matchScores?.team2 != null) {
      updateMatchScore(groupId, matchId, parseInt(matchScores.team1), parseInt(matchScores.team2));
    }
  };

  const allMatchesCompleted = () => {
    return Object.values(matches).every(groupMatches => 
      groupMatches.every(match => match.isCompleted)
    );
  };

  const handleStartKnockout = () => {
    generateKnockoutStage();
    navigate('/knockout');
  };

  const renderMatch = (match, groupId) => {
    const matchKey = `${groupId}-${match.id}`;
    return (
      <div key={matchKey} style={styles.match}>
        <span style={styles.teamName}>{match.team1.name}</span>
        <input
          type="number"
          min="0"
          value={scores[matchKey]?.team1 || ''}
          onChange={(e) => handleScoreChange(groupId, match.id, 'team1', e.target.value)}
          disabled={match.isCompleted}
          style={styles.scoreInput}
        />
        <span>vs</span>
        <input
          type="number"
          min="0"
          value={scores[matchKey]?.team2 || ''}
          onChange={(e) => handleScoreChange(groupId, match.id, 'team2', e.target.value)}
          disabled={match.isCompleted}
          style={styles.scoreInput}
        />
        <span style={styles.teamName}>{match.team2.name}</span>
        {!match.isCompleted && scores[matchKey]?.team1 != null && scores[matchKey]?.team2 != null && (
          <button 
            onClick={() => handleConfirmMatch(groupId, match.id)}
            style={styles.confirmButton}
          >
            Conferma
          </button>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h1>Group Stage</h1>
      
      <div style={styles.groupsContainer}>
        {['A', 'B'].map(groupId => (
          <div key={groupId} style={styles.group}>
            <h2>Group {groupId}</h2>
            <div style={styles.standings}>
              <h3>Standings</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>P</th>
                    <th>M</th>
                    <th>CA</th>
                    <th>WA</th>
                  </tr>
                </thead>
                <tbody>
                  {groups[groupId]
                    .sort((a, b) => b.points - a.points)
                    .map(team => (
                      <tr key={team.id}>
                        <td>{team.name}</td>
                        <td>{team.points}</td>
                        <td>{team.matchesPlayed}</td>
                        <td>{team.correctAnswers}</td>
                        <td>{team.wrongAnswers}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div style={styles.matches}>
              <h3>Matches</h3>
              {matches[groupId].map(match => renderMatch(match, groupId))}
            </div>
          </div>
        ))}
      </div>

      {allMatchesCompleted() && (
        <button
          onClick={handleStartKnockout}
          style={styles.knockoutButton}
        >
          Start Final Stage
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  groupsContainer: {
    display: 'flex',
    gap: '40px',
    marginTop: '20px'
  },
  group: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px'
  },
  standings: {
    marginBottom: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px'
  },
  match: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '4px'
  },
  scoreInput: {
    width: '50px',
    padding: '5px',
    textAlign: 'center'
  },
  knockoutButton: {
    marginTop: '20px',
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%'
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
  teamName: {
    minWidth: '120px'
  }
};

export default GroupStage; 