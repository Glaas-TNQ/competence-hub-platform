
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';
import { useCourses, useCompetenceAreas, useCreateCourse, useUpdateCourse } from '@/hooks/useSupabase';
import { CourseContentEditor } from './CourseContentEditor';
import { CourseFilters } from './CourseFilters';
import { CourseForm } from './CourseForm';
import { CourseCard } from './CourseCard';
import { toast } from '@/hooks/use-toast';
import { sanitizeText, validateImageUrl, sanitizeUrl } from '@/utils/security';
import { useAdminSecurity } from '@/hooks/useAdminSecurity';
import { useAuth } from '@/contexts/AuthContext';

export const CourseManager = () => {
  const { user, profile } = useAuth();
  const { isAdmin, isLoading: adminLoading, requireAdmin } = useAdminSecurity();
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: competenceAreas } = useCompetenceAreas();
  const createCourseMutation = useCreateCourse();
  const updateCourseMutation = useUpdateCourse();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    competence_area_id: '',
    course_type: '',
    level: '',
    duration: '',
    image_url: '',
    is_published: false,
    requires_payment: false,
    price: 0
  });

  console.log('CourseManager - user:', user?.email);
  console.log('CourseManager - profile role:', profile?.role);
  console.log('CourseManager - isAdmin:', isAdmin);
  console.log('CourseManager - adminLoading:', adminLoading);

  // Show loading while checking admin status
  if (adminLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando privilegi di amministratore...</p>
        </div>
      </div>
    );
  }

  // Security check with better error messaging
  if (!isAdmin) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-destructive mb-4">Accesso Negato</h2>
        <p className="text-muted-foreground mb-4">
          Sono richiesti privilegi di amministratore per accedere alla gestione corsi.
        </p>
        <div className="text-sm text-muted-foreground bg-muted p-4 rounded-lg max-w-md mx-auto">
          <p><strong>Debug Info:</strong></p>
          <p>Email: {user?.email}</p>
          <p>Ruolo profilo: {profile?.role || 'Non definito'}</p>
          <p>Admin rilevato: {isAdmin ? 'Sì' : 'No'}</p>
        </div>
      </div>
    );
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      requireAdmin();
      
      // Validate required fields
      if (!formData.title || !formData.description || !formData.competence_area_id || 
          !formData.course_type || !formData.level || !formData.duration) {
        toast({
          title: "Errore",
          description: "Compila tutti i campi obbligatori",
          variant: "destructive"
        });
        return;
      }

      // Sanitize and validate inputs
      const sanitizedData = {
        ...formData,
        title: sanitizeText(formData.title.trim()),
        description: sanitizeText(formData.description.trim()),
        duration: sanitizeText(formData.duration.trim()),
        image_url: formData.image_url ? sanitizeUrl(formData.image_url) : '',
        price: Math.max(0, formData.price)
      };

      // Validate image URL if provided
      if (sanitizedData.image_url && !validateImageUrl(sanitizedData.image_url)) {
        toast({
          title: "Errore",
          description: "URL immagine non valido",
          variant: "destructive"
        });
        return;
      }

      await createCourseMutation.mutateAsync(sanitizedData);
      toast({
        title: "Successo",
        description: "Corso creato con successo"
      });
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        competence_area_id: '',
        course_type: '',
        level: '',
        duration: '',
        image_url: '',
        is_published: false,
        requires_payment: false,
        price: 0
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore nella creazione del corso",
        variant: "destructive"
      });
    }
  };

  const handleSaveCourseContent = async (courseId: string, content: any) => {
    try {
      requireAdmin();
      
      console.log('Salvando contenuto per corso:', courseId, content);
      
      const result = await updateCourseMutation.mutateAsync({
        id: courseId,
        updates: { content }
      });
      
      console.log('Risultato salvataggio:', result);
      
      toast({
        title: "Successo", 
        description: "Contenuto del corso salvato con successo"
      });
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      toast({
        title: "Errore",
        description: "Errore nel salvataggio del contenuto",
        variant: "destructive"
      });
    }
  };

  const handleTogglePublished = async (courseId: string, currentStatus: boolean) => {
    try {
      requireAdmin();
      
      await updateCourseMutation.mutateAsync({
        id: courseId,
        updates: { is_published: !currentStatus }
      });
      
      toast({
        title: "Successo",
        description: !currentStatus ? "Corso pubblicato con successo" : "Corso rimosso dalla pubblicazione"
      });
    } catch (error) {
      toast({
        title: "Errore",
        description: "Errore nell'aggiornamento dello stato del corso",
        variant: "destructive"
      });
    }
  };

  const getCourseStatus = (course: any) => {
    if (course.is_published) return 'published';
    if (course.content && Object.keys(course.content).length > 0) return 'review';
    return 'draft';
  };

  // Filter courses based on search term and status
  const filteredCourses = courses?.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    
    const courseStatus = getCourseStatus(course);
    return matchesSearch && courseStatus === statusFilter;
  }) || [];

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  if (coursesLoading) {
    return <div>Caricamento corsi...</div>;
  }

  // Se stiamo modificando il contenuto di un corso
  if (editingCourse) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setEditingCourse(null)}
          className="mb-4"
        >
          ← Torna alla lista corsi
        </Button>
        <CourseContentEditor
          courseId={editingCourse.id}
          courseTitle={editingCourse.title}
          initialContent={editingCourse.content}
          onSave={(content) => handleSaveCourseContent(editingCourse.id, content)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestione Corsi</h2>
          <p className="text-slate-600">Crea e gestisci i corsi della piattaforma</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuovo Corso
        </Button>
      </div>

      {/* Filtri */}
      <CourseFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onResetFilters={handleResetFilters}
        filteredCount={filteredCourses.length}
        totalCount={courses?.length || 0}
      />

      {showCreateForm && (
        <CourseForm
          formData={formData}
          setFormData={setFormData}
          competenceAreas={competenceAreas}
          onSubmit={handleCreateCourse}
          onCancel={() => setShowCreateForm(false)}
          isSubmitting={createCourseMutation.isPending}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            competenceAreas={competenceAreas}
            onEdit={setEditingCourse}
            onTogglePublished={handleTogglePublished}
            isUpdating={updateCourseMutation.isPending}
          />
        ))}
      </div>
    </div>
  );
};
