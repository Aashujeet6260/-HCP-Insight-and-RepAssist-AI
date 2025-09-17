import React from 'react';
import Navbar from './components/Navbar';
import LogInteractionForm from './components/LogInteractionForm';
import AIAssistant from './components/AIAssistant';

function App() {
  return (
    <div className="min-h-screen bg-gray-bg font-inter">
      <Navbar />
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-text-primary mb-1">Log HCP Interaction</h1>
          <p className="text-text-secondary mb-6">Fill the form below or use the AI Assistant to log your interaction.</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <LogInteractionForm />
            </div>
            <div className="lg:col-span-1">
              <AIAssistant />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;