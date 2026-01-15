import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher par nom, email, téléphone, ville..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white shadow-sm"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-slate-400" />
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar
