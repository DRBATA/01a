import React from 'react';
import SymptomChecker from './components/SymptomChecker';
import PharmacyFirstEligibilityChecker from './components/PharmacyFirstEligibilityChecker';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>InstaDoc Symptom Checker</h1>
      </header>
      <main>
        <PharmacyFirstEligibilityChecker/>
      </main>
    </div>
  );
}

export default App;
