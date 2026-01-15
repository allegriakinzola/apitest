import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Contact, ContactFormData } from '../types/contact'
import { contactsApi } from '../services/api'
import { ArrowLeft, Save, User, Mail, Phone, MapPin, FileText } from 'lucide-react'

function EditContactPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [contact, setContact] = useState<Contact | null>(null)
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    notes: '',
  })
  const [errors, setErrors] = useState<Partial<ContactFormData>>({})

  useEffect(() => {
    const fetchContact = async () => {
      if (!id) return
      try {
        const data = await contactsApi.getById(id)
        setContact(data)
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || '',
          address: data.address || '',
          city: data.city || '',
          country: data.country || '',
          notes: data.notes || '',
        })
      } catch (error) {
        toast.error('Contact non trouvé')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchContact()
  }, [id, navigate])

  const validate = (): boolean => {
    const newErrors: Partial<ContactFormData> = {}
    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis'
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis'
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || !contact) return

    setSaving(true)
    try {
      await contactsApi.update(contact.id, formData)
      toast.success('Contact mis à jour avec succès')
      navigate(`/contacts/${contact.id}`)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      toast.error(err.response?.data?.error || 'Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!contact) return null

  return (
    <div>
      <div className="mb-6">
        <Link
          to={`/contacts/${contact.id}`}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au contact
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Modifier {contact.firstName} {contact.lastName}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <User className="h-4 w-4" />
                Prénom *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.firstName ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <User className="h-4 w-4" />
                Nom *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.lastName ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Mail className="h-4 w-4" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                errors.email ? 'border-red-500' : 'border-slate-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <Phone className="h-4 w-4" />
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <MapPin className="h-4 w-4" />
              Adresse
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <MapPin className="h-4 w-4" />
                Ville
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                <MapPin className="h-4 w-4" />
                Pays
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <FileText className="h-4 w-4" />
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Link
              to={`/contacts/${contact.id}`}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-center"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditContactPage
