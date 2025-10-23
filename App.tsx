
import React, { useState, useMemo } from 'react';
import Earn from './components/Earn';
import Save from './components/Save';

type Tab = 'earn' | 'save';

const DollarSignIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8v1m0 10v1m0-13a9 9 0 110 18 9 9 0 010-18z" />
  </svg>
);

const ShoppingCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);


const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('earn');

  const renderContent = () => {
    switch (activeTab) {
      case 'earn':
        return <Earn />;
      case 'save':
        return <Save />;
      default:
        return null;
    }
  };

  // FIX: Changed icon type from JSX.Element to React.ReactNode to resolve "Cannot find namespace 'JSX'" error.
  const TabButton = ({ tab, label, icon }: { tab: Tab, label: string, icon: React.ReactNode }) => {
    const isActive = activeTab === tab;
    return (
      <button
        onClick={() => setActiveTab(tab)}
        className={`flex-1 flex items-center justify-center py-4 px-2 text-lg font-semibold transition-all duration-300 ease-in-out border-b-4 ${
          isActive ? 'text-cyan-400 border-cyan-400' : 'text-slate-400 border-transparent hover:text-white hover:border-slate-600'
        }`}
      >
        {icon}
        {label}
      </button>
    );
  };
  
  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Hard Times Toolkit
            </h1>
            <p className="text-slate-400 text-lg">Your AI-powered guide to earning more and spending less.</p>
        </header>

        <main>
          <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden">
            <nav className="flex border-b border-slate-700">
              <TabButton tab="earn" label="Earn" icon={<DollarSignIcon />} />
              <TabButton tab="save" label="Save" icon={<ShoppingCartIcon />} />
            </nav>
            <div className="p-4 md:p-8">
              {renderContent()}
            </div>
          </div>
        </main>

        <footer className="text-center mt-12 text-slate-500">
            <p>&copy; {new Date().getFullYear()} Hard Times Toolkit. Stay resilient.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;