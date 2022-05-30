export interface PaginationInterface {
  page: number
  perPage: number
  total: number
  lastPage: number
  from: number
  to: number
  searchQuery: string
  sortBy: string
  sortDir: sortDirTypes
  includeRelations: string[]
  from_date: string
  to_date: string
}

type sortDirTypes = 'ASC' | 'DESC'
