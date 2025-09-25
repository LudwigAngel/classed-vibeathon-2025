'use client';
import { useEffect, useState } from 'react';
import { Card, Button, Select, Label, Progress, Spinner, Badge } from 'flowbite-react';
import { HiUsers, HiClipboardList, HiClock, HiExclamationCircle, HiCheckCircle } from 'react-icons/hi';
import DashboardLayout from '../../components/DashboardLayout';

interface Course {
  id: string;
  nombre: string;
  seccion: string | null;
  teacherEmail: string;
  coursework: Array<{
    id: string;
    titulo: string;
    dueAt: string | null;
    maxPoints: number | null;
  }>;
}

interface Student {
  id: string;
  email: string;
  nombre: string;
  role: string;
}

export default function TeacherPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [coursesRes, studentsRes] = await Promise.all([
        fetch(`${apiBase}/courses`),
        fetch(`${apiBase}/users?role=ALUMNO`)
      ]);
      
      const coursesData = await coursesRes.json();
      const studentsData = await studentsRes.json();
      
      setCourses(coursesData);
      setStudents(studentsData);
      if (coursesData.length > 0) {
        setSelectedCourse(coursesData[0].id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedCourseData = courses.find(c => c.id === selectedCourse);

  // Simular métricas de entregas
  const getSubmissionMetrics = (assignmentId: string) => {
    const totalStudents = students.length;
    const onTime = Math.floor(Math.random() * totalStudents * 0.7);
    const late = Math.floor(Math.random() * (totalStudents - onTime) * 0.5);
    const missing = totalStudents - onTime - late;
    
    return {
      total: totalStudents,
      onTime,
      late,
      missing,
      onTimePercentage: totalStudents > 0 ? Math.round((onTime / totalStudents) * 100) : 0,
      latePercentage: totalStudents > 0 ? Math.round((late / totalStudents) * 100) : 0,
      missingPercentage: totalStudents > 0 ? Math.round((missing / totalStudents) * 100) : 0
    };
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sin fecha límite';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <DashboardLayout title="Vista Profesor" role="teacher">
        <div className="flex justify-center items-center h-64">
          <Spinner aria-label="Cargando datos..." size="xl" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Métricas y Seguimiento" role="teacher">
      {/* Course Selector */}
      <div className="mb-6 max-w-md">
        <div className="mb-2 block">
          <Label htmlFor="course-select" value="Seleccionar Curso" />
        </div>
        <Select
          id="course-select"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          required
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.nombre} {course.seccion && `- ${course.seccion}`}
            </option>
          ))}
        </Select>
      </div>

      {selectedCourseData && (
        <>
          {/* Course Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <HiUsers className="w-7 h-7 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-primary-600">Total Alumnos</p>
                  <p className="text-3xl font-bold text-primary-900">{students.length}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-primary-200 rounded-xl">
                  <HiClipboardList className="w-7 h-7 text-primary-700" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-primary-600">Tareas Activas</p>
                  <p className="text-3xl font-bold text-primary-900">{selectedCourseData.coursework?.length || 0}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-primary-300 rounded-xl">
                  <HiClock className="w-7 h-7 text-primary-800" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-primary-600">Promedio Entregas</p>
                  <p className="text-3xl font-bold text-primary-900">73%</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center">
                <div className="p-3 bg-primary-400 rounded-xl">
                  <HiExclamationCircle className="w-7 h-7 text-primary-900" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-primary-600">En Riesgo</p>
                  <p className="text-3xl font-bold text-primary-900">2</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Assignments Metrics */}
          <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-primary-900">Métricas por Tarea</h2>
                <p className="text-primary-600 mt-1">Seguimiento del rendimiento estudiantil</p>
              </div>
              <div className="flex items-center space-x-3">
                <Badge color="purple" className="px-3 py-1">
                  {selectedCourseData.coursework?.length || 0} tareas
                </Badge>
              </div>
            </div>

            {selectedCourseData.coursework?.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-sm border border-primary-200 shadow-lg">
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiClipboardList className="w-10 h-10 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">No hay tareas en este curso</h3>
                  <p className="text-primary-600 mb-4">
                    Crea tu primera tarea para comenzar a hacer seguimiento.
                  </p>
                  <Button className="bg-gradient-primary hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium">
                    Crear Tarea
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid gap-6">
                {selectedCourseData.coursework?.map((assignment, index) => {
                  const metrics = getSubmissionMetrics(assignment.id);
                  const isUrgent = assignment.dueAt ? new Date(assignment.dueAt) <= new Date(Date.now() + 24 * 60 * 60 * 1000) : false;
                  
                  return (
                    <Card 
                      key={assignment.id} 
                      className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${
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
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-bold text-primary-900 group-hover:text-primary-700 transition-colors">
                                {assignment.titulo}
                              </h3>
                              {isUrgent && (
                                <Badge color="red" className="px-2 py-1 text-xs animate-pulse">
                                  ¡Próxima a vencer!
                                </Badge>
                              )}
                            </div>
                            
                            {/* Assignment Info */}
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                              <span className="text-sm text-primary-700">
                                Tarea #{index + 1}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

                          {/* Total Students */}
                          <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <HiUsers className="w-4 h-4 text-primary-600" />
                            </div>
                            <div>
                              <p className="text-xs text-primary-600 font-medium">Estudiantes</p>
                              <p className="text-sm font-bold text-primary-900">
                                {metrics.onTime + metrics.late + metrics.missing}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Progress Section */}
                        <div className="space-y-4 mb-6">
                          <h4 className="text-sm font-semibold text-primary-800">Estado de Entregas</h4>
                          
                          {/* On Time */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm font-medium text-green-700">A tiempo</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-bold text-green-700">{metrics.onTime}</span>
                                <span className="text-xs text-green-600">({metrics.onTimePercentage}%)</span>
                              </div>
                            </div>
                            <Progress progress={metrics.onTimePercentage} color="green" className="h-2" />
                          </div>

                          {/* Late */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <span className="text-sm font-medium text-yellow-700">Atrasadas</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-bold text-yellow-700">{metrics.late}</span>
                                <span className="text-xs text-yellow-600">({metrics.latePercentage}%)</span>
                              </div>
                            </div>
                            <Progress progress={metrics.latePercentage} color="yellow" className="h-2" />
                          </div>

                          {/* Missing */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <span className="text-sm font-medium text-red-700">Faltantes</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-bold text-red-700">{metrics.missing}</span>
                                <span className="text-xs text-red-600">({metrics.missingPercentage}%)</span>
                              </div>
                            </div>
                            <Progress progress={metrics.missingPercentage} color="red" className="h-2" />
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
                              Ver Estudiantes
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-gradient-primary hover:bg-primary-700 text-white border-0 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                              Gestionar Tarea
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
        </>
      )}
    </DashboardLayout>
  );
}
