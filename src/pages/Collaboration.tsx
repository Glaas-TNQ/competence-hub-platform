
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CollaborationFeed } from '@/components/collaboration/CollaborationFeed';
import { SharedContent } from '@/components/collaboration/SharedContent';
import { StudyGroups } from '@/components/collaboration/StudyGroups';
import { UserDiscussions } from '@/components/collaboration/UserDiscussions';
import { Users, MessageSquare, Share2, UserPlus } from 'lucide-react';

export const Collaboration: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-focus bg-clip-text text-transparent">
            Collaborazione
          </h1>
          <p className="text-lg text-muted-foreground">
            Connettiti con altri studenti e condividi il tuo percorso di apprendimento
          </p>
        </div>

        <Tabs defaultValue="feed" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 backdrop-blur-sm border-0 shadow-educational rounded-2xl p-2">
            <TabsTrigger 
              value="feed" 
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Feed
            </TabsTrigger>
            <TabsTrigger 
              value="groups"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Users className="w-4 h-4 mr-2" />
              Gruppi
            </TabsTrigger>
            <TabsTrigger 
              value="content"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Contenuti
            </TabsTrigger>
            <TabsTrigger 
              value="discussions"
              className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Discussioni
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Feed Attività
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CollaborationFeed />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-secondary" />
                  Gruppi di Studio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StudyGroups />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-focus" />
                  Contenuti Condivisi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SharedContent />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discussions" className="space-y-6">
            <Card className="border-0 shadow-educational bg-card/50 backdrop-blur-sm hover:shadow-educational-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-success" />
                  Discussioni Utenti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserDiscussions />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
