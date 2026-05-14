'use client';

import { useState } from 'react';
import { forumService } from '../service';
import type { QuestionResponse } from '../types';
import { Button } from '@/components/ui/Button';
import { HelpCircle, ChevronDown, ChevronUp, CheckCircle2, Send, Loader2 } from 'lucide-react';
import { formatRelative } from '@/lib/format';

interface Props {
  eventId: string;
  questions: QuestionResponse[];
  canAnswer?: boolean;
  isLoggedIn?: boolean;
  onQuestionAdded: (q: QuestionResponse) => void;
  onAnswered: (q: QuestionResponse) => void;
}

export function ForumQA({ eventId, questions, canAnswer, isLoggedIn, onQuestionAdded, onAnswered }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({});
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!text.trim()) return;
    setError(null);
    setSubmitting(true);
    try {
      const q = await forumService.askQuestion(eventId, text.trim());
      onQuestionAdded(q);
      setText('');
    } catch (e: any) {
      setError(e?.message ?? 'Could not submit question.');
    } finally {
      setSubmitting(false);
    }
  };

  const submitAnswer = async (questionId: string) => {
    const answer = answerTexts[questionId]?.trim();
    if (!answer) return;
    setAnsweringId(questionId);
    try {
      const q = await forumService.answerQuestion(questionId, answer);
      onAnswered(q);
      setAnswerTexts(prev => ({ ...prev, [questionId]: '' }));
    } catch {
      // silently ignore
    } finally {
      setAnsweringId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-surface overflow-hidden">
      <button
        onClick={() => setExpanded(p => !p)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-fg hover:bg-surface-2 transition-colors"
      >
        <span className="flex items-center gap-2">
          <HelpCircle className="size-4 text-brand" />
          Q&amp;A ({questions.length})
        </span>
        {expanded ? <ChevronUp className="size-4 text-fg-muted" /> : <ChevronDown className="size-4 text-fg-muted" />}
      </button>

      {expanded && (
        <div className="border-t border-line divide-y divide-line">
          {questions.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-fg-muted">No questions yet. Be the first to ask!</p>
          )}

          {questions.map(q => (
            <div key={q.id} className="px-4 py-3 space-y-2">
              <div className="flex items-start gap-2">
                <HelpCircle className="size-3.5 text-brand mt-1 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-fg">{q.question}</p>
                  <p className="text-xs text-fg-muted mt-0.5">{q.askerName} · {formatRelative(q.createdAt)}</p>
                </div>
              </div>

              {q.answer ? (
                <div className="ml-5 pl-3 border-l-2 border-brand/30 space-y-0.5">
                  <p className="text-sm text-fg-secondary">{q.answer}</p>
                  <p className="text-xs text-fg-muted">{q.answeredByName} · {q.answeredAt ? formatRelative(q.answeredAt) : ''}</p>
                </div>
              ) : canAnswer ? (
                <div className="ml-5 flex gap-2">
                  <input
                    value={answerTexts[q.id] ?? ''}
                    onChange={e => setAnswerTexts(prev => ({ ...prev, [q.id]: e.target.value }))}
                    placeholder="Type your answer…"
                    className="flex-1 text-sm px-3 py-1.5 rounded-lg bg-surface-2 border border-line text-fg placeholder:text-fg-muted focus:outline-none focus:border-brand"
                  />
                  <Button
                    variant="primary" size="sm"
                    onClick={() => submitAnswer(q.id)}
                    disabled={answeringId === q.id || !answerTexts[q.id]?.trim()}
                  >
                    {answeringId === q.id ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                  </Button>
                </div>
              ) : (
                <div className="ml-5 flex items-center gap-1 text-xs text-fg-muted">
                  <CheckCircle2 className="size-3" /> Awaiting organizer response
                </div>
              )}
            </div>
          ))}

          {isLoggedIn && (
            <div className="px-4 py-3 space-y-2">
              <div className="flex gap-2">
                <input
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && submit()}
                  placeholder="Ask a question…"
                  className="flex-1 text-sm px-3 py-2 rounded-lg bg-surface-2 border border-line text-fg placeholder:text-fg-muted focus:outline-none focus:border-brand"
                />
                <Button variant="primary" size="sm" onClick={submit} disabled={submitting || !text.trim()}>
                  {submitting ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
                </Button>
              </div>
              {error && <p className="text-xs text-danger">{error}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
