
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, Eye, Video, Image, FileText, MoveUp, MoveDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Chapter {
  id: string;
  title: string;
  order: number;
  content: ContentBlock[];
}

interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'video';
  order: number;
  data: {
    text?: string;
    imageUrl?: string;
    videoUrl?: string;
    title?: string;
    description?: string;
  };
}

interface CourseContentEditorProps {
  courseId: string;
  courseTitle: string;
  initialContent?: any;
  onSave: (content: any) => void;
}

export const CourseContentEditor: React.FC<CourseContentEditorProps> = ({
  courseId,
  courseTitle,
  initialContent,
  onSave
}) => {
  const [chapters, setChapters] = useState<Chapter[]>(initialContent?.chapters || []);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');

  const addChapter = () => {
    if (!newChapterTitle.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci un titolo per il capitolo",
        variant: "destructive"
      });
      return;
    }

    const newChapter: Chapter = {
      id: `chapter-${Date.now()}`,
      title: newChapterTitle,
      order: chapters.length + 1,
      content: []
    };

    setChapters([...chapters, newChapter]);
    setNewChapterTitle('');
    setIsAddingChapter(false);
    setSelectedChapter(newChapter.id);
  };

  const deleteChapter = (chapterId: string) => {
    setChapters(chapters.filter(c => c.id !== chapterId));
    if (selectedChapter === chapterId) {
      setSelectedChapter(null);
    }
  };

  const addContentBlock = (type: 'text' | 'image' | 'video') => {
    if (!selectedChapter) return;

    const chapter = chapters.find(c => c.id === selectedChapter);
    if (!chapter) return;

    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      order: chapter.content.length + 1,
      data: {}
    };

    const updatedChapters = chapters.map(c => 
      c.id === selectedChapter 
        ? { ...c, content: [...c.content, newBlock] }
        : c
    );

    setChapters(updatedChapters);
  };

  const updateContentBlock = (blockId: string, data: any) => {
    if (!selectedChapter) return;

    const updatedChapters = chapters.map(chapter => 
      chapter.id === selectedChapter 
        ? {
            ...chapter,
            content: chapter.content.map(block =>
              block.id === blockId ? { ...block, data: { ...block.data, ...data } } : block
            )
          }
        : chapter
    );

    setChapters(updatedChapters);
  };

  const deleteContentBlock = (blockId: string) => {
    if (!selectedChapter) return;

    const updatedChapters = chapters.map(chapter => 
      chapter.id === selectedChapter 
        ? { ...chapter, content: chapter.content.filter(block => block.id !== blockId) }
        : chapter
    );

    setChapters(updatedChapters);
  };

  const moveContentBlock = (blockId: string, direction: 'up' | 'down') => {
    if (!selectedChapter) return;

    const chapter = chapters.find(c => c.id === selectedChapter);
    if (!chapter) return;

    const blockIndex = chapter.content.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return;

    const newIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1;
    if (newIndex < 0 || newIndex >= chapter.content.length) return;

    const newContent = [...chapter.content];
    [newContent[blockIndex], newContent[newIndex]] = [newContent[newIndex], newContent[blockIndex]];

    const updatedChapters = chapters.map(c => 
      c.id === selectedChapter ? { ...c, content: newContent } : c
    );

    setChapters(updatedChapters);
  };

  const handleSave = () => {
    const courseContent = {
      chapters,
      lastUpdated: new Date().toISOString()
    };

    onSave(courseContent);
    toast({
      title: "Successo",
      description: "Contenuto del corso salvato con successo"
    });
  };

  const selectedChapterData = chapters.find(c => c.id === selectedChapter);

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Editor Contenuti</h2>
          <p className="text-slate-600">Corso: {courseTitle}</p>
        </div>
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Salva Contenuti</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista Capitoli */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Capitoli
              <Button size="sm" onClick={() => setIsAddingChapter(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isAddingChapter && (
              <div className="space-y-2 p-3 border rounded-lg">
                <Input
                  placeholder="Titolo capitolo"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button size="sm" onClick={addChapter}>Aggiungi</Button>
                  <Button size="sm" variant="outline" onClick={() => setIsAddingChapter(false)}>
                    Annulla
                  </Button>
                </div>
              </div>
            )}

            {chapters.map((chapter, index) => (
              <div
                key={chapter.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedChapter === chapter.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedChapter(chapter.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{chapter.title}</h4>
                    <p className="text-sm text-gray-500">{chapter.content.length} elementi</p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChapter(chapter.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Editor Contenuti */}
        <div className="lg:col-span-2">
          {selectedChapterData ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {selectedChapterData.title}
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => addContentBlock('text')}>
                      <FileText className="h-4 w-4 mr-1" />
                      Testo
                    </Button>
                    <Button size="sm" onClick={() => addContentBlock('image')}>
                      <Image className="h-4 w-4 mr-1" />
                      Immagine
                    </Button>
                    <Button size="sm" onClick={() => addContentBlock('video')}>
                      <Video className="h-4 w-4 mr-1" />
                      Video
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedChapterData.content.map((block, index) => (
                  <Card key={block.id} className="border-l-4 border-blue-500">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getBlockIcon(block.type)}
                          <Badge variant="secondary">{block.type}</Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveContentBlock(block.id, 'up')}
                            disabled={index === 0}
                          >
                            <MoveUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveContentBlock(block.id, 'down')}
                            disabled={index === selectedChapterData.content.length - 1}
                          >
                            <MoveDown className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteContentBlock(block.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {block.type === 'text' && (
                        <>
                          <div className="space-y-2">
                            <Label>Titolo (opzionale)</Label>
                            <Input
                              placeholder="Titolo del paragrafo"
                              value={block.data.title || ''}
                              onChange={(e) => updateContentBlock(block.id, { title: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Contenuto</Label>
                            <Textarea
                              placeholder="Inserisci il testo del paragrafo"
                              value={block.data.text || ''}
                              onChange={(e) => updateContentBlock(block.id, { text: e.target.value })}
                              rows={4}
                            />
                          </div>
                        </>
                      )}

                      {block.type === 'image' && (
                        <>
                          <div className="space-y-2">
                            <Label>URL Immagine</Label>
                            <Input
                              placeholder="https://example.com/image.jpg"
                              value={block.data.imageUrl || ''}
                              onChange={(e) => updateContentBlock(block.id, { imageUrl: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Descrizione (opzionale)</Label>
                            <Input
                              placeholder="Descrizione dell'immagine"
                              value={block.data.description || ''}
                              onChange={(e) => updateContentBlock(block.id, { description: e.target.value })}
                            />
                          </div>
                          {block.data.imageUrl && (
                            <div className="border rounded-lg p-2">
                              <img 
                                src={block.data.imageUrl} 
                                alt={block.data.description || 'Preview'} 
                                className="max-h-32 object-contain"
                              />
                            </div>
                          )}
                        </>
                      )}

                      {block.type === 'video' && (
                        <>
                          <div className="space-y-2">
                            <Label>URL Video (YouTube, Vimeo, etc.)</Label>
                            <Input
                              placeholder="https://www.youtube.com/embed/..."
                              value={block.data.videoUrl || ''}
                              onChange={(e) => updateContentBlock(block.id, { videoUrl: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Titolo (opzionale)</Label>
                            <Input
                              placeholder="Titolo del video"
                              value={block.data.title || ''}
                              onChange={(e) => updateContentBlock(block.id, { title: e.target.value })}
                            />
                          </div>
                          {block.data.videoUrl && (
                            <div className="border rounded-lg p-2">
                              <iframe
                                src={block.data.videoUrl}
                                className="w-full h-32"
                                frameBorder="0"
                                allowFullScreen
                              />
                            </div>
                          )}
                        </>
                      )}
                    </CardContent>
                  </Card>
                ))}

                {selectedChapterData.content.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Nessun contenuto aggiunto al capitolo.</p>
                    <p className="text-sm">Usa i pulsanti sopra per aggiungere testo, immagini o video.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center text-gray-500">
                  <h3 className="text-lg font-medium mb-2">Seleziona un capitolo</h3>
                  <p>Scegli un capitolo dalla lista per iniziare a modificarne il contenuto</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
