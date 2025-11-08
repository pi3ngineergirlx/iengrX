import './App.css';
import CardGrid from './components/CardGrid';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className="App">
      <Navbar />
      <h1>Sci-Fi Dungeons and Dragons</h1>
      <h4>iengrX</h4>
      <CardGrid />
    </div>
  )
}

export default App;