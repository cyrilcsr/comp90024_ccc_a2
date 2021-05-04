import './App.css';
import Dashboard from './views/Page/Dashboard';
import FrontPage from './views/Page/FrontPage'

import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Route path="/"exact component={FrontPage} />
      <Route path="/dashboard" component={Dashboard} />
    </Router>
  );
}

export default App;
