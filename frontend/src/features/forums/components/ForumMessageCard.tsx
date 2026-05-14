'use client';

import { useState } from 'react';
import { formatRelative } from '@/lib/format';
import { Avatar } from '@/components/ui/Avatar';
import { Chip } from '@/components/ui/Chip';
import { MessageResponse } from '../types';
import { forumService } from '../service';
import { AlertCircle, Bell, CalendarClock, Info, CheckCircle2, MapPin, SmilePlus } from 'lucide-react';

const QUICK_EMOJIS = ['👍', '❤️', '🔥', '👏', '😮'];

interface Props {
  message: MessageResponse;
  eventId: string;
  canReact?: boolean;
}

const getTypeConfig = (type: MessageResponse['messageType']) => {
  switch (type) {
    case 'IMPORTANT': case 'CANCELLED': return { variant: 'danger' as const, icon: AlertCircle, label: type };
    case 'REMINDER': case 'UPDATE': return { variant: 'warning' as const, icon: Bell, label: type };
    case 'VENUE_CHANGE': return { variant: 'warning' as const, icon: MapPin, label: 'VENUE CHANGE' };
    case 'TIME_CHANGE': return { variant: 'warning' as const, icon: CalendarClock, label: 'TIME CHANGE' };
    case 'RESOURCE': case 'POST_EVENT': return { variant: 'info' as const, icon: Info, label: type.replace('_', ' ') };
    default: return { variant: 'default' as const, icon: CheckCircle2, label: 'GENERAL' };
  }
};

export function ForumMessageCard({ message, eventId, canReact }: Props) {
  const config = getTypeConfig(message.messageType);
  const Icon = config.icon;
  const [reactions, setReactions] = useState<Record<string, number>>(message.reactions ?? {});
  const [showPicker, setShowPicker] = useState(false);
  const [pending, setPending] = useState(false);

  const react = async (emoji: string) => {
    if (pending || !canReact) return;
    setPending(true);
    setShowPicker(false);
    try {
      const updated = await forumService.reactToMessage(message.id, emoji);
      setReactions(updated as Record<string, number>);
    } catch {
      // optimistic — silently ignore
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-surface border border-line hover:shadow-sm transition-all duration-200">
      <Avatar src={undefined} name={message.authorName} size="md" />
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-bold text-fg text-sm">{message.authorName}</span>
            <span className="text-xs text-fg-muted">{formatRelative(message.createdAt)}</span>
          </div>
          {message.messageType !== 'GENERAL' && (
            <Chip variant={config.variant} leftIcon={<Icon className="size-3" />}>
              <span className="text-[10px] uppercase font-bold">{config.label}</span>
            </Chip>
          )}
        </div>
        <p className="text-fg-secondary text-sm whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {Object.entries(reactions).map(([emoji, count]) => (
            <button
              key={emoji}
              onClick={() => react(emoji)}
              disabled={!canReact || pending}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-surface-2 hover:bg-surface-3 border border-line text-xs transition-colors disabled:opacity-60"
            >
              <span>{emoji}</span>
              <span className="text-fg-muted font-medium">{count}</span>
            </button>
          ))}

          {canReact && (
            <div className="relative">
              <button
                onClick={() => setShowPicker(p => !p)}
                className="flex items-center gap-1 px-2 py-1 rounded-pill bg-surface-2 hover:bg-surface-3 border border-line text-xs text-fg-muted transition-colors"
              >
                <SmilePlus className="size-3.5" />
              </button>
              {showPicker && (
                <div className="absolute bottom-full mb-1 left-0 flex gap-1 p-2 bg-surface border border-line rounded-xl shadow-lg z-10">
                  {QUICK_EMOJIS.map(e => (
                    <button
                      key={e}
                      onClick={() => react(e)}
                      className="text-lg hover:scale-125 transition-transform"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
