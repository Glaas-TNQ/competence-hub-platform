
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, ThumbsUp, Eye, Plus, Clock } from 'lucide-react';

const mockDiscussions = [
  {
    id: 1,
    title: "Come ottimizzare le performance di React?",
    content: "Sto lavorando su un'app React che sta diventando lenta. Quali sono le migliori pratiche per ottimizzare le performance?",
    author: "Marco Rossi",
    authorAvatar: "/placeholder.svg",
    competenceArea: "Sviluppo Web",
    replies: 12,
    likes: 8,
    views: 45,
    createdAt: "2024-06-18T10:30:00",
    isAnswered: true
  },
  {
    id: 2,
    title: "Differenze tra supervised e unsupervised learning",
    content: "Qualcuno può spiegarmi in termini semplici la differenza tra apprendimento supervisionato e non supervisionato?",
    author: "Laura Bianchi",
    authorAvatar: "/placeholder.svg",
    competenceArea: "Data Science",
    replies: 6,
    likes: 15,
    views: 78,
    createdAt: "2024-06-17T15:45:00",
    isAnswered: false
  },
  {
    id: 3,
    title: "Best practices per microservices in AWS",
    content: "Sto progettando un'architettura a microservizi su AWS. Quali sono i servizi più adatti e come gestire la comunicazione?",
    author: "Giuseppe Verde",
    authorAvatar: "/placeholder.svg",
    competenceArea: "Cloud Computing",
    replies: 9,
    likes: 22,
    views: 134,
    createdAt: "2024-06-16T09:15:00",
    isAnswered: true
  }
];

export const UserDiscussions: React.FC = () => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h fa`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}g fa`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Discussioni della Community</h2>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Nuova Discussione
        </Button>
      </div>

      <div className="space-y-4">
        {mockDiscussions.map((discussion) => (
          <Card key={discussion.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={discussion.authorAvatar} />
                  <AvatarFallback>{discussion.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{discussion.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>di {discussion.author}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatTimeAgo(discussion.createdAt)}
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          {discussion.competenceArea}
                        </Badge>
                      </div>
                    </div>
                    {discussion.isAnswered && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Risolto
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-gray-700 line-clamp-2">{discussion.content}</p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <MessageCircle size={16} />
                      {discussion.replies} risposte
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={16} />
                      {discussion.likes} mi piace
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={16} />
                      {discussion.views} visualizzazioni
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Discussioni Popolari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Roadmap per diventare Full Stack Developer</h4>
                <p className="text-sm text-gray-500">45 risposte • 120 mi piace</p>
              </div>
              <Badge>Hot 🔥</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Certificazioni cloud più richieste nel 2024</h4>
                <p className="text-sm text-gray-500">23 risposte • 89 mi piace</p>
              </div>
              <Badge variant="secondary">Trending</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
