
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileText, Video, Link, Download, Heart, Share, Plus } from 'lucide-react';

const mockSharedContent = [
  {
    id: 1,
    type: 'document',
    title: "Guida Completa a React Hooks",
    description: "Documento PDF con esempi pratici e best practices per l'uso degli hooks in React",
    author: "Alessia Romano",
    authorAvatar: "/placeholder.svg",
    competenceArea: "Sviluppo Web",
    likes: 34,
    downloads: 128,
    sharedAt: "2024-06-18T14:20:00",
    fileSize: "2.5 MB"
  },
  {
    id: 2,
    type: 'video',
    title: "Machine Learning con Python - Tutorial Completo",
    description: "Video tutorial di 45 minuti che copre i fondamenti del ML usando scikit-learn",
    author: "Francesco Blu",
    authorAvatar: "/placeholder.svg",
    competenceArea: "Data Science",
    likes: 67,
    downloads: 89,
    sharedAt: "2024-06-17T09:30:00",
    duration: "45 min"
  },
  {
    id: 3,
    type: 'link',
    title: "Awesome DevOps Tools - Repository GitHub",
    description: "Collezione curata dei migliori strumenti per DevOps e automazione",
    author: "Marco Verdi",
    authorAvatar: "/placeholder.svg",
    competenceArea: "DevOps",
    likes: 23,
    downloads: 0,
    sharedAt: "2024-06-16T16:45:00",
    url: "https://github.com/awesome-devops"
  }
];

export const SharedContent: React.FC = () => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText size={20} className="text-blue-500" />;
      case 'video':
        return <Video size={20} className="text-red-500" />;
      case 'link':
        return <Link size={20} className="text-green-500" />;
      default:
        return <FileText size={20} />;
    }
  };

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
        <h2 className="text-2xl font-bold">Contenuti Condivisi</h2>
        <Button className="flex items-center gap-2">
          <Plus size={16} />
          Condividi Contenuto
        </Button>
      </div>

      <div className="grid gap-6">
        {mockSharedContent.map((content) => (
          <Card key={content.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  {getTypeIcon(content.type)}
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{content.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={content.authorAvatar} />
                          <AvatarFallback className="text-xs">
                            {content.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>condiviso da {content.author}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(content.sharedAt)}</span>
                      </div>
                      <Badge variant="secondary" className="mb-2">
                        {content.competenceArea}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-700">{content.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart size={16} />
                        {content.likes} mi piace
                      </div>
                      {content.downloads > 0 && (
                        <div className="flex items-center gap-1">
                          <Download size={16} />
                          {content.downloads} download
                        </div>
                      )}
                      {content.fileSize && (
                        <span>• {content.fileSize}</span>
                      )}
                      {content.duration && (
                        <span>• {content.duration}</span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Heart size={16} className="mr-1" />
                        Mi Piace
                      </Button>
                      <Button size="sm">
                        {content.type === 'link' ? (
                          <>
                            <Link size={16} className="mr-1" />
                            Visita
                          </>
                        ) : (
                          <>
                            <Download size={16} className="mr-1" />
                            Scarica
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share size={16} />
                      </Button>
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
          <CardTitle>Contenuti più Popolari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText size={16} className="text-blue-500" />
                <div>
                  <h4 className="font-medium">Cheat Sheet JavaScript ES6+</h4>
                  <p className="text-sm text-gray-500">456 download • 89 mi piace</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Scarica</Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Video size={16} className="text-red-500" />
                <div>
                  <h4 className="font-medium">Docker per Sviluppatori</h4>
                  <p className="text-sm text-gray-500">298 visualizzazioni • 72 mi piace</p>
                </div>
              </div>
              <Button size="sm" variant="outline">Guarda</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
