import clsx from 'clsx';

type TabType = 'routes' | 'compare' | 'banking' | 'pooling';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'routes', name: 'Routes', icon: '🚢' },
    { id: 'compare', name: 'Compare', icon: '📊' },
    { id: 'banking', name: 'Banking', icon: '💰' },
    { id: 'pooling', name: 'Pooling', icon: '🤝' },
  ] as const;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
      <nav className="flex space-x-2" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as TabType)}
            className={clsx(
              'flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md font-medium text-sm transition-all duration-200',
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}