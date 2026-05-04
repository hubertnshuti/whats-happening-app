CREATE TABLE users (
                       id UUID PRIMARY KEY,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       full_name VARCHAR(150) NOT NULL,
                       phone_number VARCHAR(30) UNIQUE,
                       account_status VARCHAR(20) NOT NULL,
                       email_verified BOOLEAN DEFAULT FALSE,
                       created_at TIMESTAMP NOT NULL,
                       updated_at TIMESTAMP NOT NULL
);

CREATE TABLE roles (
                       id UUID PRIMARY KEY,
                       name VARCHAR(50) UNIQUE NOT NULL,
                       description VARCHAR(255)
);

CREATE TABLE user_roles (
                            user_id UUID NOT NULL,
                            role_id UUID NOT NULL,
                            PRIMARY KEY (user_id, role_id),
                            FOREIGN KEY (user_id) REFERENCES users(id),
                            FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE refresh_tokens (
                                id UUID PRIMARY KEY,
                                user_id UUID NOT NULL,
                                token TEXT UNIQUE NOT NULL,
                                expires_at TIMESTAMP NOT NULL,
                                revoked BOOLEAN DEFAULT FALSE,
                                created_at TIMESTAMP NOT NULL,
                                FOREIGN KEY (user_id) REFERENCES users(id)
);