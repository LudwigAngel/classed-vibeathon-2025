'use client';
import { useEffect, useState } from 'react';
import { Card, Badge, Button, Spinner } from 'flowbite-react';
import { HiUsers, HiAcademicCap, HiTrendingUp, HiExclamationCircle, HiClipboardList } from 'react-icons/hi';
import DashboardLayout from '../../components/DashboardLayout';

interface GlobalMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalAssignments: number;
  averageSubmissionRate: number;
  studentsAtRisk: number;
  onTimeSubmissions: number;
  lateSubmissions: number;
  missingSubmissions: number;
}

interface CourseMetrics {
  id: string;
  nombre: string;
  teacherEmail: string;
  studentCount: number;
  assignmentCount: number;
  submissionRate: number;
}

export default function CoordinatorPage() {
  const [metrics, setMetrics] = useState<GlobalMetrics | null>(null);
  const [courseMetrics, setCourseMetrics] = useState<CourseMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';

  useEffect(() => {
    fetchGlobalMetrics();
  }, []);

  const fetchGlobalMetrics = async () => {
    try {
      const [coursesRes, studentsRes, teachersRes] = await Promise.all([
        fetch(`${apiBase}/courses`),
        fetch(`${apiBase}/users?role=ALUMNO`),
        fetch(`${apiBase}/users?role=PROFESOR`)
      ]);
      
      const courses = await coursesRes.json();
      const students = await studentsRes.json();
      const teachers = await teachersRes.json();
      
      // Calcular métricas globales
      const totalAssignments = courses.reduce((sum: number, course: any) => 
        sum + (course.coursework?.length || 0), 0
      );
      
      // Simular métricas de entregas
      const totalSubmissions = totalAssignments * students.length;
      const onTimeSubmissions = Math.floor(totalSubmissions * 0.65);
      const lateSubmissions = Math.floor(totalSubmissions * 0.20);
      const missingSubmissions = totalSubmissions - onTimeSubmissions - lateSubmissions;
      
      const globalMetrics: GlobalMetrics = {
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalCourses: courses.length,
        totalAssignments,
        averageSubmissionRate: totalSubmissions > 0 ? Math.round(((onTimeSubmissions + lateSubmissions) / totalSubmissions) * 100) : 0,
        studentsAtRisk: Math.floor(students.length * 0.15),
        onTimeSubmissions,
        lateSubmissions,
        missingSubmissions
      };
      
      // Métricas por curso
      const courseMetricsData: CourseMetrics[] = courses.map((course: any) => ({
        id: course.id,
        nombre: course.nombre,
        teacherEmail: course.teacherEmail,
        studentCount: Math.floor(Math.random() * 12) + 8, // Simular 8-20 estudiantes
        assignmentCount: course.coursework?.length || 0,
        submissionRate: Math.floor(Math.random() * 30) + 70 // Simular 70-100%
      }));
      
      setMetrics(globalMetrics);
      setCourseMetrics(courseMetricsData);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (rate: number) => {
    if (rate >= 90) return { color: 'text-green-600', bg: 'bg-green-100', label: 'Excelente' };
    if (rate >= 80) return { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Bueno' };
    if (rate >= 70) return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Regular' };
    return { color: 'text-red-600', bg: 'bg-red-100', label: 'En Riesgo' };
  };

  if (loading) {
    return (
      <DashboardLayout title="Vista Coordinador" role="coordinator">
        <div className="flex justify-center items-center h-64">
          <Spinner aria-label="Cargando métricas..." size="xl" />
        </div>
      </DashboardLayout>
    );
  }

  if (!metrics) {
    return (
      <DashboardLayout title="Vista Coordinador" role="coordinator">
        <div className="text-center py-8">
          <p className="text-gray-500">Error al cargar las métricas.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard Global" role="coordinator">
      {/* Global Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white/80 backdrop-blur-sm border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-xl">
              <HiUsers className="w-7 h-7 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-primary-600">Total Estudiantes</p>
              <p className="text-3xl font-bold text-primary-900">{metrics.totalStudents}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-primary-200 rounded-xl">
              <HiAcademicCap className="w-7 h-7 text-primary-700" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-primary-600">Cursos Activos</p>
              <p className="text-3xl font-bold text-primary-900">{metrics.totalCourses}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-primary-300 rounded-xl">
              <HiTrendingUp className="w-7 h-7 text-primary-800" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-primary-600">Tasa de Entrega</p>
              <p className="text-3xl font-bold text-primary-900">{metrics.averageSubmissionRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-primary-400 rounded-xl">
              <HiExclamationCircle className="w-7 h-7 text-primary-900" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-primary-600">Estudiantes en Riesgo</p>
              <p className="text-3xl font-bold text-primary-900">{metrics.studentsAtRisk}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Submission Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Distribución de Entregas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">A tiempo</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{metrics.onTimeSubmissions}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Atrasadas</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{metrics.lateSubmissions}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Faltantes</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{metrics.missingSubmissions}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Resumen Semanal</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Nuevas tareas creadas</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Entregas completadas</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">89</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Estudiantes activos</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{metrics.totalStudents - 2}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Promedio de calificaciones</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">8.4/10</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Course Performance */}
      <div className="space-y-6">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-primary-900">Rendimiento por Curso</h2>
            <p className="text-primary-600 mt-1">Análisis detallado del desempeño académico</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge color="purple" className="px-3 py-1">
              {courseMetrics.length} cursos
            </Badge>
          </div>
        </div>

        {courseMetrics.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border border-primary-200 shadow-lg">
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiAcademicCap className="w-10 h-10 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-primary-900 mb-2">No hay cursos disponibles</h3>
              <p className="text-primary-600 mb-4">
                Los datos de los cursos aparecerán aquí una vez conectados.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {courseMetrics.map((course, index) => {
              const risk = getRiskLevel(course.submissionRate);
              const badgeColor = risk.label === 'Excelente' ? 'green' : 
                                risk.label === 'Bueno' ? 'blue' : 
                                risk.label === 'Regular' ? 'yellow' : 'red';
              const isAtRisk = course.submissionRate < 70;
              
              return (
                <Card 
                  key={course.id} 
                  className={`group relative overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${
                    isAtRisk 
                      ? 'bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-l-red-400' 
                      : 'bg-white/90 backdrop-blur-sm border border-primary-200'
                  }`}
                >
                  {/* Risk Indicator */}
                  {isAtRisk && (
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
                            {course.nombre}
                          </h3>
                          <Badge color={badgeColor} className="px-3 py-1 text-xs font-semibold">
                            {risk.label}
                          </Badge>
                          {isAtRisk && (
                            <Badge color="red" className="px-2 py-1 text-xs animate-pulse">
                              ¡Requiere atención!
                            </Badge>
                          )}
                        </div>
                        
                        {/* Course Info */}
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="w-2 h-2 bg-primary-400 rounded-full"></div>
                          <span className="text-sm font-semibold text-primary-700">
                            Curso #{index + 1}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      {/* Students */}
                      <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <HiUsers className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-xs text-primary-600 font-medium">Estudiantes</p>
                          <p className="text-sm font-bold text-primary-900">
                            {course.studentCount}
                          </p>
                        </div>
                      </div>

                      {/* Assignments */}
                      <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <HiClipboardList className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-xs text-primary-600 font-medium">Tareas</p>
                          <p className="text-sm font-bold text-primary-900">
                            {course.assignmentCount}
                          </p>
                        </div>
                      </div>

                      {/* Submission Rate */}
                      <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <HiTrendingUp className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-xs text-primary-600 font-medium">Tasa de entrega</p>
                          <p className={`text-sm font-bold ${
                            isAtRisk ? 'text-red-600' : 'text-primary-900'
                          }`}>
                            {course.submissionRate}%
                          </p>
                        </div>
                      </div>

                      {/* Teacher */}
                      <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <HiAcademicCap className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-xs text-primary-600 font-medium">Profesor</p>
                          <p className="text-xs font-bold text-primary-900 truncate">
                            {course.teacherEmail.split('@')[0]}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Performance Bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-primary-800">Rendimiento General</span>
                        <span className={`text-sm font-bold ${
                          isAtRisk ? 'text-red-600' : 'text-primary-900'
                        }`}>
                          {course.submissionRate}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            course.submissionRate >= 90 ? 'bg-green-500' :
                            course.submissionRate >= 70 ? 'bg-blue-500' :
                            course.submissionRate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${course.submissionRate}%` }}
                        ></div>
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
                          Curso #{index + 1}
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
                          Analizar Curso
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
