# 📚 TUTORIEL COMPLET - Frontend React avec Vite, TailwindCSS et React Router

Ce guide détaillé vous accompagne **étape par étape** pour créer une application React complète qui consomme une API REST.

---

## 📑 TABLE DES MATIÈRES

1. [Installation des outils](#1-installation-des-outils)
2. [Création du projet React avec Vite](#2-création-du-projet-react-avec-vite)
3. [Configuration de TailwindCSS](#3-configuration-de-tailwindcss)
4. [Configuration du service API (Axios)](#4-configuration-du-service-api-axios)
5. [Création des types TypeScript](#5-création-des-types-typescript)
6. [Création des composants](#6-création-des-composants)
7. [Configuration du routage (React Router)](#7-configuration-du-routage-react-router)
8. [Création des pages](#8-création-des-pages)
9. [Test de l'application](#9-test-de-lapplication)
10. [Résumé des commandes](#10-résumé-des-commandes)

---

## 1. INSTALLATION DES OUTILS

### 1.1 Prérequis

Assurez-vous d'avoir installé :
- **Node.js 18+** : https://nodejs.org/
- **Visual Studio Code** : https://code.visualstudio.com/

Extensions VS Code recommandées :
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prettier - Code formatter

### 1.2 Vérifier l'installation

```bash
node --version   # v18.x.x ou supérieur
npm --version    # 9.x.x ou supérieur
```

---

## 2. CRÉATION DU PROJET REACT AVEC VITE

### 2.1 Créer le projet

```bash
# Créer un nouveau projet React avec Vite
npm create vite@latest frontend -- --template react-ts

# Entrer dans le dossier
cd frontend
```

### 2.2 Installer les dépendances

```bash
# Dépendances principales
npm install axios react-router-dom lucide-react react-hot-toast

# Dépendances de développement pour Tailwind
npm install -D tailwindcss postcss autoprefixer
```

### 2.3 Fichier package.json final

```json
{
  "name": "contact-manager-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx"
  },
  "dependencies": {
    "axios": "^1.6.0",
    "lucide-react": "^0.312.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1",
    "react-router-dom": "^6.22.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

### 2.4 Configurer Vite (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
```

**Explication du proxy :**
- Les requêtes vers `/api` sont redirigées vers le backend (port 3001)
- Cela évite les problèmes CORS en développement

---

## 3. CONFIGURATION DE TAILWINDCSS

### 3.1 Initialiser Tailwind

```bash
npx tailwindcss init -p
```

Cela crée `tailwind.config.js` et `postcss.config.js`.

### 3.2 Configurer tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3.3 Ajouter les directives Tailwind dans src/index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Styles personnalisés optionnels */
body {
  font-family: 'Inter', system-ui, sans-serif;
}
```

---

## 4. CONFIGURATION DU SERVICE API (AXIOS)

### 4.1 Créer le fichier src/services/api.ts

```typescript
import axios from 'axios'
import { Contact, ContactFormData, ContactsResponse } from '../types/contact'

// Créer une instance axios configurée
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interface pour les paramètres de recherche
interface GetAllParams {
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// Service API pour les contacts
export const contactsApi = {
  // GET /api/contacts - Récupérer tous les contacts
  getAll: async (params: GetAllParams = {}): Promise<ContactsResponse> => {
    const response = await api.get('/contacts', { params })
    return response.data
  },

  // GET /api/contacts/:id - Récupérer un contact par ID
  getById: async (id: string): Promise<Contact> => {
    const response = await api.get(`/contacts/${id}`)
    return response.data
  },

  // POST /api/contacts - Créer un nouveau contact
  create: async (data: ContactFormData): Promise<Contact> => {
    const response = await api.post('/contacts', data)
    return response.data
  },

  // PUT /api/contacts/:id - Mettre à jour un contact
  update: async (id: string, data: Partial<ContactFormData>): Promise<Contact> => {
    const response = await api.put(`/contacts/${id}`, data)
    return response.data
  },

  // DELETE /api/contacts/:id - Supprimer un contact
  delete: async (id: string): Promise<void> => {
    await api.delete(`/contacts/${id}`)
  },
}
```

**Explication :**
- `axios.create()` crée une instance réutilisable avec une configuration de base
- Chaque méthode correspond à une opération CRUD
- Les types TypeScript assurent la cohérence des données

---

## 5. CRÉATION DES TYPES TYPESCRIPT

### 5.1 Créer le fichier src/types/contact.ts

```typescript
// Type pour un contact complet (venant de l'API)
export interface Contact {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  address: string | null
  city: string | null
  country: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

// Type pour les données du formulaire (envoyées à l'API)
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

// Type pour les informations de pagination
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Type pour la réponse de l'API (liste)
export interface ContactsResponse {
  data: Contact[]
  pagination: PaginationInfo
}
```

**Pourquoi TypeScript ?**
- Détection des erreurs à la compilation
- Autocomplétion dans l'éditeur
- Documentation automatique du code

---

## 6. CRÉATION DES COMPOSANTS

### 6.1 Structure des composants

```
src/
├── components/
│   ├── Layout.tsx         # Navigation et structure
│   ├── ContactCard.tsx    # Carte d'un contact
│   ├── ContactList.tsx    # Grille de contacts
│   ├── SearchBar.tsx      # Barre de recherche
│   └── Pagination.tsx     # Navigation pages
└── pages/
    ├── HomePage.tsx           # Liste des contacts
    ├── ContactDetailPage.tsx  # Détail d'un contact
    ├── AddContactPage.tsx     # Formulaire création
    └── EditContactPage.tsx    # Formulaire modification
```

### 6.2 Composant Layout (src/components/Layout.tsx)

```tsx
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Users, Plus, Home } from 'lucide-react'

function Layout() {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                Gestionnaire de Contacts
              </span>
            </Link>

            {/* Liens de navigation */}
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isActive('/') 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Home className="h-4 w-4" />
                Accueil
              </Link>
              <Link
                to="/contacts/add"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Nouveau Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu de la page (rendu par React Router) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
```

**Explication :**
- `<Outlet />` affiche le contenu de la route enfant
- `useLocation()` permet de connaître l'URL actuelle
- Les classes Tailwind gèrent le style

### 6.3 Composant SearchBar (src/components/SearchBar.tsx)

```tsx
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher un contact..."
        className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
        </button>
      )}
    </div>
  )
}

export default SearchBar
```

### 6.4 Composant ContactCard (src/components/ContactCard.tsx)

```tsx
import { Link } from 'react-router-dom'
import { Contact } from '../types/contact'
import { Mail, Phone, MapPin, Edit2, Trash2, Eye } from 'lucide-react'

interface ContactCardProps {
  contact: Contact
  onDelete: () => void
}

function ContactCard({ contact, onDelete }: ContactCardProps) {
  // Créer les initiales (ex: JD pour Jean Dupont)
  const initials = `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
      {/* En-tête avec avatar et nom */}
      <div className="flex items-start justify-between mb-4">
        <Link to={`/contacts/${contact.id}`} className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600">
              {contact.firstName} {contact.lastName}
            </h3>
            <p className="text-sm text-slate-500">{contact.city || 'Contact'}</p>
          </div>
        </Link>
        
        {/* Boutons d'action */}
        <div className="flex gap-1">
          <Link
            to={`/contacts/${contact.id}`}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
            title="Voir"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to={`/contacts/${contact.id}/edit`}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
            title="Modifier"
          >
            <Edit2 className="h-4 w-4" />
          </Link>
          <button
            onClick={onDelete}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Informations de contact */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-slate-600">
          <Mail className="h-4 w-4 text-slate-400" />
          {contact.email}
        </div>
        {contact.phone && (
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="h-4 w-4 text-slate-400" />
            {contact.phone}
          </div>
        )}
        {contact.city && (
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400" />
            {[contact.city, contact.country].filter(Boolean).join(', ')}
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactCard
```

### 6.5 Composant ContactList (src/components/ContactList.tsx)

```tsx
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
```

### 6.6 Composant Pagination (src/components/Pagination.tsx)

```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PaginationInfo } from '../types/contact'

interface PaginationProps {
  pagination: PaginationInfo
  onPageChange: (page: number) => void
}

function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages } = pagination

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Bouton précédent */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="p-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Numéros de page */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <button
          key={pageNum}
          onClick={() => onPageChange(pageNum)}
          className={`px-4 py-2 rounded-lg ${
            pageNum === page
              ? 'bg-indigo-600 text-white'
              : 'border border-slate-300 hover:bg-slate-50'
          }`}
        >
          {pageNum}
        </button>
      ))}

      {/* Bouton suivant */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="p-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}

export default Pagination
```

---

## 7. CONFIGURATION DU ROUTAGE (REACT ROUTER)

### 7.1 Modifier src/App.tsx

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ContactDetailPage from './pages/ContactDetailPage'
import AddContactPage from './pages/AddContactPage'
import EditContactPage from './pages/EditContactPage'

function App() {
  return (
    <BrowserRouter>
      {/* Notifications toast */}
      <Toaster position="top-right" />
      
      {/* Définition des routes */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="contacts/add" element={<AddContactPage />} />
          <Route path="contacts/:id" element={<ContactDetailPage />} />
          <Route path="contacts/:id/edit" element={<EditContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

**Explication des routes :**
- `/` → Page d'accueil (liste des contacts)
- `/contacts/add` → Formulaire d'ajout
- `/contacts/:id` → Détail d'un contact (`:id` est un paramètre dynamique)
- `/contacts/:id/edit` → Formulaire de modification

### 7.2 Modifier src/main.tsx

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

---

## 8. CRÉATION DES PAGES

### 8.1 Page d'accueil (src/pages/HomePage.tsx)

```tsx
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
  // États
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  // Fonction pour charger les contacts
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
    } finally {
      setLoading(false)
    }
  }, [search, pagination.page, pagination.limit])

  // Charger les contacts au montage et quand les filtres changent
  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  // Supprimer un contact
  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) return
    try {
      await contactsApi.delete(id)
      toast.success('Contact supprimé')
      fetchContacts()
    } catch (error) {
      toast.error('Erreur lors de la suppression')
    }
  }

  // Changer de page
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
  }

  return (
    <div>
      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Mes Contacts</h1>
        <p className="text-slate-500">
          {pagination.total} contact{pagination.total > 1 ? 's' : ''}
        </p>
      </div>

      {/* Barre de recherche */}
      <SearchBar value={search} onChange={setSearch} />

      {/* Contenu */}
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
            <Link to="/contacts/add" className="text-indigo-600 hover:underline">
              Ajouter votre premier contact
            </Link>
          </p>
        </div>
      ) : (
        <>
          <ContactList contacts={contacts} onDelete={handleDelete} />
          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  )
}

export default HomePage
```

### 8.2 Page d'ajout (src/pages/AddContactPage.tsx)

```tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { ContactFormData } from '../types/contact'
import { contactsApi } from '../services/api'
import { ArrowLeft, Save, User, Mail, Phone, MapPin } from 'lucide-react'

function AddContactPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
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

  // Validation du formulaire
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

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const contact = await contactsApi.create(formData)
      toast.success('Contact créé avec succès')
      navigate(`/contacts/${contact.id}`)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } }
      toast.error(err.response?.data?.error || 'Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  // Mise à jour des champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <div>
      {/* Lien retour */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux contacts
        </Link>
      </div>

      {/* Formulaire */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Nouveau Contact</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Prénom et Nom */}
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.firstName ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Jean"
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                  errors.lastName ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Dupont"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
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
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="jean.dupont@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Téléphone */}
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
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          {/* Ville et Pays */}
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="Paris"
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                placeholder="France"
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-4 pt-4">
            <Link
              to="/"
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-center"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Création...' : 'Créer le contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddContactPage
```

---

## 9. TEST DE L'APPLICATION

### 9.1 Démarrer le backend

```bash
cd backend
npm run dev
```

Le backend tourne sur http://localhost:3001

### 9.2 Démarrer le frontend

```bash
cd frontend
npm run dev
```

Le frontend tourne sur http://localhost:3000

### 9.3 Tester les fonctionnalités

1. **Voir la liste** : Ouvrir http://localhost:3000
2. **Ajouter un contact** : Cliquer sur "Nouveau Contact"
3. **Voir les détails** : Cliquer sur un contact
4. **Modifier** : Cliquer sur l'icône crayon
5. **Supprimer** : Cliquer sur l'icône poubelle
6. **Rechercher** : Taper dans la barre de recherche

---

## 10. RÉSUMÉ DES COMMANDES

### Commandes de développement

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarrer le serveur (port 3000) |
| `npm run build` | Compiler pour la production |
| `npm run preview` | Prévisualiser le build |

### Structure finale du projet

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── ContactCard.tsx
│   │   ├── ContactList.tsx
│   │   ├── SearchBar.tsx
│   │   └── Pagination.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ContactDetailPage.tsx
│   │   ├── AddContactPage.tsx
│   │   └── EditContactPage.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── contact.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── tsconfig.json
```

---

## 📝 AIDE-MÉMOIRE REACT

### Hooks essentiels

```tsx
// État local
const [value, setValue] = useState(initialValue)

// Effet (exécuté après le rendu)
useEffect(() => {
  // Code à exécuter
  return () => { /* cleanup */ }
}, [dependencies])

// Callback mémorisé
const memoizedFn = useCallback(() => {
  // Code
}, [dependencies])

// Navigation
const navigate = useNavigate()
navigate('/path')

// Paramètres d'URL
const { id } = useParams()
```

### Syntaxe JSX courante

```tsx
// Condition
{condition && <Component />}
{condition ? <A /> : <B />}

// Liste
{items.map((item) => <Item key={item.id} {...item} />)}

// Classes conditionnelles
className={`base ${condition ? 'active' : ''}`}

// Événements
onClick={handleClick}
onChange={(e) => setValue(e.target.value)}
onSubmit={handleSubmit}
```

---

**Bonne chance pour votre test ! 🚀**
#   a p i t e s t  
 