import { useState } from 'react'
import { Contact, ContactFormData } from '../types/contact'
import { X, Save, User, Mail, Phone, MapPin, FileText } from 'lucide-react'

interface ContactFormProps {
  contact: Contact | null
  onSubmit: (data: ContactFormData) => void
  onClose: () => void
}

function ContactForm({ contact, onSubmit, onClose }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: contact?.firstName || '',
    lastName: contact?.lastName || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    address: contact?.address || '',
    city: contact?.city || '',
    country: contact?.country || '',
    notes: contact?.notes || '',
  })

  const [errors, setErrors] = useState<Partial<ContactFormData>>({})

  const validate = (): boolean => {
    const newErrors: Partial<ContactFormData> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis'
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis'
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">
            {contact ? 'Modifier le contact' : 'Nouveau contact'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                <User className="h-4 w-4" />
                Prénom *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.firstName ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Jean"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                <User className="h-4 w-4" />
                Nom *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.lastName ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Dupont"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
              <Mail className="h-4 w-4" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                errors.email ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="jean.dupont@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
              <Phone className="h-4 w-4" />
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
              <MapPin className="h-4 w-4" />
              Adresse
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="123 Rue de la Paix"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                <MapPin className="h-4 w-4" />
                Ville
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Paris"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                <MapPin className="h-4 w-4" />
                Pays
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="France"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
              <FileText className="h-4 w-4" />
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
              placeholder="Notes additionnelles..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              {contact ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactForm
