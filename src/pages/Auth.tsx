
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { BookOpen, Award, TrendingUp } from 'lucide-react';

export const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: t('auth.signInError'),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t('auth.signInSuccess'),
        description: t('auth.welcomeMessage'),
      });
      navigate('/');
    }

    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const fullName = formData.get('fullName') as string;

    const { error } = await signUp(email, password, fullName);

    if (error) {
      toast({
        title: t('auth.signUpError'),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t('auth.signUpSuccess'),
        description: t('auth.checkEmailMessage'),
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block space-y-8 animate-educational-fade-in">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/lovable-uploads/a00c60b8-e61f-425d-a9d2-0b978977292c.png" 
                alt="FairMind Logo"
                className="h-12 w-auto"
              />
              <h1 className="heading-educational-display text-primary">
                {t('auth.title')}
              </h1>
            </div>
            <p className="text-educational-h4 text-muted-foreground leading-relaxed">
              {t('auth.description')}
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex items-start gap-4 p-6 bg-card/50 rounded-2xl border border-border/50 backdrop-blur-sm">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-success" />
              </div>
              <div>
                <h3 className="text-educational-h4 font-semibold mb-2">{t('auth.features.interactiveCourses')}</h3>
                <p className="text-educational-small text-muted-foreground">
                  {t('auth.features.interactiveCoursesDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card/50 rounded-2xl border border-border/50 backdrop-blur-sm">
              <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Award className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h3 className="text-educational-h4 font-semibold mb-2">{t('auth.features.certifications')}</h3>
                <p className="text-educational-small text-muted-foreground">
                  {t('auth.features.certificationsDesc')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-card/50 rounded-2xl border border-border/50 backdrop-blur-sm">
              <div className="w-10 h-10 bg-focus/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-focus" />
              </div>
              <div>
                <h3 className="text-educational-h4 font-semibold mb-2">{t('auth.features.trackedProgress')}</h3>
                <p className="text-educational-small text-muted-foreground">
                  {t('auth.features.trackedProgressDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="animate-educational-scale-in">
          <Card className="w-full max-w-md mx-auto shadow-educational-xl">
            <CardHeader className="space-y-1 text-center pb-6">
              <div className="flex justify-center mb-4 lg:hidden">
                <img 
                  src="/lovable-uploads/a00c60b8-e61f-425d-a9d2-0b978977292c.png" 
                  alt="FairMind Logo"
                  className="h-12 w-auto"
                />
              </div>
              <CardTitle className="text-educational-h2">{t('auth.title')}</CardTitle>
              <CardDescription className="text-educational-body">
                {t('auth.subtitle')}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-educational">
                  <TabsTrigger value="signin" className="rounded-educational-sm">{t('auth.signIn')}</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-educational-sm">{t('auth.signUp')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="mt-6">
                  <form onSubmit={handleSignIn} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-educational-body font-medium">{t('auth.email')}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t('auth.emailPlaceholder')}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-educational-body font-medium">{t('auth.password')}</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="h-12"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-educational-body"
                      disabled={isLoading}
                      size="lg"
                    >
                      {isLoading ? t('auth.signingIn') : t('auth.signInButton')}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="mt-6">
                  <form onSubmit={handleSignUp} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-educational-body font-medium">{t('auth.fullName')}</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder={t('auth.fullNamePlaceholder')}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-educational-body font-medium">{t('auth.email')}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={t('auth.emailPlaceholder')}
                        required
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-educational-body font-medium">{t('auth.password')}</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="h-12"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-educational-body"
                      disabled={isLoading}
                      size="lg"
                    >
                      {isLoading ? t('auth.signingUp') : t('auth.signUpButton')}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Mobile Features Preview */}
          <div className="lg:hidden mt-8 space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto">
                  <BookOpen className="w-6 h-6 text-success" />
                </div>
                <p className="text-educational-small font-medium">{t('auth.features.courses')}</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6 text-secondary" />
                </div>
                <p className="text-educational-small font-medium">{t('auth.features.certificates')}</p>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 bg-focus/10 rounded-xl flex items-center justify-center mx-auto">
                  <TrendingUp className="w-6 h-6 text-focus" />
                </div>
                <p className="text-educational-small font-medium">{t('auth.features.analytics')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
