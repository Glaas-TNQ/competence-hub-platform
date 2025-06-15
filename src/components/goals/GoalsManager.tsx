
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
import { Plus, Target, TrendingUp, CheckCircle } from 'lucide-react';
import { format, addDays, isValid } from 'date-fns';
import { useTranslation } from '@/contexts/LanguageContext';

const GOAL_TYPES = [
  { value: 'courses_completed', label: 'goals.types.courses_completed', icon: <Target className="h-4 w-4" /> },
  { value: 'study_days', label: 'goals.types.study_days', icon: <Target className="h-4 w-4" /> },
  { value: 'points_earned', label: 'goals.types.points_earned', icon: <TrendingUp className="h-4 w-4" /> },
];

export const GoalsManager: React.FC = () => {
  const { t } = useTranslation();
  const { data: goals, isLoading } = useUserGoals();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isValid(date)) {
        return format(date, 'MMM dd, yyyy');
      }
      return 'No end date';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

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
            {t('goals.myGoals')}
          </h1>
          <p className="text-educational-body text-muted-foreground">
            {t('goals.createAndTrack')}
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="flex items-center gap-2 hover-educational">
              <Plus className="h-5 w-5" />
              {t('goals.newGoal')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-educational-h2">{t('goals.createNewGoal')}</DialogTitle>
            </DialogHeader>
            <CreateGoalForm onSuccess={() => setIsCreateDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Goals */}
      <section className="section-educational">
        <h2 className="heading-educational-section text-accent-foreground mb-educational-lg">
          {t('goals.activeGoals')}
        </h2>
        {activeGoals.length > 0 ? (
          <div className="grid gap-educational-md md:grid-cols-2 lg:grid-cols-3">
            {activeGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} formatDate={formatDate} />
            ))}
          </div>
        ) : (
          <Card className="hover-educational">
            <CardContent className="flex flex-col items-center justify-center py-educational-5xl">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-educational-lg">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-educational-h3 font-semibold text-accent-foreground mb-educational-sm">
                {t('goals.noActiveGoals')}
              </h3>
              <p className="text-educational-body text-muted-foreground text-center mb-educational-lg max-w-sm">
                {t('goals.noActiveGoalsDesc')}
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="hover-educational"
              >
                {t('goals.createFirstGoal')}
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <section className="section-educational">
          <h2 className="heading-educational-section text-accent-foreground mb-educational-lg">
            {t('goals.completedGoals')}
          </h2>
          <div className="grid gap-educational-md md:grid-cols-2 lg:grid-cols-3">
            {completedGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} formatDate={formatDate} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

interface GoalCardProps {
  goal: any;
  formatDate: (dateString: string) => string;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, formatDate }) => {
  const { t } = useTranslation();
  const goalType = GOAL_TYPES.find(type => type.value === goal.goal_type);
  const progress = Math.min((goal.current_value / goal.target_value) * 100, 100);

  return (
    <Card className={`hover-educational relative ${
      goal.is_completed ? 'bg-success/5 border-success/20' : ''
    }`}>
      <CardHeader className="pb-educational-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-educational-sm">
            <div className="w-8 h-8 bg-primary/10 rounded-educational flex items-center justify-center">
              {goalType?.icon}
            </div>
            <CardTitle className="text-educational-h4 font-medium">
              {t(goalType?.label || 'goals.types.courses_completed')}
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
            <span className="text-muted-foreground">{t('goals.progress')}</span>
            <span className="font-medium text-accent-foreground">
              {goal.current_value} / {goal.target_value}
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="text-educational-caption text-muted-foreground text-center">
            {progress.toFixed(0)}% {t('goals.completed')}
          </div>
        </div>

        <div className="text-educational-caption text-muted-foreground">
          {t('goals.ends')}: {formatDate(goal.period_end)}
        </div>

        <div className="flex items-center justify-center">
          {goal.is_completed && (
            <Badge className="text-educational-caption bg-success hover:bg-success/90">
              {t('goals.completed')}
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
  const { t } = useTranslation();
  const [goalType, setGoalType] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const { createGoal } = useUserGoals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goalType || !targetValue) return;

    const startDate = new Date();
    const endDate = addDays(startDate, 30); // Default 30 days period

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
      console.error('Error creating goal:', error);
    }
  };

  const selectedGoalType = GOAL_TYPES.find(type => type.value === goalType);

  return (
    <form onSubmit={handleSubmit} className="space-y-educational-md">
      <div className="space-y-educational-xs">
        <Label htmlFor="goalType">{t('goals.goalType')}</Label>
        <Select value={goalType} onValueChange={setGoalType}>
          <SelectTrigger>
            <SelectValue placeholder={t('goals.selectGoalType')} />
          </SelectTrigger>
          <SelectContent>
            {GOAL_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  {type.icon}
                  {t(type.label)}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-educational-xs">
        <Label htmlFor="targetValue">
          {t('goals.targetValue')}
          {selectedGoalType && (
            <span className="text-educational-small text-muted-foreground ml-1">
              ({t(selectedGoalType.label).toLowerCase()})
            </span>
          )}
        </Label>
        <Input
          id="targetValue"
          type="number"
          min="1"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          placeholder={t('goals.targetValuePlaceholder')}
        />
      </div>

      <div className="flex gap-educational-sm pt-educational-md">
        <Button 
          type="submit" 
          disabled={!goalType || !targetValue || createGoal.isPending}
          className="flex-1"
        >
          {createGoal.isPending ? t('goals.creating') : t('goals.createGoal')}
        </Button>
        <Button type="button" variant="outline" onClick={onSuccess}>
          {t('common.cancel')}
        </Button>
      </div>
    </form>
  );
};
