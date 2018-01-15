/* jwt-whitelist-down
 * 
 * This migration removes:
 *   - The syn_auth schema
 *   - The jwt_whitelist table
 *   - The jwt_whitelist_clean_expired() function
 *   - The jwt_whitelist_clean_expired_trigger trigger
 */

DROP FUNCTION IF EXISTS jwt_whitelist_clean_expired();

DROP TRIGGER IF EXISTS jwt_whitelist_clean_expired_trigger;

DROP TABLE syn_auth.jwt_whitelist;

DROP SCHEMA syn_auth;
