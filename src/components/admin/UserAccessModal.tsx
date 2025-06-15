
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCourses, useUpdateUserAccess } from '@/hooks/useSupabase';
import { Loader2 } from 'lucide-react';

interface UserAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    email: string;
    full_name: string;
    accessible_courses: string[];
  };
}

export const UserAccessModal: React.FC<UserAccessModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const updateUserAccess = useUpdateUserAccess();
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  useEffect(() => {
    if (user?.accessible_courses) {
      setSelectedCourses(user.accessible_courses);
    }
  }, [user]);

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSave = async () => {
    try {
      await updateUserAccess.mutateAsync({
        userId: user.id,
        accessibleCourses: selectedCourses
      });
      onClose();
    } catch (error) {
      console.error('Errore nell\'aggiornamento degli accessi:', error);
    }
  };

  const isPremiumCourse = (course: any) => {
    return course.requires_payment || course.price > 0;
  };

  if (coursesLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gestisci Accessi Utente</DialogTitle>
          <DialogDescription>
            Configura a quali corsi può accedere <strong>{user.email}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Corsi Disponibili</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {courses?.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={course.id}
                      checked={selectedCourses.includes(course.id)}
                      onCheckedChange={() => handleCourseToggle(course.id)}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={course.id}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {course.title}
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {course.level}
                        </Badge>
                        {isPremiumCourse(course) && (
                          <Badge variant="secondary" className="text-xs">
                            Premium
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {course.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground">
            Corsi selezionati: {selectedCourses.length} / {courses?.length || 0}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annulla
          </Button>
          <Button 
            onClick={handleSave}
            disabled={updateUserAccess.isPending}
          >
            {updateUserAccess.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Salva Modifiche
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
