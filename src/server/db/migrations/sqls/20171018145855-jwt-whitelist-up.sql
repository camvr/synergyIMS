/* jwt-whitelist-up
 * 
 * This migration adds an auth schema, jwt whitelist table, as well as
 * a function and a trigger to clean up expired entries in the jwt-whitelist table.
 */

CREATE SCHEMA syn_auth;

CREATE TABLE syn_auth.jwt_whitelist
(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL
);

CREATE FUNCTION jwt_whitelist_clean_expired() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    DELETE FROM syn_auth.jwt_whitelist WHERE expires_at < NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER jwt_whitelist_clean_expired_trigger
    AFTER INSERT ON syn_auth.jwt_whitelist
    EXECUTE PROCEDURE jwt_whitelist_clean_expired();
