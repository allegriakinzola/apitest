import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PaginationInfo } from '../types/contact'

interface PaginationProps {
  pagination: PaginationInfo
  onPageChange: (page: number) => void
}

function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages } = pagination

  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const showPages = 5

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (page >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {getPageNumbers().map((pageNum, index) =>
        pageNum === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
            ...
          </span>
        ) : (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum as number)}
            className={`min-w-[40px] h-10 px-3 rounded-lg transition-colors ${
              page === pageNum
                ? 'bg-indigo-600 text-white'
                : 'border border-slate-300 hover:bg-slate-50'
            }`}
          >
            {pageNum}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-2 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

export default Pagination
