
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { validatePassword, validateEmail, rateLimiter } from '@/utils/security';
import { toast } from '@/hooks/use-toast';

export const useSecureAuth = () => {
  const { signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const secureSignIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Validate inputs
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      
      // Rate limiting
      if (!rateLimiter.isAllowed(`signin-${email}`, 5, 15 * 60 * 1000)) {
        throw new Error('Too many sign-in attempts. Please try again in 15 minutes.');
      }
      
      const result = await signIn(email, password);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      // Reset rate limiter on successful sign-in
      rateLimiter.reset(`signin-${email}`);
      
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign-in failed';
      toast({
        title: 'Authentication Error',
        description: message,
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const secureSignUp = async (email: string, password: string, fullName?: string) => {
    setIsLoading(true);
    
    try {
      // Validate inputs
      if (!validateEmail(email)) {
        throw new Error('Invalid email format');
      }
      
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(`Password requirements not met: ${passwordValidation.errors.join(', ')}`);
      }
      
      // Rate limiting
      if (!rateLimiter.isAllowed(`signup-${email}`, 3, 60 * 60 * 1000)) {
        throw new Error('Too many sign-up attempts. Please try again in 1 hour.');
      }
      
      const result = await signUp(email, password, fullName);
      
      if (result.error) {
        throw new Error(result.error.message);
      }
      
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign-up failed';
      toast({
        title: 'Registration Error',
        description: message,
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    secureSignIn,
    secureSignUp,
    isLoading
  };
};
