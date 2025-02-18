import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TournamentContext = createContext();

// Predefined teams
const INITIAL_TEAMS = [
  // Builder Group (A)
  { id: 1, name: "Manuel", points: 0, correctAnswers: 0, wrongAnswers: 0, matchesPlayed: 0 },
  { id: 2, name: "Matteo", points: 0, correctAnswers: 0, wrongAnswers: 0, matchesPlayed: 0 },
  { id: 3, name: "Giacomo", points: 0, correctAnswers: 0, wrongAnswers: 0, matchesPlayed: 0 },
  { id: 4, name: "Giovanni", points: 0, correctAnswers: 0, wrongAnswers: 0, matchesPlayed: 0 },
  // Explorer Group (B)
  { id: 5, name: "Federico", points: 0, correctAnswers: 0, wrongAnswers: 0, matchesPlayed: 0 },
  { id: 6, name: "Davide", points: 0, correctAnswers: 0, wrongAnswers: 0, matchesPlayed: 0 },
  { id: 7, name: "Edoardo", points: 0, correctAnswers: 0, wrongAnswers: 0, matchesPlayed: 0 },
  { id: 8, name: "Daniele", points: 0, correctAnswers: 0, wrongAnswers: 0, matchesPlayed: 0 },
];

// Predefined match results
const INITIAL_MATCHES = {
  A: [
    // Builder Group matches (all combinations)
    {
      id: 'A-0-1',
      team1: INITIAL_TEAMS[0],
      team2: INITIAL_TEAMS[1],
      team1Score: null,
      team2Score: null,
      isCompleted: false
    },
    {
      id: 'A-0-2',
      team1: INITIAL_TEAMS[0],
      team2: INITIAL_TEAMS[2],
      team1Score: null,
      team2Score: null,
      isCompleted: false
    },
    {
      id: 'A-0-3',
      team1: INITIAL_TEAMS[0],
      team2: INITIAL_TEAMS[3],
      team1Score: null,
      team2Score: null,
      isCompleted: false
    },
    {
      id: 'A-1-2',
      team1: INITIAL_TEAMS[1],
      team2: INITIAL_TEAMS[2],
      team1Score: null,
      team2Score: null,
      isCompleted: false
    },
    {
      id: 'A-1-3',
      team1: INITIAL_TEAMS[1],
      team2: INITIAL_TEAMS[3],
      team1Score: null,
      team2Score: null,
      isCompleted: false
    },
    {
      id: 'A-2-3',
      team1: INITIAL_TEAMS[2],
      team2: INITIAL_TEAMS[3],
      team1Score: null,
      team2Score: null,
      isCompleted: false
    }
  ],
  B: [
    // Explorer Group matches (all combinations)
    {
      id: 'B-0-1',
      team1: INITIAL_TEAMS[4],
      team2: INITIAL_TEAMS[5],
      team1Score: null,
      team2Score: null,
      isCompleted: false
    },
    {
      id: 'B-0-2',
      team1: INITIAL_TEAMS[4],
      team2: INITIAL_TEAMS[6],
      team1Score: null,
      team2Score: null,
      isCompleted: false
    },
    {
      id: 'B-0-3',
      team1: INITIAL_TEAMS[4],
      team2: INITIAL_TEAMS[7],
      team1Score: null,
      team2Score: null,
      isCompleted: false
    },
    {
      id: 'B-1-2',
      team1: INITIAL_TEAMS[5],
      team2: INITIAL_TEAMS[6],
      team1Score: null,
      team2Score: null,
      isCompleted: false
    },
    {
      id: 'B-1-3',
      team1: INITIAL_TEAMS[5],
      team2: INITIAL_TEAMS[7],
      team1Score: null,
      team2Score: null,
      isCompleted: false
    },
    {
      id: 'B-2-3',
      team1: INITIAL_TEAMS[6],
      team2: INITIAL_TEAMS[7],
      team1Score: null,
      team2Score: null,
      isCompleted: false
    }
  ]
};

