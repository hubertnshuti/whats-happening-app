CREATE TABLE event_saves (
                             user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                             event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
                             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             PRIMARY KEY (user_id, event_id)
);

CREATE TABLE event_likes (
                             user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                             event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
                             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             PRIMARY KEY (user_id, event_id)
);

CREATE TABLE event_reports (
                               id UUID PRIMARY KEY,
                               event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
                               reporter_id UUID NOT NULL REFERENCES users(id),
                               reason VARCHAR(50) NOT NULL,
                               details VARCHAR(1000),
                               status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                               reviewed_by UUID REFERENCES users(id),
                               reviewed_at TIMESTAMP,
                               created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               CONSTRAINT chk_report_status CHECK (status IN ('PENDING', 'REVIEWED', 'DISMISSED', 'ACTIONED')),
                               CONSTRAINT uq_event_reporter UNIQUE (event_id, reporter_id)
);

CREATE INDEX idx_event_saves_user ON event_saves(user_id);
CREATE INDEX idx_event_likes_event ON event_likes(event_id);
CREATE INDEX idx_event_reports_status ON event_reports(status);