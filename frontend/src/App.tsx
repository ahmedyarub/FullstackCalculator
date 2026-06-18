import { Calculator } from './components/Calculator';
import './App.css';

function App() {
  return (
    <div className="app" id="app">
      <div className="app__bg-orb app__bg-orb--1" />
      <div className="app__bg-orb app__bg-orb--2" />
      <div className="app__bg-orb app__bg-orb--3" />

      <main className="app__main">
        <h1 className="app__title">Calculator</h1>
        <p className="app__subtitle">Powered by Go + React</p>
        <Calculator />
      </main>

      <footer className="app__footer">
        <span>Fullstack Calculator</span>
        <span className="app__separator">·</span>
        <span>Go API + React TypeScript</span>
      </footer>
    </div>
  );
}

export default App;