export function TournamentProvider({ children }) {
  const [teams] = useState(INITIAL_TEAMS);
  
  const [groups, setGroups] = useState(() => {
    const savedGroups = localStorage.getItem('tournament_groups');
    if (savedGroups) {
      return JSON.parse(savedGroups);
    }
    // Process initial matches to calculate team stats
    const processedTeams = [...INITIAL_TEAMS].map(team => ({
      ...team,
      points: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      matchesPlayed: 0
    }));

    // Calculate stats for each match
    Object.values(INITIAL_MATCHES).forEach(groupMatches => {
      groupMatches.forEach(match => {
        if (match.isCompleted) {
          // Find teams in processed array
          const team1 = processedTeams.find(t => t.id === match.team1.id);
          const team2 = processedTeams.find(t => t.id === match.team2.id);

          // Update stats for team1
          team1.matchesPlayed += 1;
          team1.correctAnswers += match.team1Score;
          team1.wrongAnswers += match.team2Score;
          if (match.team1Score > match.team2Score) {
            team1.points += 3;
          } else if (match.team1Score === match.team2Score) {
            team1.points += 1;
          }

          // Update stats for team2
          team2.matchesPlayed += 1;
          team2.correctAnswers += match.team2Score;
          team2.wrongAnswers += match.team1Score;
          if (match.team2Score > match.team1Score) {
            team2.points += 3;
          } else if (match.team1Score === match.team2Score) {
            team2.points += 1;
          }
        }
      });
    });

    return {
      A: processedTeams.slice(0, 4),
      B: processedTeams.slice(4)
    };
  });

  const [matches, setMatches] = useState(() => {
    const savedMatches = localStorage.getItem('tournament_matches');
    return savedMatches ? JSON.parse(savedMatches) : INITIAL_MATCHES;
  });

  const [knockoutMatches, setKnockoutMatches] = useState(() => {
    const savedKnockout = localStorage.getItem('tournament_knockout');
    return savedKnockout ? JSON.parse(savedKnockout) : {
      semifinals: [],
      final: null
    };
  });

  useEffect(() => {
    localStorage.setItem('tournament_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('tournament_matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('tournament_knockout', JSON.stringify(knockoutMatches));
  }, [knockoutMatches]);

  const updateMatchScore = (groupId, matchId, team1Score, team2Score) => {
    setMatches(prev => {
      const updatedMatches = {
        ...prev,
        [groupId]: prev[groupId].map(match => {
          if (match.id === matchId) {
            return {
              ...match,
              team1Score,
              team2Score,
              isCompleted: true
            };
          }
          return match;
        })
      };
      
      const match = prev[groupId].find(m => m.id === matchId);
      if (match) {
        setGroups(prevGroups => {
          const updatedGroup = prevGroups[groupId].map(team => {
            if (team.id === match.team1.id) {
              return {
                ...team,
                points: team.points + (team1Score > team2Score ? 3 : team1Score === team2Score ? 1 : 0),
                correctAnswers: team.correctAnswers + team1Score,
                wrongAnswers: team.wrongAnswers + team2Score,
                matchesPlayed: team.matchesPlayed + 1
              };
            }
            if (team.id === match.team2.id) {
              return {
                ...team,
                points: team.points + (team2Score > team1Score ? 3 : team2Score === team1Score ? 1 : 0),
                correctAnswers: team.correctAnswers + team2Score,
                wrongAnswers: team.wrongAnswers + team1Score,
                matchesPlayed: team.matchesPlayed + 1
              };
            }
            return team;
          });
          return { ...prevGroups, [groupId]: updatedGroup };
        });
      }
      
      return updatedMatches;
    });
  };

  const sortTeams = (groupTeams, groupMatches) => {
    return [...groupTeams].sort((a, b) => {
      // Prima confronta i punti
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      // Se i punti sono uguali, controlla lo scontro diretto
      const directMatch = groupMatches.find(match => 
        (match.team1.id === a.id && match.team2.id === b.id) ||
        (match.team1.id === b.id && match.team2.id === a.id)
      );

      if (directMatch && directMatch.isCompleted) {
        const aIsTeam1 = directMatch.team1.id === a.id;
        const aScore = aIsTeam1 ? directMatch.team1Score : directMatch.team2Score;
        const bScore = aIsTeam1 ? directMatch.team2Score : directMatch.team1Score;
        if (aScore !== bScore) {
          return bScore - aScore;
        }
      }

      // Se lo scontro diretto è pari o non c'è, guarda la differenza reti
      const aDiff = a.correctAnswers - a.wrongAnswers;
      const bDiff = b.correctAnswers - b.wrongAnswers;
      if (bDiff !== aDiff) {
        return bDiff - aDiff;
      }

      // Se anche la differenza reti è uguale, guarda le risposte corrette totali
      return b.correctAnswers - a.correctAnswers;
    });
  };

  const generateKnockoutStage = useCallback(() => {
    if (!groups.A?.length || !groups.B?.length) {
      return;
    }

    const sortedGroupA = sortTeams(groups.A, matches.A);
    const sortedGroupB = sortTeams(groups.B, matches.B);

    if (sortedGroupA.length < 2 || sortedGroupB.length < 2) {
      return;
    }

    const semifinals = [
      {
        id: 'semi1',
        team1: sortedGroupA[0],
        team2: sortedGroupB[1],
        team1Score: null,
        team2Score: null,
        isCompleted: false
      },
      {
        id: 'semi2',
        team1: sortedGroupB[0],
        team2: sortedGroupA[1],
        team1Score: null,
        team2Score: null,
        isCompleted: false
      }
    ];

    setKnockoutMatches({
      semifinals,
      final: null
    });
  }, [groups, matches]);

  const updateKnockoutMatch = (matchId, team1Score, team2Score) => {
    setKnockoutMatches(prev => {
      // Safety check for undefined matches
      if (!prev.semifinals?.length) {
        return prev;
      }

      if (matchId.startsWith('semi')) {
        const updatedSemifinals = prev.semifinals.map(match => {
          if (match.id === matchId) {
            return {
              ...match,
              team1Score,
              team2Score,
              isCompleted: true
            };
          }
          return match;
        });

        // Check if both semifinals are complete before creating final
        const bothSemisComplete = updatedSemifinals.every(m => m.isCompleted);
        if (bothSemisComplete) {
          const winners = updatedSemifinals.map(match => 
            match.team1Score > match.team2Score ? match.team1 : match.team2
          );

          const final = {
            id: 'final',
            team1: winners[0],
            team2: winners[1],
            team1Score: null,
            team2Score: null,
            isCompleted: false
          };

          return {
            semifinals: updatedSemifinals,
            final
          };
        }

        return {
          ...prev,
          semifinals: updatedSemifinals
        };
      }

      if (matchId === 'final' && prev.final) {
        return {
          ...prev,
          final: {
            ...prev.final,
            team1Score,
            team2Score,
            isCompleted: true
          }
        };
      }

      return prev;
    });
  };

  const resetTournament = () => {
    setGroups({
      A: teams.slice(0, 4),
      B: teams.slice(4)
    });
    setMatches({ A: [], B: [] });
    setKnockoutMatches({
      semifinals: [],
      final: null
    });
    localStorage.removeItem('tournament_groups');
    localStorage.removeItem('tournament_matches');
    localStorage.removeItem('tournament_knockout');
  };

  return (
    <TournamentContext.Provider value={{
      teams,
      groups,
      matches,
      knockoutMatches,
      updateMatchScore,
      generateKnockoutStage,
      updateKnockoutMatch,
      resetTournament
    }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  return useContext(TournamentContext);
} 