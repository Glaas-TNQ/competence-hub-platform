import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { useCompetenceAreas } from '@/hooks/useSupabase';
import { useCreateCompetenceArea, useUpdateCompetenceArea, useDeleteCompetenceArea, CompetenceAreaData } from '@/hooks/useCompetenceAreasAdmin';

export const CompetenceAreaManager = () => {
  const { data: competenceAreas, isLoading } = useCompetenceAreas();
  const createMutation = useCreateCompetenceArea();
  const updateMutation = useUpdateCompetenceArea();
  const deleteMutation = useDeleteCompetenceArea();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CompetenceAreaData>({
    name: '',
    description: '',
    icon: '',
    color: '#3b82f6'
  });

  const colors = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', 
    '#8b5cf6', '#f43f5e', '#06b6d4', '#84cc16'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      color: '#3b82f6'
    });
    setShowCreateForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    if (!formData.name.trim()) {
      console.error('Name is required');
      return;
    }
    
    try {
      if (editingId) {
        console.log('Updating area with ID:', editingId);
        await updateMutation.mutateAsync({ id: editingId, updates: formData });
      } else {
        console.log('Creating new area');
        await createMutation.mutateAsync(formData);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  const handleEdit = (area: any) => {
    setFormData({
      name: area.name,
      description: area.description || '',
      icon: area.icon || '',
      color: area.color || '#3b82f6'
    });
    setEditingId(area.id);
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Sei sicuro di voler eliminare questa area di competenza?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-800">Aree di Competenza</h2>
          <p className="text-slate-600 text-sm md:text-base">Gestisci le aree di competenza per organizzare i corsi</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nuova Area
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg md:text-xl">
                  {editingId ? 'Modifica Area di Competenza' : 'Crea Nuova Area di Competenza'}
                </CardTitle>
                <CardDescription className="text-sm">
                  {editingId ? 'Modifica i dettagli dell\'area esistente' : 'Definisci una nuova area per organizzare i corsi'}
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome dell'area"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="icon">Icona</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="es. Shield, BarChart3"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrizione</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrizione dell'area di competenza"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Colore</Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        formData.color === color ? 'border-gray-800 scale-110' : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending || !formData.name.trim()}
                  className="w-full sm:w-auto"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Aggiorna Area' : 'Crea Area'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  className="w-full sm:w-auto"
                >
                  Annulla
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Debug info */}
      <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
        Debug: {createMutation.isPending ? 'Creating...' : ''} 
        {createMutation.error ? `Error: ${createMutation.error.message}` : ''}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {competenceAreas?.map((area) => (
          <Card key={area.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm md:text-base flex-shrink-0"
                    style={{ backgroundColor: area.color }}
                  >
                    {area.icon ? area.icon.charAt(0) : area.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base md:text-lg line-clamp-2">{area.name}</CardTitle>
                    {area.description && (
                      <CardDescription className="text-xs md:text-sm line-clamp-2">
                        {area.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1 flex-shrink-0">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleEdit(area)}
                    className="touch-target"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleDelete(area.id)}
                    disabled={deleteMutation.isPending}
                    className="touch-target"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {competenceAreas?.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-slate-500 mb-4">Nessuna area di competenza trovata</p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crea la prima area
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
