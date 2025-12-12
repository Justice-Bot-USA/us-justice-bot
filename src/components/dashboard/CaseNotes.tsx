import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Edit2 } from 'lucide-react';

interface CaseNotesProps {
  notes: string | null;
  onSave: (notes: string) => Promise<void>;
  disabled?: boolean;
}

export function CaseNotes({ notes, onSave, disabled }: CaseNotesProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(notes || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(notes || '');
  }, [notes]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(value);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">Case Notes</h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            disabled={disabled}
            className="h-7 px-2"
          >
            <Edit2 className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
        </div>
        <div className="min-h-[80px] p-3 rounded-md bg-muted/50 border border-border">
          {notes ? (
            <p className="text-sm text-foreground whitespace-pre-wrap">{notes}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">No notes added yet. Click edit to add notes.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">Case Notes</h4>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setValue(notes || '');
              setIsEditing(false);
            }}
            className="h-7 px-2"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="h-7 px-2"
          >
            <Save className="h-3.5 w-3.5 mr-1" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add notes about this case..."
        className="min-h-[120px] resize-none"
        autoFocus
      />
    </div>
  );
}
