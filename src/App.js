import { TournamentProvider } from './context/TournamentContext';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <TournamentProvider>
      <div className="App">
        <Dashboard />
      </div>
    </TournamentProvider>
  );
}

export default App; 