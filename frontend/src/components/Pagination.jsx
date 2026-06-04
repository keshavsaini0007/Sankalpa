import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const getPages = () => {
    const pages = []
    const start = Math.max(1, page - 1)
    const end = Math.min(totalPages, page + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 rounded-sm border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
        Prev
      </button>

      {getPages().map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`min-w-[32px] rounded-sm px-2 py-1.5 text-sm font-medium transition-all ${
            p === page
              ? 'bg-accent text-white'
              : 'text-muted hover:bg-surface hover:text-white'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1 rounded-sm border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:bg-surface hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

export default Pagination
