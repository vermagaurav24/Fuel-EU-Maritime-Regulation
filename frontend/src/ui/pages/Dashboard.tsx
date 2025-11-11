import { useState, type ReactElement } from 'react';
import Header from '../layouts/Header';
import TabNavigation from '../layouts/TabNavigation';
import RoutesTab from '../components/Routes/RoutesTab';
import CompareTab from '../components/Compare/CompareTab';
import BankingTab from '../components/Banking/BankingTab';
import PoolingTab from '../components/Pooling/PoolingTab';

type TabType = 'routes' | 'compare' | 'banking' | 'pooling';

export default function Dashboard(): ReactElement {
  const [activeTab, setActiveTab] = useState<TabType>('routes');

  const renderTabContent = (): ReactElement => {
    switch (activeTab) {
      case 'routes':
        return <RoutesTab />;
      case 'compare':
        return <CompareTab />;
      case 'banking':
        return <BankingTab />;
      case 'pooling':
        return <PoolingTab />;
      default:
        return <RoutesTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            FuelEU Maritime Compliance Platform © 2024 - Regulation (EU) 2023/1805
          </p>
        </div>
      </footer>
    </div>
  );
}