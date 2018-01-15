/* Create Permissions table for storing permissions */
CREATE TABLE syn_user.permissions
(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    company_id BIGINT NOT NULL,
    perm JSON NOT NULL,
    modified_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX permissions_company_id_uindex ON syn_user.permissions (company_id);
