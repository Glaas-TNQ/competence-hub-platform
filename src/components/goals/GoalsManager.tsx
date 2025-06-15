
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
import { format, addDays, addWeeks, addMonths } from 'date-fns';
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
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  const activeGoals = goals?.filter(goal => !goal.is_completed) || [];
  const completedGoals = goals?.filter(goal => goal.is_completed) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">I Miei Obiettivi</h1>
          <p className="text-gray-600">Crea e monitora i tuoi obiettivi di apprendimento</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nuovo Obiettivo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crea Nuovo Obiettivo</DialogTitle>
            </DialogHeader>
            <CreateGoalForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Obiettivi Attivi */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Obiettivi Attivi</h2>
        {activeGoals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun obiettivo attivo</h3>
              <p className="text-gray-600 text-center mb-4">
                Crea il tuo primo obiettivo per iniziare a monitorare i progressi!
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Crea Primo Obiettivo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Obiettivi Completati */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Obiettivi Completati</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
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
    <Card className={`relative ${goal.is_completed ? 'bg-green-50 border-green-200' : isExpired ? 'bg-red-50 border-red-200' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {goalType?.icon}
            <CardTitle className="text-sm font-medium">
              {goalType?.label}
            </CardTitle>
          </div>
          {goal.is_completed && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progresso</span>
            <span className="font-medium">
              {goal.current_value} / {goal.target_value}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-gray-500 text-center">
            {progress.toFixed(0)}% completato
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Scade: {format(new Date(goal.period_end), 'dd MMM yyyy', { locale: it })}
          </span>
          {isExpired && !goal.is_completed && (
            <Badge variant="destructive" className="text-xs">
              Scaduto
            </Badge>
          )}
          {goal.is_completed && (
            <Badge variant="default" className="text-xs bg-green-600">
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
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

      <div className="space-y-2">
        <Label htmlFor="targetValue">
          Valore Target
          {selectedGoalType && (
            <span className="text-sm text-gray-500 ml-1">
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

      <div className="space-y-2">
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

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={!goalType || !targetValue || !period || createGoal.isPending}>
          {createGoal.isPending ? 'Creazione...' : 'Crea Obiettivo'}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          Annulla
        </Button>
      </div>
    </form>
  );
};
