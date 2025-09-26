'use client';
import Link from 'next/link';
import { Button } from 'flowbite-react';

export default function Home() {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

  return (
    <div className="min-h-screen bg-gradient-primary-light">
      <main className="container mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-5xl font-bold mb-4 text-primary-900">Semillero Digital</h1>
          <p className="text-xl mb-8 text-primary-700">Dashboard complementario para Google Classroom</p>

          <div className="mb-8">
            <Button 
              as="a" 
              href={`${apiBase}/auth/google`} 
              className="bg-gradient-primary hover:bg-primary-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              size="xl"
            >
              Iniciar sesión con Google
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Button 
              as={Link} 
              href="/student" 
              className="bg-primary-100 hover:bg-primary-200 text-primary-800 border-2 border-primary-300 hover:border-primary-400 px-6 py-3 rounded-lg font-medium transition-all duration-300"
              size="lg"
            >
              Vista Alumno
            </Button>
            <Button 
              as={Link} 
              href="/teacher" 
              className="bg-primary-200 hover:bg-primary-300 text-primary-800 border-2 border-primary-400 hover:border-primary-500 px-6 py-3 rounded-lg font-medium transition-all duration-300"
              size="lg"
            >
              Vista Profesor
            </Button>
            <Button 
              as={Link} 
              href="/coordinator" 
              className="bg-primary-300 hover:bg-primary-400 text-primary-900 border-2 border-primary-500 hover:border-primary-600 px-6 py-3 rounded-lg font-medium transition-all duration-300"
              size="lg"
            >
              Vista Coordinador
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
