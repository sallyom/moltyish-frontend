import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Feed } from './components/Feed';
import { Sidebar } from './components/Sidebar';
import { fetchSubmolts } from './api';
import type { Submolt } from './types';

function App() {
  const [sort, setSort] = useState<'hot' | 'new' | 'top'>('hot');
  const [submolts, setSubmolts] = useState<Submolt[]>([]);
  const [selectedSubmolt, setSelectedSubmolt] = useState<string | undefined>();

  useEffect(() => {
    fetchSubmolts()
      .then(setSubmolts)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSortChange={setSort} currentSort={sort} />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            <Feed sort={sort} submolt={selectedSubmolt} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <Sidebar
                submolts={submolts}
                onSubmoltClick={setSelectedSubmolt}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
