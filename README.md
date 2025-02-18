# Tournament Manager

A React-based tournament management system designed to handle a competition between two groups (Builder and Explorer) with group stages and knockout rounds. The system manages matches, calculates standings, and determines the tournament winner through semifinals and finals.

## Summary

The tournament consists of:
- 8 predefined teams split into two groups of 4
- Group stage with round-robin matches
- Knockout stage with semifinals and final
- Automatic standings calculation based on points and correct answers

## Features

### Group Stage
- Round-robin format within each group
- Points system:
  - Win: 3 points
  - Draw: 1 point
  - Loss: 0 points
- Standings determined by:
  1. Points
  2. Head-to-head results
  3. Total correct answers

### Knockout Stage
- Semi-finals:
  - 1st Builder Group vs 2nd Explorer Group
  - 1st Explorer Group vs 2nd Builder Group
- Final match between semi-final winners
- Interactive score input system
- Automatic winner determination

### Data Management
- Automatic match generation
- Real-time standings updates
- Score tracking and validation

## Tech Stack

- React 18
- Context API for state management
- CSS-in-JS for styling
- Local Storage for data persistence
- JavaScript ES6+

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/frin6/tournament-quiz-manager.git
cd tournament-quiz-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to:
http://localhost:3000

## Deployment

The application can be deployed using Vercel:

# Quiz Tournament App

A React application for managing quiz tournaments between teams.

## Testing Strategy

The application uses three types of tests:

1. **Unit Tests** (`src/__tests__/unit/`)
   - Tests individual functions like `sortTeams`
   - Focus on pure logic and sorting algorithms

2. **Component Tests** (`src/__tests__/components/`)
   - Test React components in isolation
   - Verify UI elements and user interactions
   - Use React Testing Library for DOM queries

3. **Integration Tests** (`src/__tests__/integration/`)
   - Test complete tournament flows
   - Verify state management and context updates
   - Use React Testing Library Hooks for testing custom hooks

## Test Coverage

Key functionality covered by tests:
- Team sorting and standings calculation
- Group stage completion
- Knockout stage generation
- Tournament completion flow
- UI navigation and display

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage
```
