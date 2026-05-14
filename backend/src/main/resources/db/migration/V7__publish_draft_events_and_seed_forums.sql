-- Publish all existing DRAFT events so they appear publicly
UPDATE events SET status = 'PUBLISHED' WHERE status = 'DRAFT';

-- Create forums for published events that don't have one yet
INSERT INTO event_forums (id, event_id, status, member_count, last_activity_at, created_at)
SELECT gen_random_uuid(), e.id, 'ACTIVE', 1, NOW(), NOW()
FROM events e
WHERE NOT EXISTS (SELECT 1 FROM event_forums ef WHERE ef.event_id = e.id)
  AND e.status = 'PUBLISHED';

-- Add the event organizer as ADMIN member for each newly created forum
INSERT INTO forum_members (forum_id, user_id, role, notifications_enabled, joined_at)
SELECT ef.id, e.organizer_id, 'ADMIN', true, NOW()
FROM event_forums ef
JOIN events e ON e.id = ef.event_id
WHERE NOT EXISTS (
    SELECT 1 FROM forum_members fm WHERE fm.forum_id = ef.id AND fm.user_id = e.organizer_id
);
