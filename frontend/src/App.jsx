import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import CategoryList from './pages/admin/CategoryList'
import ProductList from './pages/admin/ProductList'

function App() {
  return (
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
          
          {/* Admin Routes */}
          <Route path="/admin/categories" element={<CategoryList />} />
          <Route path="/admin/categories/:parentId" element={<CategoryList />} />
          <Route path="/admin/products" element={<ProductList />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
