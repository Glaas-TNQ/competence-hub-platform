
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useUserGoals } from '@/hooks/useUserGoals';
import { Plus, Target, Calendar, TrendingUp, CheckCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { it } from 'date-fns/locale';

const GOAL_TYPES = [
  { value: 'courses_completed', label: 'Corsi Completati', icon: <Target className="h-4 w-4" /> },
  { value: 'study_days', label: 'Giorni di Studio', icon: <Calendar className="h-4 w-4" /> },
  { value: 'points_earned', label: 'Punti Guadagnati', icon: <TrendingUp className="h-4 w-4" /> },
];

const GOAL_PERIODS = [
  { value: 'weekly', label: 'Settimanale', days: 7 },
  { value: 'monthly', label: 'Mensile', days: 30 },
  { value: 'quarterly', label: 'Trimestrale', days: 90 },
];

export const GoalsManager: React.FC = () => {
  const { data: goals, isLoading } = useUserGoals();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="container-educational layout-educational">
        <div className="space-y-educational-lg">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-40 animate-educational-pulse">
              <CardContent className="h-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const activeGoals = goals?.filter(goal => !goal.is_completed) || [];
  const completedGoals = goals?.filter(goal => goal.is_completed) || [];

  return (
    <div className="container-educational layout-educational space-educational">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-educational-2xl">
        <div className="space-y-educational-xs">
          <h1 className="heading-educational-display text-accent-foreground">
            I Miei Obiettivi
          </h1>
          <p className="text-educational-body text-muted-foreground">
            Crea e monitora i tuoi obiettivi di apprendimento
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="flex items-center gap-2 hover-educational">
              <Plus className="h-5 w-5" />
              Nuovo Obiettivo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-educational-h2">Crea Nuovo Obiettivo</DialogTitle>
            </DialogHeader>
            <CreateGoalForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Obiettivi Attivi */}
      <section className="section-educational">
        <h2 className="heading-educational-section text-accent-foreground mb-educational-lg">
          Obiettivi Attivi
        </h2>
        {activeGoals.length > 0 ? (
          <div className="grid gap-educational-md md:grid-cols-2 lg:grid-cols-3">
            {activeGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <Card className="hover-educational">
            <CardContent className="flex flex-col items-center justify-center py-educational-5xl">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-educational-lg">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-educational-h3 font-semibold text-accent-foreground mb-educational-sm">
                Nessun obiettivo attivo
              </h3>
              <p className="text-educational-body text-muted-foreground text-center mb-educational-lg max-w-sm">
                Crea il tuo primo obiettivo per iniziare a monitorare i progressi!
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="hover-educational"
              >
                Crea Primo Obiettivo
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Obiettivi Completati */}
      {completedGoals.length > 0 && (
        <section className="section-educational">
          <h2 className="heading-educational-section text-accent-foreground mb-educational-lg">
            Obiettivi Completati
          </h2>
          <div className="grid gap-educational-md md:grid-cols-2 lg:grid-cols-3">
            {completedGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

interface GoalCardProps {
  goal: any;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal }) => {
  const goalType = GOAL_TYPES.find(type => type.value === goal.goal_type);
  const progress = Math.min((goal.current_value / goal.target_value) * 100, 100);
  const isExpired = new Date(goal.period_end) < new Date() && !goal.is_completed;

  return (
    <Card className={`hover-educational relative ${
      goal.is_completed 
        ? 'bg-success/5 border-success/20' 
        : isExpired 
        ? 'bg-destructive/5 border-destructive/20' 
        : ''
    }`}>
      <CardHeader className="pb-educational-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-educational-sm">
            <div className="w-8 h-8 bg-primary/10 rounded-educational flex items-center justify-center">
              {goalType?.icon}
            </div>
            <CardTitle className="text-educational-h4 font-medium">
              {goalType?.label}
            </CardTitle>
          </div>
          {goal.is_completed && (
            <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-educational-md">
        <div className="space-y-educational-sm">
          <div className="flex items-center justify-between text-educational-small">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium text-accent-foreground">
              {goal.current_value} / {goal.target_value}
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="text-educational-caption text-muted-foreground text-center">
            {progress.toFixed(0)}% completato
          </div>
        </div>

        <div className="flex items-center justify-between text-educational-caption">
          <span className="text-muted-foreground">
            Scade: {format(new Date(goal.period_end), 'dd MMM yyyy', { locale: it })}
          </span>
          {isExpired && !goal.is_completed && (
            <Badge variant="destructive" className="text-educational-caption">
              Scaduto
            </Badge>
          )}
          {goal.is_completed && (
            <Badge className="text-educational-caption bg-success hover:bg-success/90">
              Completato
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface CreateGoalFormProps {
  onSuccess: () => void;
}

const CreateGoalForm: React.FC<CreateGoalFormProps> = ({ onSuccess }) => {
  const [goalType, setGoalType] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [period, setPeriod] = useState('');
  const { createGoal } = useUserGoals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goalType || !targetValue || !period) return;

    const selectedPeriod = GOAL_PERIODS.find(p => p.value === period);
    if (!selectedPeriod) return;

    const startDate = new Date();
    const endDate = addDays(startDate, selectedPeriod.days);

    try {
      await createGoal.mutateAsync({
        goal_type: goalType,
        target_value: parseInt(targetValue),
        period_start: format(startDate, 'yyyy-MM-dd'),
        period_end: format(endDate, 'yyyy-MM-dd'),
        current_value: 0,
      });
      onSuccess();
    } catch (error) {
      console.error('Errore nella creazione dell\'obiettivo:', error);
    }
  };

  const selectedGoalType = GOAL_TYPES.find(type => type.value === goalType);

  return (
    <form onSubmit={handleSubmit} className="space-y-educational-md">
      <div className="space-y-educational-xs">
        <Label htmlFor="goalType">Tipo di Obiettivo</Label>
        <Select value={goalType} onValueChange={setGoalType}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona il tipo di obiettivo" />
          </SelectTrigger>
          <SelectContent>
            {GOAL_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  {type.icon}
                  {type.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-educational-xs">
        <Label htmlFor="targetValue">
          Valore Target
          {selectedGoalType && (
            <span className="text-educational-small text-muted-foreground ml-1">
              ({selectedGoalType.label.toLowerCase()})
            </span>
          )}
        </Label>
        <Input
          id="targetValue"
          type="number"
          min="1"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          placeholder="Es. 5"
        />
      </div>

      <div className="space-y-educational-xs">
        <Label htmlFor="period">Periodo</Label>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger>
            <SelectValue placeholder="Seleziona il periodo" />
          </SelectTrigger>
          <SelectContent>
            {GOAL_PERIODS.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-educational-sm pt-educational-md">
        <Button 
          type="submit" 
          disabled={!goalType || !targetValue || !period || createGoal.isPending}
          className="flex-1"
        >
          {createGoal.isPending ? 'Creazione...' : 'Crea Obiettivo'}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annulla
        </Button>
      </div>
    </form>
  );
};
