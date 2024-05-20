import React from 'react';
import SalaryTable from './components/SalaryTable';
import LineChart from './components/LineChart';

const App = () => {
  return (
    <div className="App">
      <h1>ML Engineer Salaries Dashboard</h1>
      <SalaryTable />
      <LineChart />
    </div>
  );
};

export default App;

