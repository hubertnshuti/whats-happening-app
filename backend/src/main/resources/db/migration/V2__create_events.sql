-- Categories
CREATE TABLE categories (
                            id UUID PRIMARY KEY,
                            name VARCHAR(80) UNIQUE NOT NULL,
                            slug VARCHAR(80) UNIQUE NOT NULL,
                            description VARCHAR(255),
                            icon VARCHAR(80),
                            active BOOLEAN NOT NULL DEFAULT TRUE,
                            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Locations (reusable places)
CREATE TABLE locations (
                           id UUID PRIMARY KEY,
                           name VARCHAR(150) NOT NULL,
                           address VARCHAR(255),
                           city VARCHAR(100),
                           country VARCHAR(100) DEFAULT 'Rwanda',
                           latitude DECIMAL(10, 7),
                           longitude DECIMAL(10, 7),
                           created_by UUID REFERENCES users(id),
                           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Events
CREATE TABLE events (
                        id UUID PRIMARY KEY,
                        title VARCHAR(200) NOT NULL,
                        slug VARCHAR(250) UNIQUE NOT NULL,
                        description TEXT NOT NULL,
                        short_description VARCHAR(500),
                        organizer_id UUID NOT NULL REFERENCES users(id),
                        category_id UUID NOT NULL REFERENCES categories(id),
                        location_id UUID REFERENCES locations(id),
                        custom_location_text VARCHAR(255),
                        start_at TIMESTAMP NOT NULL,
                        end_at TIMESTAMP NOT NULL,
                        cover_image_url VARCHAR(500),
                        status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
                        capacity INTEGER,
                        is_free BOOLEAN NOT NULL DEFAULT TRUE,
                        price_info VARCHAR(255),
                        external_url VARCHAR(500),
                        view_count BIGINT NOT NULL DEFAULT 0,
                        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT chk_event_dates CHECK (end_at > start_at),
                        CONSTRAINT chk_event_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'ONGOING', 'COMPLETED', 'CANCELLED'))
);

-- Event media gallery (extra images beyond the cover)
CREATE TABLE event_media (
                             id UUID PRIMARY KEY,
                             event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
                             url VARCHAR(500) NOT NULL,
                             media_type VARCHAR(20) NOT NULL DEFAULT 'IMAGE',
                             display_order INTEGER NOT NULL DEFAULT 0,
                             created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             CONSTRAINT chk_media_type CHECK (media_type IN ('IMAGE', 'VIDEO'))
);

-- Indexes (so queries stay fast as data grows)
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_start_at ON events(start_at);
CREATE INDEX idx_events_category_id ON events(category_id);
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_event_media_event_id ON event_media(event_id);

-- Seed default categories
INSERT INTO categories (id, name, slug, description, icon) VALUES
                                                               (gen_random_uuid(), 'Workshop', 'workshop', 'Hands-on learning sessions', 'wrench'),
                                                               (gen_random_uuid(), 'Talk', 'talk', 'Lectures, panels, and discussions', 'mic'),
                                                               (gen_random_uuid(), 'Sports', 'sports', 'Matches, tournaments, fitness', 'trophy'),
                                                               (gen_random_uuid(), 'Academic', 'academic', 'Classes, study groups, exams', 'book'),
                                                               (gen_random_uuid(), 'Club', 'club', 'Student club activities', 'users'),
                                                               (gen_random_uuid(), 'Announcement', 'announcement', 'Important campus or community news', 'megaphone'),
                                                               (gen_random_uuid(), 'Concert', 'concert', 'Music and performances', 'music'),
                                                               (gen_random_uuid(), 'Conference', 'conference', 'Multi-session professional events', 'presentation'),
                                                               (gen_random_uuid(), 'Other', 'other', 'Anything else', 'tag');