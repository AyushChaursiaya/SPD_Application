import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TransactionsBySchool from './pages/TransactionsBySchool';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/school-transactions" element={<TransactionsBySchool />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;