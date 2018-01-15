/* Removes cascade deletion from each table */
ALTER TABLE syn_user.users DROP CONSTRAINT users_syn_user_companies_id_fk;
ALTER TABLE syn_user.permissions DROP CONSTRAINT permissions_syn_user_companies_id_fk;

ALTER TABLE syn_data.brands DROP CONSTRAINT brands_syn_user_companies_id_fk;
ALTER TABLE syn_data.categories DROP CONSTRAINT categories_syn_user_companies_id_fk;
ALTER TABLE syn_data.products DROP CONSTRAINT products_syn_user_companies_id_fk;
ALTER TABLE syn_data.warehouses DROP CONSTRAINT warehouses_syn_user_companies_id_fk;
ALTER TABLE syn_data.snapshots DROP CONSTRAINT snapshots_syn_user_companies_id_fk;
