import { Link } from 'react-router-dom'
import { Contact } from '../types/contact'
import { Mail, Phone, MapPin, Edit2, Trash2, Eye } from 'lucide-react'

interface ContactCardProps {
  contact: Contact
  onDelete: () => void
}

function ContactCard({ contact, onDelete }: ContactCardProps) {
  const initials = `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <Link to={`/contacts/${contact.id}`} className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {contact.firstName} {contact.lastName}
            </h3>
            <p className="text-sm text-slate-500">
              {contact.city || 'Contact'}
            </p>
          </div>
        </Link>
        <div className="flex gap-1">
          <Link
            to={`/contacts/${contact.id}`}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Voir"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to={`/contacts/${contact.id}/edit`}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Modifier"
          >
            <Edit2 className="h-4 w-4" />
          </Link>
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <a
            href={`mailto:${contact.email}`}
            className="text-indigo-600 hover:underline truncate"
          >
            {contact.email}
          </a>
        </div>

        {contact.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <a
              href={`tel:${contact.phone}`}
              className="text-slate-600 hover:text-indigo-600"
            >
              {contact.phone}
            </a>
          </div>
        )}

        {(contact.city || contact.country) && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <span className="text-slate-600">
              {[contact.city, contact.country].filter(Boolean).join(', ')}
            </span>
          </div>
        )}
      </div>

      {contact.notes && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-500 line-clamp-2">{contact.notes}</p>
        </div>
      )}
    </div>
  )
}

export default ContactCard
