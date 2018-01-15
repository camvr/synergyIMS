/* Adds table for inventory snapshots */

CREATE TABLE syn_data.snapshots
(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    company_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    inventory JSON NOT NULL
);
CREATE INDEX snapshots_company_id_index ON syn_data.snapshots (company_id);
