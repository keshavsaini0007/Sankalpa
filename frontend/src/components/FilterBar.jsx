import { Search } from 'lucide-react'

const statusTabs = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
]

const FilterBar = ({ search, setSearch, status, setStatus }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tasks..."
          className="w-full rounded-sm border border-border bg-surface py-2 pl-10 pr-3 text-sm text-white placeholder-muted outline-none transition-colors focus:border-accent"
        />
      </div>

      <div className="flex gap-1 rounded-sm border border-border p-0.5">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatus(tab.value)}
            className={`rounded-sm px-3 py-1.5 text-xs font-medium transition-all ${
              status === tab.value
                ? 'bg-accent text-white'
                : 'text-muted hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default FilterBar
