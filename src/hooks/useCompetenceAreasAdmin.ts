import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CompetenceAreaData {
  name: string;
  description?: string;
  icon?: string;
  color: string;
}

export const useCreateCompetenceArea = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (areaData: CompetenceAreaData) => {
      console.log('Creating competence area with data:', areaData);
      
      // Verifica l'utente corrente
      const { data: user, error: userError } = await supabase.auth.getUser();
      console.log('Current user:', user?.user?.email);
      
      if (userError) {
        console.error('User error:', userError);
        throw userError;
      }

      const { data, error } = await supabase
        .from('competence_areas')
        .insert([areaData])
        .select()
        .single();
      
      if (error) {
        console.error('Database error creating competence area:', error);
        throw error;
      }
      
      console.log('Successfully created competence area:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competence-areas'] });
      toast({
        title: "Area di competenza creata",
        description: "L'area di competenza è stata creata con successo.",
      });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: "Errore",
        description: `Si è verificato un errore: ${error.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateCompetenceArea = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CompetenceAreaData> }) => {
      const { data, error } = await supabase
        .from('competence_areas')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competence-areas'] });
      toast({
        title: "Area di competenza aggiornata",
        description: "L'area di competenza è stata aggiornata con successo.",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento dell'area di competenza.",
        variant: "destructive",
      });
      console.error('Error updating competence area:', error);
    },
  });
};

export const useDeleteCompetenceArea = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('competence_areas')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competence-areas'] });
      toast({
        title: "Area di competenza eliminata",
        description: "L'area di competenza è stata eliminata con successo.",
      });
    },
    onError: (error) => {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione dell'area di competenza.",
        variant: "destructive",
      });
      console.error('Error deleting competence area:', error);
    },
  });
};
