
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, FileText, Euro, Lock, Check, X } from 'lucide-react';

interface CourseCardProps {
  course: any;
  competenceAreas: any[] | undefined;
  onEdit: (course: any) => void;
  onTogglePublished: (courseId: string, currentStatus: boolean) => void;
  isUpdating: boolean;
}

export const CourseCard = ({
  course,
  competenceAreas,
  onEdit,
  onTogglePublished,
  isUpdating
}: CourseCardProps) => {
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

  return (
    <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
        
        {/* Sub-header con pulsanti di azione */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" title="Visualizza">
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit(course)}
              title="Modifica contenuti"
            >
              <FileText className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Modifica corso">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Elimina">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {course.content && Object.keys(course.content).length > 0 
              ? `${Object.keys(course.content).length} capitoli` 
              : 'Nessun contenuto'
            }
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Descrizione che occupa lo spazio disponibile */}
        <div className="flex-1">
          <CardDescription className="text-sm leading-relaxed">
            {course.description}
          </CardDescription>
        </div>
        
        {/* Badges e informazioni del corso */}
        <div className="space-y-3">
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
          
          <div className="text-sm text-slate-600 space-y-1">
            <p>Durata: {course.duration}</p>
            <p>Area: {getCompetenceAreaName(course)}</p>
            {course.requires_payment && course.price > 0 && (
              <p className="flex items-center gap-1 text-purple-600 font-medium">
                <Euro className="h-3 w-3" />
                {course.price}
              </p>
            )}
          </div>
        </div>
        
        {/* Pulsante di pubblicazione */}
        <div className="pt-2 border-t">
          <Button
            variant={course.is_published ? "destructive" : "default"}
            size="sm"
            onClick={() => onTogglePublished(course.id, course.is_published)}
            disabled={isUpdating}
            className="flex items-center gap-2 w-full"
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
        </div>
      </CardContent>
    </Card>
  );
};
