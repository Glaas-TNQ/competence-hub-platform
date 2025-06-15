
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StudyGroups } from '@/components/collaboration/StudyGroups';
import { UserDiscussions } from '@/components/collaboration/UserDiscussions';
import { SharedContent } from '@/components/collaboration/SharedContent';
import { CollaborationFeed } from '@/components/collaboration/CollaborationFeed';

export const Collaboration: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Collaborazione</h1>
        <p className="text-gray-600 mt-2">Connettiti con altri studenti e impara insieme</p>
      </div>

      <Tabs defaultValue="groups" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="groups">Gruppi di Studio</TabsTrigger>
          <TabsTrigger value="discussions">Discussioni</TabsTrigger>
          <TabsTrigger value="shared">Contenuti Condivisi</TabsTrigger>
          <TabsTrigger value="feed">Feed Attività</TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="space-y-6">
          <StudyGroups />
        </TabsContent>

        <TabsContent value="discussions" className="space-y-6">
          <UserDiscussions />
        </TabsContent>

        <TabsContent value="shared" className="space-y-6">
          <SharedContent />
        </TabsContent>

        <TabsContent value="feed" className="space-y-6">
          <CollaborationFeed />
        </TabsContent>
      </Tabs>
    </div>
  );
};
