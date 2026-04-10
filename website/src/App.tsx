import Header from './components/Header'
import Hero from './components/Hero'
import Demo from './components/Demo'
import Bento from './components/Bento'
import Footer from './components/Footer'
import DownloadApp from './components/DownloadApp'

export default function App() {
  const path = window.location.pathname

  if (path === '/downloadapp') {
    return <DownloadApp />
  }

  return (
    <div className="min-h-screen bg-[#f4f4f5]">
      <Header />
      <main>
        <Hero />
        <Demo />
        <Bento />
      </main>
      <Footer />
    </div>
  )
}
