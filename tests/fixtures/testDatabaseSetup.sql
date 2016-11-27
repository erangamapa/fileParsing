USE companyAppTest;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE companies;
TRUNCATE operations;
TRUNCATE categories;
TRUNCATE op_cat;

SET FOREIGN_KEY_CHECKS = 1;


INSERT INTO companies
    (id,name)
VALUES
    (1,'google'),
    (2,'yahoo'),
    (3,'apple'),
    (4,'ibm'),
    (5,'samsung'),
    (6,'facebook');

INSERT INTO categories
    (id,name)
VALUES
    (1,'network'),
    (2,'bigdata'),
    (3,'hardware'),
    (4,'social'),
    (5,'finance'),
    (6,'electronics'),
    (7,'phones'),
    (8,'computers'),
    (9,'search');

INSERT INTO operations
    (id, company, type, status)
VALUES
    (1,1, 'research', 'approved'),
    (2,2, 'delivery', 'rejected'),
    (3,4, 'service', 'pending'),
    (4,1, 'replacement', 'finished'),
    (5,5, 'access', 'confirmed'),
    (6,5, 'service', 'rejected'),
    (7,4, 'replacement', 'approved'),
    (8,6, 'maintenance', 'finish'),
    (9,2, 'access', 'confirmed'),
    (10,3, 'access', 'rejected'),
    (11,1, 'research', 'pending');

INSERT INTO op_cat
    (category,operation)
VALUES
    (1,3),
    (2,1),
    (1,8),
    (5,9),
    (4,11),
    (8,8),
    (1,1),
    (4,3),
    (2,7),
    (6,5),
    (3,6),
    (9,2),
    (5,4),
    (6,10),
    (7,10),
    (4,2);