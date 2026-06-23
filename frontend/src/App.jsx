import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import './App.css';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Navigation */}
      <Header />
      
      {/* Main Content Area */}
      <main className="flex-grow flex flex-col">
        <Dashboard />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
