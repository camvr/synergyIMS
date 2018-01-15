DELETE FROM syn_data.products;
DELETE FROM syn_data.brands;
DELETE FROM syn_data.categories;
DELETE FROM syn_data.warehouses;
DELETE FROM syn_user.users;
DELETE FROM syn_user.companies;
DELETE FROM syn_user.activity_log;
DELETE FROM syn_user.permissions;
DELETE FROM syn_auth.jwt_whitelist;

ALTER SEQUENCE syn_data.brands_id_seq RESTART;
ALTER SEQUENCE syn_data.categories_id_seq RESTART;
ALTER SEQUENCE products_id_seq RESTART;
ALTER SEQUENCE syn_data.warehouses_id_seq RESTART;
ALTER SEQUENCE syn_user.users_id_seq RESTART;
ALTER SEQUENCE syn_user.companies_id_seq RESTART;
ALTER SEQUENCE syn_user.activity_log_id_seq RESTART;
ALTER SEQUENCE syn_user.permissions_id_seq RESTART;
ALTER SEQUENCE syn_auth.jwt_whitelist_id_seq RESTART;
