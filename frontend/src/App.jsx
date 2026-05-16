import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import CategoryList from './pages/admin/CategoryList'
import ProductList from './pages/admin/ProductList'
import CollectionList from './pages/admin/CollectionList'
import Dashboard from './pages/admin/Dashboard'
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLogin from './pages/admin/AdminLogin';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="app">
          <Routes>
            <Route path="/" element={
              <>
                <Header />
                <main>
                  <Home />
                </main>
                <Footer />
              </>
            } />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Admin Routes - Protected */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <Navigate to="/admin/dashboard" replace />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/categories" element={
              <ProtectedRoute requiredRole="admin">
                <CategoryList />
              </ProtectedRoute>
            } />
            <Route path="/admin/categories/:parentId" element={
              <ProtectedRoute requiredRole="admin">
                <CategoryList />
              </ProtectedRoute>
            } />
            <Route path="/admin/products" element={
              <ProtectedRoute requiredRole="admin">
                <ProductList />
              </ProtectedRoute>
            } />
            <Route path="/admin/collections" element={
              <ProtectedRoute requiredRole="admin">
                <CollectionList />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
