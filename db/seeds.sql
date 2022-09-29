
USE staff_db;

INSERT INTO department(department_name)
VALUES("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO role(title, salary, department_id)
VALUES("Sales Lead", 100000, 1),
    ("Sales Associate", 80000, 1),
    ("Lead Engineer", 150000, 2),
    ("Software Engineer", 120000, 2),
    ("Account Manager", 150000, 3),
    ("Accountant", 125000, 3),
    ("Legal Team Lead", 250000, 4),
    ("Lawyer", 190000, 4);


INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES("Tom", "Hardy", 1, 1),
    ("Luke", "Skywalker", 1, null),
    ("Rich", "Price", 2, 2),
    
    ("Bruce", "Wayne", 2, null),
    ("Tom", "Hill", 3, 3),
    ("Sauron", "Jenkins", 3, null),
    ("Geralt", "Rivia", 4, 4),
    ("Timmy", "Turner", 4, null);