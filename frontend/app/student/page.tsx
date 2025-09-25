'use client';
import { useEffect, useState } from 'react';
import { Card, Badge, Button, Spinner } from 'flowbite-react';
import { HiClock, HiCheckCircle, HiExclamationCircle, HiClipboardList } from 'react-icons/hi';
import DashboardLayout from '../../components/DashboardLayout';

interface Assignment {
  id: string;
  titulo: string;
  dueAt: string | null;
  maxPoints: number | null;
  course: {
    nombre: string;
  };
  submissions: Array<{
    estado: 'ENTREGADO' | 'ATRASADO' | 'FALTANTE' | 'REENTREGA';
    turnedInAt: string | null;
    score: number | null;
  }>;
}

export default function StudentPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch(`${apiBase}/courses`);
      const courses = await response.json();
      
      // Simular asignaciones para el alumno demo
      const mockAssignments: Assignment[] = courses.flatMap((course: any) => 
        course.coursework?.map((cw: any) => ({
          id: cw.id,
          titulo: cw.titulo,
          dueAt: cw.dueAt,
          maxPoints: cw.maxPoints,
          course: { nombre: course.nombre },
          submissions: [{
            estado: 'FALTANTE' as const,
            turnedInAt: null,
            score: null
          }]
        })) || []
      );
      
      setAssignments(mockAssignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case 'ENTREGADO': return 'green';
      case 'ATRASADO': return 'red';
      case 'FALTANTE': return 'yellow';
      case 'REENTREGA': return 'orange';
      default: return 'gray';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'ENTREGADO': return 'Entregado';
      case 'ATRASADO': return 'Atrasado';
      case 'FALTANTE': return 'Pendiente';
      case 'REENTREGA': return 'Reentrega';
      default: return estado;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sin fecha límite';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <DashboardLayout title="Vista Alumno" role="student">
        <div className="flex justify-center items-center h-64">
          <Spinner aria-label="Cargando datos..." size="xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Mis Tareas y Entregas" role="student">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <Card className="bg-white/80 backdrop-blur-sm border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-xl">
              <HiClock className="w-7 h-7 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-primary-600">Tareas Pendientes</p>
              <p className="text-3xl font-bold text-primary-900">
                {assignments.filter(a => a.submissions[0]?.estado === 'FALTANTE').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-primary-200 rounded-xl">
              <HiCheckCircle className="w-7 h-7 text-primary-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-primary-600">Entregadas</p>
              <p className="text-3xl font-bold text-primary-900">
                {assignments.filter(a => a.submissions[0]?.estado === 'ENTREGADO').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-primary-300 rounded-xl">
              <HiExclamationCircle className="w-7 h-7 text-primary-800" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-primary-600">Atrasadas</p>
              <p className="text-3xl font-bold text-primary-900">
                {assignments.filter(a => a.submissions[0]?.estado === 'ATRASADO').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Assignments Section */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary-900">Próximas Tareas</h2>
            <p className="text-primary-600 mt-1">Organiza tu tiempo y mantente al día</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge color="purple" className="px-3 py-1">
              {assignments.length} tareas
            </Badge>
          </div>
        </div>

        {assignments.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border border-primary-200 shadow-lg">
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiClipboardList className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">No hay tareas disponibles</h3>
              <p className="text-primary-600 mb-4">
                Conecta tu cuenta de Google Classroom para ver tus tareas.
              </p>
              <Button className="bg-gradient-primary hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium">
                Conectar Google Classroom
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {assignments.map((assignment, index) => {
              const estado = assignment.submissions[0]?.estado || 'FALTANTE';
              const isUrgent = assignment.dueAt ? new Date(assignment.dueAt) <= new Date(Date.now() + 24 * 60 * 60 * 1000) : false; // Próximas 24 horas
              
              return (
                <Card 
                  key={assignment.id} 
                  className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                    isUrgent 
                      ? 'bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-l-red-400' 
                      : 'bg-white/90 backdrop-blur-sm border border-primary-200'
                  }`}
                >
                  {/* Priority Indicator */}
                  {isUrgent && (
                    <div className="absolute top-4 right-4">
                      <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-primary-900 group-hover:text-primary-700 transition-colors">
                            {assignment.titulo}
                          </h3>
                          <Badge 
                            color={getBadgeColor(estado)} 
                            className="px-3 py-1 text-xs font-semibold"
                          >
                            {getStatusText(estado)}
                          </Badge>
                          {isUrgent && (
                            <Badge color="red" className="px-2 py-1 text-xs animate-pulse">
                              ¡Urgente!
                            </Badge>
                          )}
                        </div>
                        
                        {/* Course Info */}
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                          <span className="text-sm font-semibold text-primary-700">
                            {assignment.course.nombre}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Due Date */}
                      <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <HiClock className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-xs text-primary-600 font-medium">Fecha límite</p>
                          <p className="text-sm font-bold text-primary-900">
                            {assignment.dueAt ? formatDate(assignment.dueAt) : 'Sin fecha límite'}
                          </p>
                        </div>
                      </div>

                      {/* Points */}
                      {assignment.maxPoints && (
                        <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <HiCheckCircle className="w-4 h-4 text-primary-600" />
                          </div>
                          <div>
                            <p className="text-xs text-primary-600 font-medium">Puntos</p>
                            <p className="text-sm font-bold text-primary-900">
                              {assignment.maxPoints} pts
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Time Remaining */}
                      <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <HiExclamationCircle className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-xs text-primary-600 font-medium">Tiempo restante</p>
                          <p className={`text-sm font-bold ${
                            isUrgent ? 'text-red-600' : 'text-primary-900'
                          }`}>
                            {isUrgent ? 'Menos de 24h' : 'Más de 1 día'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-primary-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-primary-800">
                            {index + 1}
                          </span>
                        </div>
                        <span className="text-sm text-primary-600">
                          Tarea #{index + 1}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Button 
                          size="sm"
                          className="bg-primary-100 hover:bg-primary-200 text-primary-800 border-0 px-4 py-2 rounded-lg font-medium transition-all duration-300"
                        >
                          Ver Detalles
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-gradient-primary hover:bg-primary-700 text-white border-0 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          Abrir en Classroom
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
