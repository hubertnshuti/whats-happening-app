'use client';

import { formatRelative } from '@/lib/format';
import { Avatar } from '@/components/ui/Avatar';
import { Chip } from '@/components/ui/Chip';
import { MessageResponse } from '../../types';
import { AlertCircle, Bell, CalendarClock, Info, CheckCircle2 } from 'lucide-react';

interface Props {
  message: MessageResponse;
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

export function ForumMessageCard({ message }: Props) {
  const config = getTypeConfig(message.messageType);
  const Icon = config.icon;

  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-surface border border-line hover:shadow-sm transition-all duration-200">
      <Avatar 
        src={undefined} // Removed profileImageUrl as per CONTRACT.md
        fallback={message.author.fullName.substring(0, 2).toUpperCase()} 
        size="md" 
      />
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-bold text-fg text-sm">{message.author.fullName}</span>
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
        
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {Object.entries(message.reactions).map(([emoji, count]) => (
              <button key={emoji} className="flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-surface-2 hover:bg-surface-3 border border-line text-xs transition-colors">
                <span>{emoji}</span>
                <span className="text-fg-muted font-medium nums">{count as React.ReactNode}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}