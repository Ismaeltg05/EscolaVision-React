import './App.css';
import Home from './components/Home';

function App({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <>
      <Home onLoginClick={onLoginClick} />
    </>
  );
}

export default App;