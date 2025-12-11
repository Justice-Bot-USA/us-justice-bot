import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, ListTodo } from 'lucide-react';
import type { JourneyTask } from '@/hooks/useLegalJourney';

interface TaskChecklistProps {
  tasks: JourneyTask[];
  stepId: string;
  onToggle: (taskId: string) => void;
  onAddTask: (stepId: string, title: string) => void;
}

const priorityColors = {
  low: 'bg-slate-500/10 text-slate-600 dark:text-slate-400',
  medium: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  high: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  urgent: 'bg-red-500/10 text-red-600 dark:text-red-400'
};

export function TaskChecklist({ tasks, stepId, onToggle, onAddTask }: TaskChecklistProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(stepId, newTaskTitle.trim());
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  const completedCount = tasks.filter(t => t.is_completed).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTodo className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Checklist</span>
          {tasks.length > 0 && (
            <span className="text-xs text-muted-foreground">
              ({completedCount}/{tasks.length})
            </span>
          )}
        </div>
        {!isAdding && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsAdding(true)}
            className="h-7 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Task
          </Button>
        )}
      </div>

      {tasks.length > 0 && (
        <div className="space-y-2">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`flex items-center gap-3 p-2 rounded-lg border transition-colors ${
                task.is_completed ? 'bg-muted/30 border-transparent' : 'bg-background border-border hover:bg-muted/50'
              }`}
            >
              <Checkbox 
                checked={task.is_completed}
                onCheckedChange={() => onToggle(task.id)}
                className="h-5 w-5"
              />
              <span className={`flex-1 text-sm ${task.is_completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </span>
              <Badge variant="outline" className={`text-xs ${priorityColors[task.priority]}`}>
                {task.priority}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {tasks.length === 0 && !isAdding && (
        <p className="text-sm text-muted-foreground italic">No tasks yet. Add tasks to track your progress.</p>
      )}

      {isAdding && (
        <div className="flex gap-2">
          <Input
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task description..."
            className="text-sm"
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            autoFocus
          />
          <Button size="sm" onClick={handleAddTask}>Add</Button>
          <Button size="sm" variant="ghost" onClick={() => { setIsAdding(false); setNewTaskTitle(''); }}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
