
import { CourseCard } from '../components/CourseCard';
import { competenceAreas } from '../data/mockData';

export const MyLearning = () => {
  const myCourses = competenceAreas.flatMap(area => 
    area.topics.flatMap(topic => 
      topic.courses.filter(course => course.progress !== undefined)
    )
  );

  const completedCourses = myCourses.filter(course => course.progress === 100);
  const inProgressCourses = myCourses.filter(course => course.progress! > 0 && course.progress! < 100);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">I Miei Corsi</h1>
        <p className="text-slate-600">Monitora i tuoi progressi e continua l'apprendimento</p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-8">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Panoramica Progressi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{inProgressCourses.length}</div>
            <div className="text-slate-600">In Corso</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{completedCourses.length}</div>
            <div className="text-slate-600">Completati</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{myCourses.length}</div>
            <div className="text-slate-600">Totali</div>
          </div>
        </div>
      </div>

      {/* In Progress Courses */}
      {inProgressCourses.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Corsi in Corso</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Courses */}
      {completedCourses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Corsi Completati</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      )}

      {myCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-600 mb-2">Nessun corso iniziato</h3>
          <p className="text-slate-500 mb-6">Inizia il tuo percorso di apprendimento esplorando le nostre aree di competenza</p>
          <button className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-600 transition-all duration-200">
            Esplora Corsi
          </button>
        </div>
      )}
    </div>
  );
};
