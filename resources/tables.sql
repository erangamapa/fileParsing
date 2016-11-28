CREATE DATABASE IF NOT EXISTS `companyApp`;

USE `companyApp`;

CREATE TABLE IF NOT EXISTS `companies`
(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `operations`
(
    id int NOT NULL AUTO_INCREMENT,
    company int,
    type varchar(255),
    status varchar(255),
    PRIMARY KEY (id),
    FOREIGN KEY (company) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS `categories`
(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS `op_cat`
(
    category int NOT NULL,
    operation int NOT NULL,
    PRIMARY KEY (category, operation),
    FOREIGN KEY (category) REFERENCES categories(id),
    FOREIGN KEY (operation) REFERENCES operations(id)
);