import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Contact } from '../types/contact'
import { contactsApi } from '../services/api'
import { ArrowLeft, Edit2, Trash2, Mail, Phone, MapPin, FileText, Calendar } from 'lucide-react'

function ContactDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [contact, setContact] = useState<Contact | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContact = async () => {
      if (!id) return
      try {
        const data = await contactsApi.getById(id)
        setContact(data)
      } catch (error) {
        toast.error('Contact non trouvé')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchContact()
  }, [id, navigate])

  const handleDelete = async () => {
    if (!contact) return
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) return
    try {
      await contactsApi.delete(contact.id)
      toast.success('Contact supprimé avec succès')
      navigate('/')
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!contact) {
    return null
  }

  const initials = `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase()
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux contacts
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-12">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-3xl">
              {initials}
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">
                {contact.firstName} {contact.lastName}
              </h1>
              <p className="text-white/80 mt-1">{contact.email}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="flex justify-end gap-3 mb-8">
            <Link
              to={`/contacts/${contact.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              Modifier
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-slate-900 border-b pb-2">
                Informations de contact
              </h2>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Mail className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-indigo-600 hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>

              {contact.phone && (
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Téléphone</p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-slate-900 hover:text-indigo-600"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {(contact.address || contact.city || contact.country) && (
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Adresse</p>
                    <p className="text-slate-900">
                      {contact.address && <span>{contact.address}<br /></span>}
                      {[contact.city, contact.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {contact.notes && (
                <>
                  <h2 className="text-lg font-semibold text-slate-900 border-b pb-2">
                    Notes
                  </h2>
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-slate-700 whitespace-pre-wrap">{contact.notes}</p>
                  </div>
                </>
              )}

              <h2 className="text-lg font-semibold text-slate-900 border-b pb-2">
                Dates
              </h2>
              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-slate-600" />
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-slate-500">Créé le</p>
                    <p className="text-slate-900">{formatDate(contact.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Modifié le</p>
                    <p className="text-slate-900">{formatDate(contact.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactDetailPage
