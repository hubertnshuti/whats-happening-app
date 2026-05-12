CREATE TABLE notifications (
                               id UUID PRIMARY KEY,
                               recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                               type VARCHAR(50) NOT NULL,
                               title VARCHAR(200) NOT NULL,
                               body VARCHAR(1000),
                               link_url VARCHAR(500),
                               related_event_id UUID REFERENCES events(id) ON DELETE CASCADE,
                               is_read BOOLEAN NOT NULL DEFAULT FALSE,
                               read_at TIMESTAMP,
                               created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               CONSTRAINT chk_notification_type CHECK (type IN (
                                                                                'EVENT_PUBLISHED', 'EVENT_REMINDER', 'EVENT_UPDATED', 'EVENT_CANCELLED',
                                                                                'FORUM_MESSAGE', 'FORUM_QUESTION_ANSWERED',
                                                                                'SYSTEM'
                                   ))
);

CREATE INDEX idx_notifications_recipient ON notifications(recipient_id, is_read, created_at DESC);