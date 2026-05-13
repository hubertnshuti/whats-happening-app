"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Send, Trash2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/feedback";
import { useAuthStore } from "@/store/authStore";
import { commentService, type Comment } from "../service-comments";
import { formatRelative } from "@/lib/format";
import { routes } from "@/config/routes";
import { ApiException } from "@/lib/ApiException";

export function CommentsSection({ eventId }: { eventId: string }) {
  const user = useAuthStore((s) => s.user);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await commentService.list(eventId);
      setComments(data.content);
    } catch (err) {
      setError(err instanceof ApiException ? err.message : "Couldn't load comments");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || submitting) return;
    setSubmitting(true);
    try {
      const c = await commentService.create(eventId, draft.trim());
      setComments((prev) => [c, ...prev]);
      setDraft("");
    } catch {
      /* swallow — handled by toast later */
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(id: string) {
    const prev = comments;
    setComments((c) => c.filter((x) => x.id !== id));
    try {
      await commentService.delete(id);
    } catch {
      setComments(prev);
    }
  }

  return (
    <section className="space-y-5">
      <header className="flex items-center gap-2">
        <MessageCircle className="size-5 text-brand" />
        <h2 className="font-display text-xl font-bold tracking-tight">
          Comments {comments.length > 0 && <span className="nums text-fg-tertiary">· {comments.length}</span>}
        </h2>
      </header>

      {/* Composer */}
      {user ? (
        <form onSubmit={submit} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
          <Avatar src={user.profileImageUrl} name={user.fullName} size="md" />
          <div className="flex-1 space-y-3">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Share your thoughts about this event…"
              rows={2}
              className="w-full resize-none rounded-lg border border-line bg-surface-2 px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/15"
            />
            <div className="flex justify-end">
              <Button
                type="submit"
                size="sm"
                loading={submitting}
                disabled={!draft.trim()}
                leftIcon={<Send className="size-3.5" />}
              >
                Post
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <Card className="flex items-center justify-between gap-4 bg-surface-2">
          <p className="text-sm text-fg-secondary">
            <Link href={routes.login} className="font-semibold text-brand hover:underline">
              Sign in
            </Link>{" "}
            to join the conversation.
          </p>
        </Card>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="size-5 animate-spin text-fg-muted" />
        </div>
      ) : error ? (
        <p className="rounded-xl bg-danger-soft px-4 py-3 text-sm text-danger">{error}</p>
      ) : comments.length === 0 ? (
        <EmptyState
          icon={<MessageCircle className="size-7" />}
          title="No comments yet"
          description="Be the first to comment on this event."
        />
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => {
            const author = c.author ?? c.user;
            const isMine = user && author && author.id === user.id;
            return (
              <li key={c.id} className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4">
                <Avatar
                  src={author?.profileImageUrl ?? null}
                  name={author?.fullName ?? "Anonymous"}
                  size="md"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold">{author?.fullName ?? "Anonymous"}</span>
                    <span className="text-xs text-fg-tertiary">{formatRelative(c.createdAt)}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-fg-secondary whitespace-pre-wrap">
                    {c.content}
                  </p>
                </div>
                {isMine && (
                  <button
                    onClick={() => remove(c.id)}
                    className="rounded-md p-1.5 text-fg-muted transition hover:bg-danger-soft hover:text-danger"
                    aria-label="Delete comment"
                  >
                    <Trash2 className="size-4" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
