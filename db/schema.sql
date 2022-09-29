DROP DATABASE IF EXISTS staff_db;
CREATE DATABASE staff_db;
 
USE staff_db;

CREATE TABLE department (
    id INT AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(30),
    PRIMARY KEY(id)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT NOT NULL,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    department_id INT,
    FOREIGN KEY department_id
    REFERENCES department(id)
    PRIMARY KEY(id)
) ;

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT, 
    manager_id INT,
    FOREIGN KEY role_id
    REFERENCES role(id)
    FOREIGN KEY manager_id
    REFERENCES employee(id)
    PRIMARY KEY(id)
);