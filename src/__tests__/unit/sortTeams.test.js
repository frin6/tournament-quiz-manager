import { sortTeams } from '../../context/TournamentContext';

describe('sortTeams', () => {
  const mockTeams = [
    { id: 1, name: 'Team A', points: 3, correctAnswers: 5 },
    { id: 2, name: 'Team B', points: 3, correctAnswers: 3 },
    { id: 3, name: 'Team C', points: 1, correctAnswers: 2 },
  ];

  const mockMatches = [
    {
      team1: { id: 1 },
      team2: { id: 2 },
      team1Score: 2,
      team2Score: 1,
      isCompleted: true,
      date: new Date('2025-02-25'),
      time: '13:45'
    }
  ];

  test('sorts teams by points first', () => {
    const sorted = sortTeams(mockTeams, mockMatches);
    expect(sorted[0].points).toBeGreaterThanOrEqual(sorted[1].points);
  });

  test('uses head-to-head for teams with equal points', () => {
    const sorted = sortTeams(mockTeams, mockMatches);
    expect(sorted[0].id).toBe(1); // Team A won head-to-head against Team B
  });

  test('sorts by correct answers when points and head-to-head are equal', () => {
    const teamsWithEqualPoints = [
      { id: 1, name: 'Team A', points: 3, correctAnswers: 5 },
      { id: 2, name: 'Team B', points: 3, correctAnswers: 7 },
    ];
    const sorted = sortTeams(teamsWithEqualPoints, []);
    expect(sorted[0].id).toBe(2); // Team B has more correct answers
  });

  test('handles empty matches array', () => {
    const teams = [
      { id: 1, points: 3, correctAnswers: 2 },
      { id: 2, points: 1, correctAnswers: 3 },
    ];
    const sorted = sortTeams(teams, []);
    expect(sorted[0].id).toBe(1); // Should sort by points only
  });

  test('handles three-way tie correctly', () => {
    const threeWayTie = [
      { id: 1, name: 'Team A', points: 3, correctAnswers: 4 },
      { id: 2, name: 'Team B', points: 3, correctAnswers: 4 },
      { id: 3, name: 'Team C', points: 3, correctAnswers: 4 }
    ];
    const tieMatches = [
      { team1: { id: 1 }, team2: { id: 2 }, team1Score: 2, team2Score: 1, isCompleted: true },
      { team1: { id: 2 }, team2: { id: 3 }, team1Score: 2, team2Score: 1, isCompleted: true },
      { team1: { id: 3 }, team2: { id: 1 }, team1Score: 2, team2Score: 1, isCompleted: true }
    ];
    const sorted = sortTeams(threeWayTie, tieMatches);
    expect(sorted.map(t => t.id)).toEqual([1, 2, 3]); // Should maintain original order in case of complete tie
  });
}); 