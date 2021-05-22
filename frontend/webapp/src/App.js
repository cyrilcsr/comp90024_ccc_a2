import './App.css';

import OpenPage from './views/Page/OpenPage'
import Home from './views/Page/Home'
import Scenario1 from './views/Page/Scenario1'
import Scenario2 from './views/Page/Scenario2'


import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Route path="/"exact component={OpenPage} />
      <Route path="/map"exact component={Home} />
      <Route path="/scenario-1" component={Scenario1} />
      <Route path="/scenario-2" component={Scenario2} />
    </Router>
  );
}

export default App;
