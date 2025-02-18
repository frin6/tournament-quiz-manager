import { useTournament } from '../context/TournamentContext';
import { useState, useEffect } from 'react';

function Dashboard() {
  const { 
    groups, 
    matches, 
    knockoutMatches, 
    updateMatchScore, 
    updateKnockoutMatch, 
    generateKnockoutStage
  } = useTournament();
  const [groupScores, setGroupScores] = useState({});
  const [knockoutScores, setKnockoutScores] = useState({});
  const [activeSection, setActiveSection] = useState('teams'); // teams, groups, or knockout

  // Check if all group matches are completed and generate knockout stage
  useEffect(() => {
    const allMatchesCompleted = 
      matches.A.every(match => match.isCompleted) && 
      matches.B.every(match => match.isCompleted);

    if (allMatchesCompleted && (!knockoutMatches.semifinals || knockoutMatches.semifinals.length === 0)) {
      generateKnockoutStage();
    }
  }, [matches, knockoutMatches, generateKnockoutStage]);

  // Group stage handlers
  const handleGroupScoreChange = (groupId, matchId, team, score) => {
    const matchKey = `${groupId}-${matchId}`;
    setGroupScores(prev => ({
      ...prev,
      [matchKey]: {
        ...prev[matchKey],
        [team]: score
      }
    }));
  };

  const handleGroupConfirmMatch = (groupId, matchId) => {
    const matchKey = `${groupId}-${matchId}`;
    const matchScores = groupScores[matchKey];
    if (matchScores?.team1 != null && matchScores?.team2 != null) {
      updateMatchScore(groupId, matchId, parseInt(matchScores.team1), parseInt(matchScores.team2));
    }
  };

  // Knockout stage handlers
  const handleKnockoutScoreChange = (matchId, team, score) => {
    setKnockoutScores(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: score
      }
    }));
  };

  const handleKnockoutConfirmMatch = (matchId) => {
    const matchScores = knockoutScores[matchId];
    if (matchScores?.team1 != null && matchScores?.team2 != null) {
      updateKnockoutMatch(matchId, parseInt(matchScores.team1), parseInt(matchScores.team2));
    }
  };

  // Render functions
  const renderTeams = () => (
    <div style={styles.teamsSection}>
      <div style={styles.group}>
        <h2>Builder Group</h2>
        <ul style={styles.teamList}>
          {[...groups.A].sort((a, b) => a.name.localeCompare(b.name)).map(team => (
            <li key={team.id} style={styles.teamItem}>{team.name}</li>
          ))}
        </ul>
      </div>
      <div style={styles.group}>
        <h2>Explorer Group</h2>
        <ul style={styles.teamList}>
          {[...groups.B].sort((a, b) => a.name.localeCompare(b.name)).map(team => (
            <li key={team.id} style={styles.teamItem}>{team.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderMatch = (match, groupId) => (
    <div key={match.id} style={styles.match}>
      <span style={styles.teamName}>{match.team1.name}</span>
      <span style={styles.score}>
        {match.isCompleted ? match.team1Score : '-'}
      </span>
      <span>vs</span>
      <span style={styles.score}>
        {match.isCompleted ? match.team2Score : '-'}
      </span>
      <span style={styles.teamName}>{match.team2.name}</span>
    </div>
  );

  const renderKnockoutMatch = (match) => (
    <div key={match.id} style={styles.match}>
      <span style={styles.teamName}>{match.team1.name}</span>
      <input
        type="number"
        min="0"
        value={knockoutScores[match.id]?.team1 || ''}
        onChange={(e) => handleKnockoutScoreChange(match.id, 'team1', e.target.value)}
        disabled={match.isCompleted}
        style={styles.scoreInput}
      />
      <span>vs</span>
      <input
        type="number"
        min="0"
        value={knockoutScores[match.id]?.team2 || ''}
        onChange={(e) => handleKnockoutScoreChange(match.id, 'team2', e.target.value)}
        disabled={match.isCompleted}
        style={styles.scoreInput}
      />
      <span style={styles.teamName}>{match.team2.name}</span>
      {!match.isCompleted && knockoutScores[match.id]?.team1 != null && 
       knockoutScores[match.id]?.team2 != null && (
        <button 
          onClick={() => handleKnockoutConfirmMatch(match.id)}
          style={styles.confirmButton}
        >
          Confirm
        </button>
      )}
    </div>
  );

  const renderGroupStage = () => (
    <div style={styles.groupsContainer}>
      {['A', 'B'].map(groupId => (
        <div key={groupId} style={styles.group}>
          <h2>{groupId === 'A' ? 'Builder Group' : 'Explorer Group'}</h2>
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
                  <th>Diff</th>
                </tr>
              </thead>
              <tbody>
                {groups[groupId]
                  .sort((a, b) => b.points - a.points)
                  .map(team => (
                    <tr key={team.id}>
                      <td>{team.name}</td>
                      <td>{team.matchesPlayed > 0 ? team.points : '-'}</td>
                      <td>{team.matchesPlayed > 0 ? team.matchesPlayed : '-'}</td>
                      <td>{team.matchesPlayed > 0 ? team.correctAnswers : '-'}</td>
                      <td>{team.matchesPlayed > 0 ? team.wrongAnswers : '-'}</td>
                      <td>{team.matchesPlayed > 0 ? (team.correctAnswers - team.wrongAnswers) : '-'}</td>
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
  );

  const renderKnockoutStage = () => {
    if (!knockoutMatches.semifinals?.length) {
      return (
        <div style={styles.message}>
          Complete all group matches to see the knockout stage
        </div>
      );
    }

    return (
      <div>
        <div style={styles.semifinals}>
          <h2>Semi-finals</h2>
          {knockoutMatches.semifinals.map(match => renderKnockoutMatch(match))}
        </div>

        {knockoutMatches.final && (
          <div style={styles.final}>
            <h2>Final</h2>
            {renderKnockoutMatch(knockoutMatches.final)}
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.navigation}>
        <button 
          onClick={() => setActiveSection('teams')}
          style={{...styles.navButton, ...(activeSection === 'teams' ? styles.activeButton : {})}}
        >
          Teams
        </button>
        <button 
          onClick={() => setActiveSection('groups')}
          style={{...styles.navButton, ...(activeSection === 'groups' ? styles.activeButton : {})}}
        >
          Groups
        </button>
        <button 
          onClick={() => setActiveSection('knockout')}
          style={{...styles.navButton, ...(activeSection === 'knockout' ? styles.activeButton : {})}}
        >
          Final Stage
        </button>
      </div>

      {activeSection === 'teams' && renderTeams()}
      {activeSection === 'groups' && renderGroupStage()}
      {activeSection === 'knockout' && renderKnockoutStage()}
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  navigation: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  navButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: '#f0f0f0'
  },
  activeButton: {
    backgroundColor: '#007bff',
    color: 'white'
  },
  teamsSection: {
    display: 'flex',
    gap: '40px',
    justifyContent: 'center'
  },
  group: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    minWidth: '300px'
  },
  teamList: {
    listStyle: 'none',
    padding: 0
  },
  teamItem: {
    padding: '8px',
    borderBottom: '1px solid #eee'
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
  score: {
    fontSize: '18px',
    fontWeight: 'bold',
    padding: '0 10px'
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
  groupsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '40px',
    justifyContent: 'center'
  },
  standings: {
    marginBottom: '20px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  'th, td': {
    padding: '12px 8px',
    textAlign: 'center',
    borderBottom: '1px solid #eee'
  },
  winner: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#ffc107',
    borderRadius: '8px',
    marginTop: '20px'
  },
  winnerName: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '10px'
  },
  semifinals: {
    marginBottom: '40px'
  },
  final: {
    marginBottom: '40px',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px'
  },
  matches: {
    marginTop: '20px'
  },
  message: {
    padding: '20px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#666'
  }
};

export default Dashboard; 