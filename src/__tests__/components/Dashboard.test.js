import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../../pages/Dashboard';
import { TournamentProvider } from '../../context/TournamentContext';

describe('Dashboard', () => {
  const defaultMockContext = {
    groups: {
      A: [
        { id: 1, name: 'Team A', points: 0, correctAnswers: 0 },
        { id: 2, name: 'Team B', points: 0, correctAnswers: 0 }
      ],
      B: [
        { id: 3, name: 'Team C', points: 0, correctAnswers: 0 },
        { id: 4, name: 'Team D', points: 0, correctAnswers: 0 }
      ]
    },
    matches: {
      A: [{ id: 'A-0-1', team1Score: null, team2Score: null, isCompleted: false }],
      B: [{ id: 'B-0-1', team1Score: null, team2Score: null, isCompleted: false }]
    },
    knockoutMatches: { semifinals: [], final: null },
    updateMatchScore: jest.fn(),
    updateKnockoutMatch: jest.fn(),
    generateKnockoutStage: jest.fn()
  };

  test('renders all sections', () => {
    render(
      <TournamentProvider value={defaultMockContext}>
        <Dashboard />
      </TournamentProvider>
    );

    fireEvent.click(screen.getByText('Groups'));
    expect(screen.getAllByText(/standings/i)[0]).toBeInTheDocument();
  });

  test('displays correct table headers', () => {
    render(
      <TournamentProvider value={defaultMockContext}>
        <Dashboard />
      </TournamentProvider>
    );

    fireEvent.click(screen.getByText('Groups'));
    expect(screen.getAllByText(/points/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/matches/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/correct answers/i)[0]).toBeInTheDocument();
  });

  test('switches between sections correctly', () => {
    render(
      <TournamentProvider value={defaultMockContext}>
        <Dashboard />
      </TournamentProvider>
    );

    const teamsButton = screen.getByText('Teams');
    const groupsButton = screen.getByText('Groups');
    const finalStageButton = screen.getByText('Final Stage');

    fireEvent.click(groupsButton);
    expect(screen.getAllByText(/standings/i)[0]).toBeInTheDocument();

    fireEvent.click(finalStageButton);
    expect(screen.getByText('Complete all group matches to see the knockout stage')).toBeInTheDocument();
  });

  test('displays match scores correctly', () => {
    render(
      <TournamentProvider value={defaultMockContext}>
        <Dashboard />
      </TournamentProvider>
    );

    fireEvent.click(screen.getByText('Groups'));
    const dashScores = screen.getAllByText('-');
    expect(dashScores.length).toBeGreaterThan(0);
  });
}); 