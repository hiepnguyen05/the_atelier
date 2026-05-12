import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Home />
      </main>
      <Footer />
    </div>
  )
}

export default App
