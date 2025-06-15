
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  Clock,
  Users,
  GraduationCap
} from 'lucide-react';
import { useLearningPaths, useCreateLearningPath, useUpdateLearningPath } from '@/hooks/useLearningPaths';
import { useCourses } from '@/hooks/useSupabase';
import { useAuth } from '@/contexts/AuthContext';

export const LearningPathManager = () => {
  const { user } = useAuth();
  const { data: learningPaths, isLoading } = useLearningPaths();
  const { data: courses } = useCourses();
  const createLearningPath = useCreateLearningPath();
  const updateLearningPath = useUpdateLearningPath();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPath, setEditingPath] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_ids: [] as string[],
    is_published: false,
    order_index: 0,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      course_ids: [],
      is_published: false,
      order_index: 0,
    });
    setEditingPath(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingPath) {
        await updateLearningPath.mutateAsync({
          id: editingPath.id,
          updates: formData,
        });
      } else {
        await createLearningPath.mutateAsync({
          ...formData,
          created_by: user.id,
        });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving learning path:', error);
    }
  };

  const handleEdit = (path: any) => {
    setEditingPath(path);
    setFormData({
      title: path.title,
      description: path.description || '',
      course_ids: path.course_ids || [],
      is_published: path.is_published,
      order_index: path.order_index || 0,
    });
    setIsDialogOpen(true);
  };

  const calculatePathStats = (courseIds: string[]) => {
    if (!courses) return { totalHours: 0, types: [] };
    
    const pathCourses = courses.filter(course => courseIds.includes(course.id));
    const totalMinutes = pathCourses.reduce((sum, course) => {
      const duration = parseInt(course.duration) || 0;
      return sum + duration;
    }, 0);
    
    const types = [...new Set(pathCourses.map(course => course.course_type))];
    
    return {
      totalHours: Math.round(totalMinutes / 60 * 10) / 10,
      types,
    };
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">Caricamento percorsi...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestione Percorsi</h2>
          <p className="text-muted-foreground">Crea e gestisci percorsi di apprendimento</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Percorso
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPath ? 'Modifica Percorso' : 'Nuovo Percorso'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titolo</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrizione</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label>Corsi del Percorso</Label>
                  <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-4">
                    {courses?.map((course) => (
                      <div key={course.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={course.id}
                          checked={formData.course_ids.includes(course.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                course_ids: [...prev.course_ids, course.id]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                course_ids: prev.course_ids.filter(id => id !== course.id)
                              }));
                            }
                          }}
                          className="rounded"
                        />
                        <Label htmlFor={course.id} className="flex-1 cursor-pointer">
                          {course.title} ({course.duration} min)
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, is_published: checked }))
                    }
                  />
                  <Label htmlFor="published">Pubblicato</Label>
                </div>
                
                <div>
                  <Label htmlFor="order">Ordine</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      order_index: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annulla
                </Button>
                <Button type="submit">
                  {editingPath ? 'Salva' : 'Crea'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningPaths?.map((path) => {
          const stats = calculatePathStats(path.course_ids || []);
          
          return (
            <Card key={path.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{path.title}</CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(path)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {path.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {path.description}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{path.course_ids?.length || 0} corsi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{stats.totalHours}h</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {stats.types.map((type, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant={path.is_published ? "default" : "secondary"}>
                    {path.is_published ? 'Pubblicato' : 'Bozza'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Ordine: {path.order_index}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
