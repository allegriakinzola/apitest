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
      <Toaster position="top-right" />
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
