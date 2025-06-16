import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Eye, FileText, Euro, Lock, AlertCircle, Check, X } from 'lucide-react';
import { useCourses, useCompetenceAreas, useCreateCourse, useUpdateCourse } from '@/hooks/useSupabase';
import { CourseContentEditor } from './CourseContentEditor';
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

  const getCompetenceAreaName = (course: any) => {
    if (!course.competence_area_id || !competenceAreas) return 'N/A';
    const area = competenceAreas.find(area => area.id === course.competence_area_id);
    return area?.name || 'N/A';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-800';
      case 'text': return 'bg-blue-100 text-blue-800';
      case 'arcade': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Principiante': return 'bg-green-100 text-green-800';
      case 'Intermedio': return 'bg-yellow-100 text-yellow-800';
      case 'Avanzato': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (course: any) => {
    if (course.is_published) {
      return <Badge className="bg-green-100 text-green-800">Pubblicato</Badge>;
    } else if (course.content && Object.keys(course.content).length > 0) {
      return <Badge className="bg-yellow-100 text-yellow-800">In Revisione</Badge>;
    } else {
      return <Badge variant="secondary">Bozza</Badge>;
    }
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

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Crea Nuovo Corso</CardTitle>
            <CardDescription>Inserisci i dettagli del nuovo corso</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titolo *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Titolo del corso"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Durata *</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="es. 2 ore"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrizione *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrizione del corso"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Area di Competenza *</Label>
                  <Select value={formData.competence_area_id} onValueChange={(value) => setFormData(prev => ({ ...prev, competence_area_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona area" />
                    </SelectTrigger>
                    <SelectContent>
                      {competenceAreas?.map((area) => (
                        <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo Corso *</Label>
                  <Select value={formData.course_type} onValueChange={(value) => setFormData(prev => ({ ...prev, course_type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Testuale</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="arcade">Arcade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Livello *</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona livello" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Principiante">Principiante</SelectItem>
                      <SelectItem value="Intermedio">Intermedio</SelectItem>
                      <SelectItem value="Avanzato">Avanzato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL Immagine</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="requires_payment"
                    checked={formData.requires_payment}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requires_payment: checked }))}
                  />
                  <Label htmlFor="requires_payment">Corso a pagamento</Label>
                </div>
                
                {formData.requires_payment && (
                  <div className="space-y-2">
                    <Label htmlFor="price">Prezzo (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
                />
                <Label htmlFor="published">Pubblica immediatamente</Label>
              </div>

              <div className="flex space-x-2">
                <Button type="submit" disabled={createCourseMutation.isPending}>
                  {createCourseMutation.isPending ? 'Creazione...' : 'Crea Corso'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                  Annulla
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses?.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription className="mt-2">{course.description}</CardDescription>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingCourse(course)}
                    title="Modifica contenuti"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge className={getTypeColor(course.course_type)}>
                  {course.course_type}
                </Badge>
                <Badge className={getLevelColor(course.level)}>
                  {course.level}
                </Badge>
                {getStatusBadge(course)}
                {course.requires_payment && (
                  <Badge className="bg-purple-100 text-purple-800">
                    <Lock className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <div className="text-sm text-slate-600">
                <p>Durata: {course.duration}</p>
                <p>Area: {getCompetenceAreaName(course)}</p>
                {course.requires_payment && course.price > 0 && (
                  <p className="flex items-center gap-1 text-purple-600 font-medium">
                    <Euro className="h-3 w-3" />
                    {course.price}
                  </p>
                )}
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <Button
                  variant={course.is_published ? "destructive" : "default"}
                  size="sm"
                  onClick={() => handleTogglePublished(course.id, course.is_published)}
                  disabled={updateCourseMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {course.is_published ? (
                    <>
                      <X className="h-4 w-4" />
                      Sospendi
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Pubblica
                    </>
                  )}
                </Button>
                <div className="text-xs text-muted-foreground">
                  {course.content && Object.keys(course.content).length > 0 
                    ? `${Object.keys(course.content).length} capitoli` 
                    : 'Nessun contenuto'
                  }
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
