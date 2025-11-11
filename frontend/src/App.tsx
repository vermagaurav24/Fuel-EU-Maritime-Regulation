import React, { type ReactElement } from 'react';

function Dashboard(): ReactElement {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600">Placeholder dashboard component.</p>
    </main>
  );
}

function App(): ReactElement {
  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  );
}

export default App;