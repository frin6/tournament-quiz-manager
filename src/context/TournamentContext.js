import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TournamentContext = createContext();

// Helper function to generate match dates
export const generateMatchDates = (startDate) => {
  const dates = [];
  // Use provided date or default to Feb 25, 2025
  let currentDate = startDate instanceof Date ? new Date(startDate) : new Date('2025-02-25');

  // Dates to skip (in addition to weekends)
  const skipDates = ['2025-03-03', '2025-03-04'];

  while (dates.length < 12) { // 6 matches per group
    // Skip weekends and specific dates
    const dateString = currentDate.toISOString().split('T')[0];
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6 && !skipDates.includes(dateString)) {
      dates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

// Predefined teams
const INITIAL_TEAMS = [
  // Builder Group (A)
  { id: 1, name: "Manuel", points: 0, correctAnswers: 0, wrongAnswers: 0, matchesPlayed: 0 },
  { id: 2, name: "Matteo", points: 0, correctAnswers: 0, wrongAnswers: 0, matchesPlayed: 0 },
  { id: 3, name: "Giacomo", points: 0, correctAnswers: 0, wrongAnswers: 0, matchesPlayed: 0 },
  { id: 4, name: "Giovanni", points: 0, correctAnswers: 0, wrongAnswers: 0, matchesPlayed: 0 },
  // Explorer Group (B)
  { id: 5, name: "Stefano", points: 0, correctAnswers: 0, wrongAnswers: 0, matchesPlayed: 0 },
  { id: 6, name: "Davide", points: 0, correctAnswers: 0, wrongAnswers: 0, matchesPlayed: 0 },
  { id: 7, name: "Edoardo", points: 0, correctAnswers: 0, wrongAnswers: 0, matchesPlayed: 0 },
  { id: 8, name: "Daniele", points: 0, correctAnswers: 0, wrongAnswers: 0, matchesPlayed: 0 },
];

// Generate match dates starting from February 25, 2025
const matchDates = generateMatchDates(new Date('2025-02-25'));

const INITIAL_MATCHES = {
  A: [
    {
      id: 'A-0-1',
      team1: INITIAL_TEAMS[0], // Manuel
      team2: INITIAL_TEAMS[1], // Matteo
      team1Score: 1,
      team2Score: 1,
      isCompleted: true,
      date: matchDates[0], // Feb 25
      time: '13:45'
    },
    {
      id: 'A-0-2',
      team1: INITIAL_TEAMS[3], // Giovanni
      team2: INITIAL_TEAMS[2], // Giacomo
      team1Score: 0,
      team2Score: 3,
      isCompleted: true,
      date: matchDates[2], // Feb 27
      time: '13:45'
    },
    {
      id: 'A-0-3',
      team1: INITIAL_TEAMS[0], // Manuel
      team2: INITIAL_TEAMS[3], // Giovanni
      team1Score: null,
      team2Score: null,
      isCompleted: false,
      date: matchDates[4], // Feb 29
      time: '13:45'
    },
    {
      id: 'A-0-4',
      team1: INITIAL_TEAMS[1], // Matteo
      team2: INITIAL_TEAMS[2], // Giacomo
      team1Score: null,
      team2Score: null,
      isCompleted: false,
      date: matchDates[6], // Mar 4
      time: '13:45'
    },
    {
      id: 'A-0-5',
      team1: INITIAL_TEAMS[1], // Matteo
      team2: INITIAL_TEAMS[3], // Giovanni
      team1Score: null,
      team2Score: null,
      isCompleted: false,
      date: matchDates[8], // Mar 6
      time: '13:45'
    },
    {
      id: 'A-0-6',
      team1: INITIAL_TEAMS[2], // Giacomo
      team2: INITIAL_TEAMS[0], // Manuel
      team1Score: null,
      team2Score: null,
      isCompleted: false,
      date: matchDates[10], // Mar 8
      time: '13:45'
    }
  ],
  B: [
    {
      id: 'B-0-1',
      team1: INITIAL_TEAMS[4], // Stefano
      team2: INITIAL_TEAMS[5], // Davide
      team1Score: 1,
      team2Score: 2,
      isCompleted: true,
      date: matchDates[1], // Feb 26
      time: '13:45'
    },
    {
      id: 'B-0-2',
      team1: INITIAL_TEAMS[7], // Daniele
      team2: INITIAL_TEAMS[6], // Edoardo
      team1Score: 2,
      team2Score: 2,
      isCompleted: true,
      date: matchDates[3], // Feb 28
      time: '13:45'
    },
    {
      id: 'B-0-3',
      team1: INITIAL_TEAMS[4], // Stefano
      team2: INITIAL_TEAMS[7], // Daniele
      team1Score: null,
      team2Score: null,
      isCompleted: false,
      date: matchDates[5], // Mar 1
      time: '13:45'
    },
    {
      id: 'B-0-4',
      team1: INITIAL_TEAMS[5], // Davide
      team2: INITIAL_TEAMS[6], // Edoardo
      team1Score: null,
      team2Score: null,
      isCompleted: false,
      date: matchDates[7], // Mar 5
      time: '13:45'
    },
    {
      id: 'B-0-5',
      team1: INITIAL_TEAMS[5], // Davide
      team2: INITIAL_TEAMS[7], // Daniele
      team1Score: null,
      team2Score: null,
      isCompleted: false,
      date: matchDates[9], // Mar 7
      time: '13:45'
    },
    {
      id: 'B-0-6',
      team1: INITIAL_TEAMS[6], // Edoardo
      team2: INITIAL_TEAMS[4], // Stefano
      team1Score: null,
      team2Score: null,
      isCompleted: false,
      date: matchDates[11], // Mar 11
      time: '13:45'
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
    // Validate scores
    if (team1Score < 0 || team2Score < 0 || !Number.isInteger(team1Score) || !Number.isInteger(team2Score)) {
      return; // Don't update if scores are invalid
    }

    setMatches(prev => {
      const updatedMatches = { ...prev };
      const matchIndex = updatedMatches[groupId].findIndex(m => m.id === matchId);
      const match = updatedMatches[groupId][matchIndex];

      // Don't update if match is already completed
      if (match.isCompleted) {
        return prev;
      }

      // Create a new match object to ensure proper state updates
      const updatedMatch = {
        ...match,
        team1Score,
        team2Score,
        isCompleted: true
      };

      // Create a new array for the group's matches
      updatedMatches[groupId] = [
        ...updatedMatches[groupId].slice(0, matchIndex),
        updatedMatch,
        ...updatedMatches[groupId].slice(matchIndex + 1)
      ];

      // Update team stats
      setGroups(prevGroups => {
        const newGroups = { ...prevGroups };
        const team1 = newGroups[groupId].find(t => t.id === match.team1.id);
        const team2 = newGroups[groupId].find(t => t.id === match.team2.id);

        // Update matches played
        team1.matchesPlayed += 1;
        team2.matchesPlayed += 1;

        // Update correct answers
        team1.correctAnswers += team1Score;
        team2.correctAnswers += team2Score;

        // Update points
        if (team1Score > team2Score) {
          team1.points += 3;
        } else if (team2Score > team1Score) {
          team2.points += 3;
        } else {
          team1.points += 1;
          team2.points += 1;
        }

        return newGroups;
      });

      return updatedMatches;
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

export const sortTeams = (teams, matches) => {
  return [...teams].sort((a, b) => {
    // Sort by points first
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    // If points are equal, check head-to-head
    const headToHead = matches.find(match => 
      (match.team1.id === a.id && match.team2.id === b.id) ||
      (match.team1.id === b.id && match.team2.id === a.id)
    );

    if (headToHead && headToHead.isCompleted) {
      const aScore = headToHead.team1.id === a.id ? headToHead.team1Score : headToHead.team2Score;
      const bScore = headToHead.team1.id === b.id ? headToHead.team1Score : headToHead.team2Score;
      if (aScore !== bScore) {
        return bScore - aScore;
      }
    }

    // If still tied, sort by correct answers
    return b.correctAnswers - a.correctAnswers;
  });
}; 