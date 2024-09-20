import { Button } from '@/components/ui/button'
import { HelpCircle } from 'lucide-react'
import Link from 'next/link'

interface NavbarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-white">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="space-x-4">
          <Link
            href="#"
            className={`text-lg font-semibold ${
              activeTab === 'dashboard'
                ? 'border-b-2 border-primary text-zinc-900'
                : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            Relatório
          </Link>
          <Link
            href="#"
            className={`text-lg font-semibold ${
              activeTab === 'questionarios'
                ? 'border-b-2 border-primary text-zinc-900'
                : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab('questionarios')}
          >
            Questionários
          </Link>
        </div>
        <Button variant="ghost" size="icon" aria-label="Help">
          <HelpCircle className="h-6 w-6" />
        </Button>
      </nav>
    </header>
  )
}

export default Navbar
