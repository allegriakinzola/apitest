export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  country?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  country?: string
  notes?: string
}

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ContactsResponse {
  data: Contact[]
  pagination: PaginationInfo
}
