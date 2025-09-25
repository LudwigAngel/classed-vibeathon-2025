'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge, Navbar } from 'flowbite-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  role: 'student' | 'teacher' | 'coordinator';
}

export default function DashboardLayout({ children, title, role }: DashboardLayoutProps) {
  const pathname = usePathname();
  
  const roleColors = {
    student: 'purple',
    teacher: 'purple', 
    coordinator: 'purple'
  } as const;

  const roleLabels = {
    student: 'Alumno',
    teacher: 'Profesor', 
    coordinator: 'Coordinador'
  };

  return (
    <div className="min-h-screen bg-gradient-primary-light">
      {/* Header */}
      <Navbar fluid rounded className="bg-gradient-primary border-b border-primary-300 shadow-lg backdrop-blur-sm">
        <Navbar.Brand as={Link} href="/" className="group">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30 group-hover:scale-110 transition-transform duration-300">
                <div className="w-6 h-6 bg-gradient-to-br from-white to-primary-100 rounded-md flex items-center justify-center">
                  <span className="text-xs font-black text-primary-800">S</span>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-300 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tight group-hover:text-primary-100 transition-colors">
                Semillero Digital
              </span>
              <span className="text-xs text-primary-100 font-medium -mt-1">
                Google Classroom Dashboard
              </span>
            </div>
          </div>
        </Navbar.Brand>
        <div className="flex md:order-2 items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-white font-medium">En línea</span>
          </div>
          <Badge color={roleColors[role]} size="sm" className="bg-white/20 text-white border border-white/30 px-3 py-1 font-semibold">
            {roleLabels[role]}
          </Badge>
          <Link href="/" className="text-primary-100 hover:text-white text-sm font-medium transition-colors px-3 py-2 rounded-lg hover:bg-white/10">
            Cambiar rol
          </Link>
        </div>
      </Navbar>

      {/* Navigation Tabs */}
      <nav className="bg-white/90 backdrop-blur-sm border-b border-primary-200">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            <Link 
              href="/student" 
              className={`py-4 px-2 border-b-2 text-sm font-medium transition-colors ${
                pathname === '/student' 
                  ? 'border-primary-600 text-primary-700' 
                  : 'border-transparent text-gray-600 hover:text-primary-600'
              }`}
            >
              Vista Alumno
            </Link>
            <Link 
              href="/teacher" 
              className={`py-4 px-2 border-b-2 text-sm font-medium transition-colors ${
                pathname === '/teacher' 
                  ? 'border-primary-600 text-primary-700' 
                  : 'border-transparent text-gray-600 hover:text-primary-600'
              }`}
            >
              Vista Profesor
            </Link>
            <Link 
              href="/coordinator" 
              className={`py-4 px-2 border-b-2 text-sm font-medium transition-colors ${
                pathname === '/coordinator' 
                  ? 'border-primary-600 text-primary-700' 
                  : 'border-transparent text-gray-600 hover:text-primary-600'
              }`}
            >
              Vista Coordinador
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary-900 dark:text-white">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
}
