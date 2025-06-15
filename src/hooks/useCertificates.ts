
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Certificate {
  id: string;
  name: string;
  description: string;
  template_data: any;
  requirements: any;
  certificate_type: string;
  points_required: number;
  competence_area_id?: string;
}

interface UserCertificate {
  id: string;
  certificate_id: string;
  issued_at: string;
  verification_code: string;
  certificate_data: any;
  certificates: Certificate;
}

export const useAvailableCertificates = () => {
  return useQuery({
    queryKey: ['available-certificates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Certificate[];
    },
  });
};

export const useUserCertificates = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-certificates', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_certificates')
        .select(`
          *,
          certificates (*)
        `)
        .eq('user_id', user.id)
        .eq('is_revoked', false)
        .order('issued_at', { ascending: false });
      
      if (error) throw error;
      return data as UserCertificate[];
    },
    enabled: !!user,
  });
};

export const useCheckCertificates = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase.rpc('check_and_award_certificates', {
        p_user_id: user.id
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-certificates'] });
    },
  });
};

export const useVerifyCertificate = () => {
  return useMutation({
    mutationFn: async (verificationCode: string) => {
      const { data, error } = await supabase
        .from('user_certificates')
        .select(`
          *,
          certificates (*)
        `)
        .eq('verification_code', verificationCode)
        .eq('is_revoked', false)
        .single();
      
      if (error) throw error;
      return data;
    },
  });
};
