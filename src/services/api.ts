import axios from 'axios'
import { Contact, ContactFormData, ContactsResponse } from '../types/contact'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const contactsApi = {
  getAll: async (params?: {
    search?: string
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: string
  }): Promise<ContactsResponse> => {
    const response = await api.get('/api/contacts', { params })
    return response.data
  },

  getById: async (id: string): Promise<Contact> => {
    const response = await api.get(`/api/contacts/${id}`)
    return response.data
  },

  create: async (data: ContactFormData): Promise<Contact> => {
    const response = await api.post('/api/contacts', data)
    return response.data
  },

  update: async (id: string, data: Partial<ContactFormData>): Promise<Contact> => {
    const response = await api.put(`/api/contacts/${id}`, data)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/contacts/${id}`)
  },
}
