import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import ProductCatalog from './pages/ProductCatalog'
import ProductDetail from './pages/ProductDetail'
import CategoryList from './pages/admin/CategoryList'
import ProductList from './pages/admin/ProductList'
import CustomerList from './pages/admin/CustomerList'
import OrderList from './pages/admin/OrderList'
import Dashboard from './pages/admin/Dashboard'
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminLogin from './pages/admin/AdminLogin';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';
import OrderHistory from './pages/OrderHistory';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
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
                
                <Route path="/products" element={
                  <>
                    <Header />
                    <main>
                      <ProductCatalog />
                    </main>
                    <Footer />
                  </>
                } />

                <Route path="/products/:slug" element={
                  <>
                    <Header />
                    <main>
                      <ProductDetail />
                    </main>
                    <Footer />
                  </>
                } />
                
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <Cart />
                      <Footer />
                    </>
                  </ProtectedRoute>
                } />
                
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <Checkout />
                      <Footer />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/checkout/success" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <OrderSuccess />
                      <Footer />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/orders/:id" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <OrderTracking />
                      <Footer />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/orders" element={
                  <ProtectedRoute>
                    <>
                      <Header />
                      <OrderHistory />
                      <Footer />
                    </>
                  </ProtectedRoute>
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
                <Route path="/admin/customers" element={
                  <ProtectedRoute requiredRole="admin">
                    <CustomerList />
                  </ProtectedRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedRoute requiredRole="admin">
                    <OrderList />
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App

