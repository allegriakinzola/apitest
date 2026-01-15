import { Contact } from '../types/contact'
import ContactCard from './ContactCard'

interface ContactListProps {
  contacts: Contact[]
  onDelete: (id: string) => void
}

function ContactList({ contacts, onDelete }: ContactListProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {contacts.map((contact) => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onDelete={() => onDelete(contact.id)}
        />
      ))}
    </div>
  )
}

export default ContactList
