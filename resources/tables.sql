CREATE TABLE companies
(
	id int NOT NULL AUTO_INCREMENT,
	name varchar(255),
	PRIMARY KEY (id)
)


CREATE TABLE operations
(
	id int NOT NULL AUTO_INCREMENT,
	company int,
	type varchar(255),
	status varchar(255),
	PRIMARY KEY (id),
	FOREIGN KEY (company) REFERENCES companies(id)
)

CREATE TABLE categories
(
	id int NOT NULL AUTO_INCREMENT,
	name varchar(255) NOT NULL,
	PRIMARY KEY (id)
)

CREATE TABLE op_cat
(
	category int NOT NULL,
	operation int NOT NULL,
	PRIMARY KEY (category, operation),
	FOREIGN KEY (category) REFERENCES categories(id),
    FOREIGN KEY (operation) REFERENCES operations(id)
)