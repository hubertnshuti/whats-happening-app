-- Grants ADMIN role to demo admin account (admin@demo.com / Admin1234!)
-- Safe: ON CONFLICT DO NOTHING prevents duplicate errors on re-run
INSERT INTO user_roles (user_id, role_id)
SELECT '0d15373b-c709-41f9-ba8e-a123ca7a91bc'::uuid, id
FROM roles WHERE name = 'ADMIN'
ON CONFLICT DO NOTHING;

-- Also grant SUPER_ADMIN for full access during demo
INSERT INTO user_roles (user_id, role_id)
SELECT '0d15373b-c709-41f9-ba8e-a123ca7a91bc'::uuid, id
FROM roles WHERE name = 'SUPER_ADMIN'
ON CONFLICT DO NOTHING;

-- Mark email as verified so no verification gate blocks login
UPDATE users SET email_verified = true WHERE id = '0d15373b-c709-41f9-ba8e-a123ca7a91bc';
