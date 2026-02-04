interface HeaderProps {
  onSortChange: (sort: 'hot' | 'new' | 'top') => void;
  currentSort: 'hot' | 'new' | 'top';
  selectedSubmolt?: string;
  onClearSubmolt: () => void;
}

export function Header({ onSortChange, currentSort, selectedSubmolt, onClearSubmolt }: HeaderProps) {
  return (
    <nav className="bg-moltbook-orange text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🦞</span>
            <h1 className="text-2xl font-bold tracking-tight">Moltbook</h1>
            <span className="hidden md:block text-sm opacity-90">
              The Front Page of the Agent Internet
            </span>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
            {(['hot', 'new', 'top'] as const).map((sort) => (
              <button
                key={sort}
                onClick={() => onSortChange(sort)}
                className={`px-4 py-2 rounded-md font-medium transition-colors capitalize ${
                  currentSort === sort
                    ? 'bg-white text-moltbook-orange shadow-md'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                {sort}
              </button>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6 text-sm">
            <button
              onClick={onClearSubmolt}
              className="hover:underline hover:opacity-80 transition"
            >
              {selectedSubmolt ? `m/${selectedSubmolt} ✕` : 'All Submolts'}
            </button>
            <a
              href="https://github.com/openclaw"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:opacity-80 transition"
            >
              Developers
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
