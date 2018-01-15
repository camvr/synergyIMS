/* Initial Revision of Synergy IMS database */

CREATE TYPE access_level AS ENUM ('owner', 'admin', 'user');

CREATE SCHEMA syn_user;

CREATE TABLE syn_user.companies
(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    modified_at TIMESTAMP DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX companies_company_name_uindex ON syn_user.companies (company_name);

CREATE TABLE syn_user.users
(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    company_id BIGINT NOT NULL,
    account_type access_level DEFAULT 'user' NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) DEFAULT '' NOT NULL,
    employee_num INT,
    passhash VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    modified_at TIMESTAMP DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX users_email_uindex ON syn_user.users (email);
CREATE INDEX users_company_id_index ON syn_user.users (company_id);

CREATE TABLE syn_user.activity_log
(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    log_data TEXT NOT NULL
);
CREATE INDEX activity_log_user_id_index ON syn_user.activity_log (user_id);


CREATE SCHEMA syn_data;

CREATE TABLE syn_data.warehouses
(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    company_id BIGINT NOT NULL,
    warehouse_name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '' NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(255),
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    modified_at TIMESTAMP DEFAULT now() NOT NULL
);
CREATE INDEX warehouses_company_id_index ON syn_data.warehouses (company_id);

CREATE TABLE syn_data.categories
(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    company_id BIGINT NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '' NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    modified_at TIMESTAMP DEFAULT now() NOT NULL
);
CREATE INDEX categories_company_id_index ON syn_data.categories (company_id);

CREATE TABLE syn_data.brands
(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    company_id BIGINT NOT NULL,
    brand_name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '' NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    modified_at TIMESTAMP DEFAULT now() NOT NULL
);
CREATE INDEX brands_company_id_index ON syn_data.brands (company_id);

CREATE TABLE syn_data.products
(
    id BIGSERIAL PRIMARY KEY NOT NULL,
    company_id BIGINT NOT NULL,
    warehouse_id BIGINT DEFAULT 0 NOT NULL,
    category_id BIGINT DEFAULT 0 NOT NULL,
    brand_id BIGINT DEFAULT 0 NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '' NOT NULL,
    quantity INT DEFAULT 0 NOT NULL,
    price NUMERIC DEFAULT 0 NOT NULL,
    serial_num BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    modified_at TIMESTAMP DEFAULT now() NOT NULL
);
CREATE INDEX products_company_id_index ON syn_data.products (company_id);

