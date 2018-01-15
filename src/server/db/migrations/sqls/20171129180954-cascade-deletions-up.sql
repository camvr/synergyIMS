/* Add cascade deletion on company ID */
ALTER TABLE syn_user.users
ADD CONSTRAINT users_syn_user_companies_id_fk
FOREIGN KEY (company_id) REFERENCES syn_user.companies (id) ON DELETE CASCADE;

ALTER TABLE syn_user.permissions
ADD CONSTRAINT permissions_syn_user_companies_id_fk
FOREIGN KEY (company_id) REFERENCES syn_user.companies (id) ON DELETE CASCADE;


ALTER TABLE syn_data.brands
ADD CONSTRAINT brands_syn_user_companies_id_fk
FOREIGN KEY (company_id) REFERENCES syn_user.companies (id) ON DELETE CASCADE;

ALTER TABLE syn_data.categories
ADD CONSTRAINT categories_syn_user_companies_id_fk
FOREIGN KEY (company_id) REFERENCES syn_user.companies (id) ON DELETE CASCADE;

ALTER TABLE syn_data.products
ADD CONSTRAINT products_syn_user_companies_id_fk
FOREIGN KEY (company_id) REFERENCES syn_user.companies (id) ON DELETE CASCADE;

ALTER TABLE syn_data.warehouses
ADD CONSTRAINT warehouses_syn_user_companies_id_fk
FOREIGN KEY (company_id) REFERENCES syn_user.companies (id) ON DELETE CASCADE;

ALTER TABLE syn_data.snapshots
ADD CONSTRAINT snapshots_syn_user_companies_id_fk
FOREIGN KEY (company_id) REFERENCES syn_user.companies (id) ON DELETE CASCADE;
