/*
COMP90024 2021 S1 Assignment 2
Team: 41
City: Melbourne
Group Member:
Huimin Huang 1142020
Han Sun 1111271
Jean Ma 1028582
Shirui Cheng 1189721
Xiaoyue Lyu 1237539
*/

import './App.css';

import OpenPage from './views/Page/OpenPage'
import Scenario1 from './views/Page/Scenario1'
import Scenario2 from './views/Page/Scenario2'

import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Route path="/"exact component={OpenPage} />
      <Route path="/scenario-1" component={Scenario1} />
      <Route path="/scenario-2" component={Scenario2} />
    </Router>
  );
}

export default App;
