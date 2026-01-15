import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Contact, PaginationInfo } from '../types/contact'
import { contactsApi } from '../services/api'
import ContactList from '../components/ContactList'
import SearchBar from '../components/SearchBar'
import Pagination from '../components/Pagination'
import { Users } from 'lucide-react'

function HomePage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const fetchContacts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await contactsApi.getAll({
        search,
        page: pagination.page,
        limit: pagination.limit,
      })
      setContacts(response.data)
      setPagination(response.pagination)
    } catch (error) {
      toast.error('Erreur lors du chargement des contacts')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [search, pagination.page, pagination.limit])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) return
    try {
      await contactsApi.delete(id)
      toast.success('Contact supprimé avec succès')
      fetchContacts()
    } catch (error) {
      toast.error('Erreur lors de la suppression')
      console.error(error)
    }
  }

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Mes Contacts</h1>
        <p className="text-slate-500">
          {pagination.total} contact{pagination.total > 1 ? 's' : ''} au total
        </p>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-16">
          <Users className="mx-auto h-16 w-16 text-slate-300" />
          <h3 className="mt-4 text-lg font-medium text-slate-900">
            Aucun contact trouvé
          </h3>
          <p className="mt-2 text-slate-500">
            {search ? (
              'Essayez une autre recherche'
            ) : (
              <>
                Commencez par{' '}
                <Link to="/contacts/add" className="text-indigo-600 hover:underline">
                  ajouter votre premier contact
                </Link>
              </>
            )}
          </p>
        </div>
      ) : (
        <>
          <ContactList
            contacts={contacts}
            onDelete={handleDelete}
          />
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}

export default HomePage
