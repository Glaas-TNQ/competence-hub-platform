
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Plus, Calendar, MessageCircle, Target } from 'lucide-react';

const mockGroups = [
  {
    id: 1,
    name: "JavaScript Avanzato",
    description: "Gruppo di studio per approfondire JavaScript ES6+ e framework moderni",
    members: 12,
    nextMeeting: "2024-06-20T18:00:00",
    competenceArea: "Sviluppo Web",
    isJoined: true,
    avatar: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Data Science Foundations",
    description: "Imparare insieme le basi della data science e machine learning",
    members: 8,
    nextMeeting: "2024-06-22T19:30:00",
    competenceArea: "Data Science",
    isJoined: false,
    avatar: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Cloud Architecture",
    description: "Discussioni su AWS, Azure e best practices di cloud computing",
    members: 15,
    nextMeeting: "2024-06-25T17:00:00",
    competenceArea: "Cloud Computing",
    isJoined: true,
    avatar: "/placeholder.svg"
  }
];

export const StudyGroups: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">I Tuoi Gruppi di Studio</h2>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Crea Gruppo
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockGroups.map((group) => (
          <Card key={group.id} className="h-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={group.avatar} />
                    <AvatarFallback>
                      <Users size={20} />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {group.competenceArea}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{group.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  {group.members} membri
                </div>
                {group.nextMeeting && (
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    {new Date(group.nextMeeting).toLocaleDateString('it-IT')}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {group.isJoined ? (
                  <>
                    <Button size="sm" className="flex-1">
                      <MessageCircle size={16} className="mr-1" />
                      Chat
                    </Button>
                    <Button size="sm" variant="outline">
                      <Target size={16} className="mr-1" />
                      Obiettivi
                    </Button>
                  </>
                ) : (
                  <Button size="sm" className="flex-1">
                    Unisciti al Gruppo
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gruppi Consigliati</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Python per Principianti</h4>
                <p className="text-sm text-gray-500">6 membri • Programmazione</p>
              </div>
              <Button size="sm" variant="outline">Unisciti</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">UX/UI Design Trends</h4>
                <p className="text-sm text-gray-500">11 membri • Design</p>
              </div>
              <Button size="sm" variant="outline">Unisciti</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
