-- One forum per event (auto-created when event is published)
CREATE TABLE event_forums (
                              id UUID PRIMARY KEY,
                              event_id UUID NOT NULL UNIQUE REFERENCES events(id) ON DELETE CASCADE,
                              status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                              member_count INTEGER NOT NULL DEFAULT 0,
                              last_activity_at TIMESTAMP,
                              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                              CONSTRAINT chk_forum_status CHECK (status IN ('ACTIVE', 'READ_ONLY', 'ARCHIVED'))
);

-- Users who joined the forum
CREATE TABLE forum_members (
                               forum_id UUID NOT NULL REFERENCES event_forums(id) ON DELETE CASCADE,
                               user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                               role VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
                               notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
                               joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               PRIMARY KEY (forum_id, user_id),
                               CONSTRAINT chk_member_role CHECK (role IN ('MEMBER', 'ADMIN'))
);

-- Forum messages (admin-only for MVP)
CREATE TABLE forum_messages (
                                id UUID PRIMARY KEY,
                                forum_id UUID NOT NULL REFERENCES event_forums(id) ON DELETE CASCADE,
                                author_id UUID NOT NULL REFERENCES users(id),
                                message_type VARCHAR(30) NOT NULL DEFAULT 'GENERAL',
                                content TEXT NOT NULL,
                                is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
                                edited_at TIMESTAMP,
                                deleted_at TIMESTAMP,
                                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                CONSTRAINT chk_message_type CHECK (message_type IN ('GENERAL', 'REMINDER', 'VENUE_CHANGE', 'TIME_CHANGE', 'CANCELLATION', 'IMPORTANT'))
);

-- Emoji reactions on messages
CREATE TABLE message_reactions (
                                   message_id UUID NOT NULL REFERENCES forum_messages(id) ON DELETE CASCADE,
                                   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                   emoji VARCHAR(16) NOT NULL,
                                   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                   PRIMARY KEY (message_id, user_id, emoji)
);

-- Questions from members to organizer
CREATE TABLE forum_questions (
                                 id UUID PRIMARY KEY,
                                 forum_id UUID NOT NULL REFERENCES event_forums(id) ON DELETE CASCADE,
                                 asker_id UUID NOT NULL REFERENCES users(id),
                                 question TEXT NOT NULL,
                                 answer TEXT,
                                 answered_by UUID REFERENCES users(id),
                                 answered_at TIMESTAMP,
                                 status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                                 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 CONSTRAINT chk_question_status CHECK (status IN ('PENDING', 'ANSWERED', 'DISMISSED'))
);

CREATE INDEX idx_forum_messages_forum ON forum_messages(forum_id, created_at DESC);
CREATE INDEX idx_forum_questions_forum ON forum_questions(forum_id, created_at DESC);
CREATE INDEX idx_forum_members_user ON forum_members(user_id);