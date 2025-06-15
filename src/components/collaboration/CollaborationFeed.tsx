
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Users, FileText, MessageCircle, Target, Clock } from 'lucide-react';

const mockFeedItems = [
  {
    id: 1,
    type: 'achievement',
    user: 'Marco Rossi',
    userAvatar: '/placeholder.svg',
    action: 'ha ottenuto il badge',
    object: 'JavaScript Master',
    timestamp: '2024-06-18T15:30:00',
    icon: Trophy,
    color: 'text-yellow-500'
  },
  {
    id: 2,
    type: 'group_join',
    user: 'Laura Bianchi',
    userAvatar: '/placeholder.svg',
    action: 'si è unita al gruppo',
    object: 'Data Science Foundations',
    timestamp: '2024-06-18T14:15:00',
    icon: Users,
    color: 'text-blue-500'
  },
  {
    id: 3,
    type: 'content_share',
    user: 'Giuseppe Verde',
    userAvatar: '/placeholder.svg',
    action: 'ha condiviso',
    object: 'Guida AWS Lambda',
    timestamp: '2024-06-18T12:45:00',
    icon: FileText,
    color: 'text-green-500'
  },
  {
    id: 4,
    type: 'discussion',
    user: 'Alessia Romano',
    userAvatar: '/placeholder.svg',
    action: 'ha avviato una discussione',
    object: 'React vs Vue: quale scegliere?',
    timestamp: '2024-06-18T11:20:00',
    icon: MessageCircle,
    color: 'text-purple-500'
  },
  {
    id: 5,
    type: 'goal_completed',
    user: 'Francesco Blu',
    userAvatar: '/placeholder.svg',
    action: 'ha completato l\'obiettivo',
    object: 'Finire 3 corsi questo mese',
    timestamp: '2024-06-18T09:10:00',
    icon: Target,
    color: 'text-orange-500'
  }
];

export const CollaborationFeed: React.FC = () => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes} min fa`;
    } else if (diffMinutes < 1440) {
      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours}h fa`;
    } else {
      const diffDays = Math.floor(diffMinutes / 1440);
      return `${diffDays}g fa`;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'achievement':
        return <Badge className="bg-yellow-100 text-yellow-800">Achievement</Badge>;
      case 'group_join':
        return <Badge className="bg-blue-100 text-blue-800">Gruppo</Badge>;
      case 'content_share':
        return <Badge className="bg-green-100 text-green-800">Condivisione</Badge>;
      case 'discussion':
        return <Badge className="bg-purple-100 text-purple-800">Discussione</Badge>;
      case 'goal_completed':
        return <Badge className="bg-orange-100 text-orange-800">Obiettivo</Badge>;
      default:
        return <Badge variant="secondary">Attività</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Feed Attività Community</h2>
      
      <div className="space-y-4">
        {mockFeedItems.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <Card key={item.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={item.userAvatar} />
                    <AvatarFallback>
                      {item.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent size={16} className={item.color} />
                      <span className="font-medium">{item.user}</span>
                      <span className="text-gray-600">{item.action}</span>
                      <span className="font-medium text-blue-600">{item.object}</span>
                      {getActivityBadge(item.type)}
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock size={14} />
                      {formatTimeAgo(item.timestamp)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 mb-4">Hai raggiunto la fine del feed!</p>
          <p className="text-sm text-gray-400">
            Torna più tardi per vedere nuove attività della community
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
