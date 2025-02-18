# Tournament Manager

A React-based tournament management system designed to handle a competition between two groups (Builder and Explorer) with group stages and knockout rounds. The system manages matches, calculates standings, and determines the tournament winner through semifinals and finals.

## Summary

The tournament consists of:
- 8 predefined teams split into two groups of 4
- Group stage with round-robin matches
- Knockout stage with semifinals and final
- Automatic standings calculation based on points and other criteria

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
  3. Answer difference (Correct - Wrong)
  4. Total correct answers

### Knockout Stage
- Semi-finals:
  - 1st Builder Group vs 2nd Explorer Group
  - 1st Explorer Group vs 2nd Builder Group
- Final match between semi-final winners
- Automatic winner determination

### Data Management
- Automatic match generation
- Real-time standings updates
- Score tracking and validation
- Tournament progress persistence

## Tech Stack

- React 18
- Context API for state management
- CSS-in-JS for styling
- Local Storage for data persistence
- JavaScript ES6+

## Local Development

1. Clone the repository:
git clone https://github.com/frin6/tournament-quiz-manager.git
cd tournament-quiz-manager

2. Install dependencies:
npm install

3. Start the development server:
npm start

4. Open your browser and navigate to:
http://localhost:3000

## Deployment

The application can be deployed using Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically deploy your application
4. Each push to the main branch will trigger a new deployment

You can also build the application locally:

1. npm run build
2. Serve the built files using your preferred static file server (e.g., serve, nginx, etc.)

This creates a `build` folder with optimized production files.
