import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from './pagination'

interface PaginationProps {
  totalPages: number // Total number of pages
  currentPage: number // Current active page
  onPageChange: (page: number) => void // Callback for page change
}

const ClaudePagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  // Helper to generate an array of page numbers
  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = []

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          '...',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        )
      } else {
        pages.push(
          1,
          '...',
          currentPage - 1,
          currentPage,
          currentPage + 1,
          '...',
          totalPages
        )
      }
    }
    return pages
  }

  const handlePageClick = (page: number | '...') => {
    if (page === '...' || page === currentPage) return
    onPageChange(page as number)
  }

  return (
    <Pagination className="w-auto mx-0">
      <PaginationContent className="flex items-center justify-end gap-3">
        <PaginationItem>
          <PaginationLink
            onClick={() => {
              if (currentPage === 1) {
                return
              } else handlePageClick(currentPage - 1)
            }}
            className={cn(
              'h-12 w-12 border border-primary hover:bg-primary cursor-pointer hover:text-white rounded-[6px] flex items-center justify-center transition-all duration-200',
              currentPage === 1 &&
              'cursor-not-allowed bg-[#E3E3E3] border-0 pointer-events-none'
            )}
          >
            <ChevronLeft
              className={cn('h-6 w-6 text-[#00253E]', currentPage === 1 && 'text-[#B0B0B0]')}
            />
          </PaginationLink>
        </PaginationItem>

        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            <PaginationLink
              onClick={() => handlePageClick(page)}
              className={cn(
                'h-12 w-12 border cursor-pointer border-primary hover:text-white rounded-[6px] flex items-center justify-center text-[18px] font-bold transition-all duration-200',
                page === currentPage
                  ? 'bg-primary text-[#00253E] hover:bg-primary/90'
                  : 'text-[#00253E] hover:bg-primary hover:text-white border-transparent'
              )}
            >
              {page === '...' ? '...' : page}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationLink
            onClick={() => {
              if (totalPages === currentPage) {
                return
              } else {
                handlePageClick(currentPage + 1)
              }
            }}
            className={cn(
              'h-12 w-12 border border-primary hover:bg-primary cursor-pointer hover:text-white rounded-[6px] flex items-center justify-center transition-all duration-200',
              currentPage === totalPages &&
              'cursor-not-allowed bg-[#E3E3E3] border-0 pointer-events-none'
            )}
          >
            <ChevronRight className="h-6 w-6 text-[#00253E]" />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default ClaudePagination
