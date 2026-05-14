'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { forumService } from '../../service';
import { MessageType } from '../../types';
import { Send, Loader2 } from 'lucide-react';

interface Props {
  eventId: string;
  onPosted: () => void;
}

export function ForumComposer({ eventId, onPosted }: Props) {
  const [content, setContent] = useState('');
  const [type, setType] = useState<MessageType>('GENERAL');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    try {
      setIsSubmitting(true);
      await forumService.postMessage(eventId, content.trim(), type);
      setContent('');
      setType('GENERAL');
      onPosted();
    } catch (err) {
      console.error(err);
      // Let global error handler or toast catch it
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-surface border border-line-strong shadow-sm space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Post an official announcement..."
        className="w-full bg-transparent text-fg placeholder:text-fg-muted outline-none resize-none text-sm min-h-[80px]"
      />
      <div className="flex items-center justify-between border-t border-line-subtle pt-3">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as MessageType)}
          className="bg-surface-2 border border-line text-fg text-xs rounded-lg px-3 py-1.5 outline-none focus:border-brand transition-colors"
        >
          <option value="GENERAL">General</option>
          <option value="IMPORTANT">Important</option>
          <option value="REMINDER">Reminder</option>
          <option value="UPDATE">Update</option>
          <option value="RESOURCE">Resource</option>
        </select>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={handleSubmit} 
          disabled={!content.trim() || isSubmitting}
        >
          {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4 mr-1.5" />}
          Post
        </Button>
      </div>
    </div>
  );
}