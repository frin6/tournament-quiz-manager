import { renderHook, act } from '@testing-library/react-hooks';
import { useTournament, TournamentProvider } from '../../context/TournamentContext';
import React from 'react';

describe('Tournament Flow', () => {
  const wrapper = ({ children }) => (
    <TournamentProvider>{children}</TournamentProvider>
  );

  const mockInitialState = {
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
    knockoutMatches: { semifinals: [], final: null }
  };

  test('completes group stage and generates knockout stage', () => {
    const { result } = renderHook(() => useTournament(), { wrapper });

    act(() => {
      result.current.matches.A.forEach(match => {
        result.current.updateMatchScore('A', match.id, 2, 1);
      });
      result.current.matches.B.forEach(match => {
        result.current.updateMatchScore('B', match.id, 2, 1);
      });
      result.current.generateKnockoutStage();
    });

    expect(result.current.knockoutMatches.semifinals).toHaveLength(2);
  });

  test('generates correct semifinals matchups', () => {
    const { result } = renderHook(() => useTournament(), { wrapper });

    act(() => {
      result.current.matches.A.forEach(match => {
        result.current.updateMatchScore('A', match.id, 3, 1);
      });
      result.current.matches.B.forEach(match => {
        result.current.updateMatchScore('B', match.id, 2, 1);
      });
    });

    expect(result.current.knockoutMatches.semifinals[0].team1.id).toBe(1);
    expect(result.current.knockoutMatches.semifinals[0].team2.id).toBe(6);
  });

  test('completes tournament and determines winner', () => {
    const { result } = renderHook(() => useTournament(), { wrapper });
    
    act(() => {
      [...result.current.matches.A, ...result.current.matches.B].forEach(match => {
        result.current.updateMatchScore(match.id.startsWith('A') ? 'A' : 'B', match.id, 2, 1);
      });
    });

    act(() => {
      result.current.knockoutMatches.semifinals.forEach(match => {
        result.current.updateKnockoutMatch(match.id, 3, 1);
      });
    });

    act(() => {
      result.current.updateKnockoutMatch('final', 2, 0);
    });

    expect(result.current.knockoutMatches.final.isCompleted).toBe(true);
    expect(result.current.knockoutMatches.final.team1Score).toBe(2);
  });

  test('prevents updating completed matches', () => {
    const { result } = renderHook(() => useTournament(), { wrapper });
    
    act(() => {
      result.current.updateMatchScore('A', 'A-0-1', 2, 1);
    });

    const match = result.current.matches.A.find(m => m.id === 'A-0-1');
    expect(match.team1Score).toBe(2);
    expect(match.team2Score).toBe(1);

    act(() => {
      result.current.updateMatchScore('A', 'A-0-1', 3, 3);
    });

    expect(result.current.matches.A.find(m => m.id === 'A-0-1').team1Score).toBe(2);
    expect(result.current.matches.A.find(m => m.id === 'A-0-1').team2Score).toBe(1);
  });
}); 