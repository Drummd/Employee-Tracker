const inquirer = require('inquirer');
const express = require('express');
const mysql = require('mysql2');
 require('console.table');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'mark1124',
    database: 'staff_db'
  },
  console.log(`Connected to the staff_db database.`)
);

db.connect(err => {
  if (err) throw err;
  console.log('Running Program');
  employeeTrack()
})

let employeeTrack = function () {
  inquirer.prompt([
    {
      type: 'list',
      name: 'prompt',
      message: 'What would you like to do?',
      choices: ['View All Employees', 'View All Departments', 'View All Roles', 'Add Employees', 'Add Department', 'Add Role', 'Update Employee Role', 'Quit Program']
    }
  ]).then((answers) => {
    //should show Employee table ---------------------
    if (answers.prompt === 'View All Employees') {
      db.query(`SELECT * FROM Employee`, (err, result) => {
        if (err) throw err;
        console.log('Viewing All Employees: ');
        console.table(result);
        employeeTrack();
      })//Department table
    } else if (answers.prompt === 'View All Departments') {
      db.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err;
        console.log('Viewing All Departments: ');
        console.table(result);
        employeeTrack();
      }) //Roles table
    } else if (answers.prompt === 'View All Roles') {
      db.query(`SELECT * FROM role`, (err, result) => {
        if (err) throw err;
        console.log('Viewing All Roles: ');
        console.table(result);
        employeeTrack();
      })//adding employee
    } else if (answers.prompt === 'Add Employees') {
      db.query(`SELECT * FROM employee JOIN role ON employee.role_id = role.id`, (err, result) => {
        if (err) throw err;
        console.table(result)

        inquirer.prompt([
          {
            type: 'input',
            name: 'firstName',
            message: 'What is the employees first name?',
            validate: firstNameInput => {
              if (firstNameInput) {
                return true;
              } else {
                console.log('Please add a first name.');
                return false;
              }
            }
          },
          {
            type: 'input',
            name: 'lastName',
            message: 'What is the employees last name?',
            validate: lastNameInput => {
              if (lastNameInput) {
                return true;
              } else {
                console.log('Please Add A Salary!');
                return false;
              }
            }
          },
          {
            type: 'list',
            name: 'role',
            message: 'What is the employees role?',
            choices: () => {
              var array = [];
              for (var i = 0; i < result.length; i++) {
                array.push(result[i].title);
              }
              var newArray = [...new Set(array)];
              return newArray;
            }
          },
          {
            type: 'input',
            name: 'manager',
            message: 'Who is the employees manager?',
            validate: managerInput => {
              if (managerInput) {
                return true;
              } else {
                console.log('Add A Manager.');
                return false;
              }
            }
          }

        ]).then((answers) => {
          for (var i = 0; i < result.length; i++) {
            if (result[i].title === answers.role) {
              var role = result[i];
            }
          }
          db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [answers.firstName, answers.lastName, role.id, answers.manager.id], (err, result) => {
            if (err) throw err;
            console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`)
            employeeTrack();
          });
        })
      })
    } else if (answers.prompt === 'Add Department') {
      inquirer.prompt([
        {
          type: 'input',
          name: 'department',
          message: 'What is the name of department?',
          validate: departmentInput => {
            if (departmentInput) {
              return true;
            } else {
              console.log('Add a department');
              return false;
            }
          }
        }
      ]).then((answers) => {
        db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, result) => {
          if (err) throw err;
          console.log(`Added ${answers.department} to the database`)
          employeeTrack();
        })
      }) 
    } else if (answers.prompt === 'Add role') {
      db.query(`SELECT * FROM department`, (err, result) => {
        if (err) throw err;
        inquirer.prompt([
          {
            type: 'input',
            name: 'role',
            message: 'What is the name of the role?',
            validate: roleInput => {
              if (roleInput) {
                return true;
              } else {
                console.log('Please Add a role.');
                return false;
              }
            }
          },
          {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the role.',
            validate: salaryInput => {
              if (salaryInput) {
                return true;
              } else {
                console.log('Please add the salary.');
                return false;
              }
            }
          },
          {
            type: 'list',
            name: 'department',
            message: 'Which department does the role belong.',
            choices: () => {
              let array = [];
              for(var i = 0; i < result.length; i++) {
                array.push(result[i].name);
              }
              return array;
            }
          }
        ]).then((answers) => {
          for (var i = 0; i < result.length; i++) {
            if (result[i].name === answers.department) {
              let department = results[i];
            }
          }
          db.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [answers.role, answers.salary, department.id], (err, result) => {
            if (err) throw err;
            console.log(`Added ${answers.role} to the database.`)
            employeeTrack();
          })
        })
      }) 
      }else if (answers.prompt === 'Update Employee Role') {
        db.query(`SELECT * FROM employee, role`, (err, result) => {
          if(err) throw err;
          inquirer.prompt([
            {
              type: 'list',
              name: 'employee',
              message: 'Which employees role do you want to update',
              choices: () => {
                let array = [];
                for(var i = 0; i < result.length; i++) {
                  array.push(result[i].last_name);
                }
                let employeeArray = [...new Set(array)];
                return employeeArray;
              }
            },
            {
              type: 'list',
              name: 'role',
              message: 'What is the new role.',
              choices: () => {
                let array = [];
                for(var i = 0; i < result.length; i++) {
                  array.push(result[i].title);
                }
                let newArray = [...new Set(array)];
                return newArray;
              }
            }
          ]).then((answers) => {
            for(var i = 0; i < result.length; i++) {
              if (result[i].last_name === answers.employee) {
                let name = result[i];
              }
            }
            for (var i = 0; i < result.length; i++) {
              if(result[i].last_name === answers.role) {
                let role = result[i];
              }
            }
            db.query(`UPDATE employee SET ? WHERE ?`, [{role_id: role}, {last_name: name}], (err,result) => {
              if (err) throw err;
              console.log(`Updated ${answers.employee} role to the database`)
              employeeTrack()
            })
          })
        })
    } else if (answers.prompt === 'Quit Program') {
      db.end();
      console.log('Thank you, goodbye')
    }
  })
}



//add role
  //update employee role



  //may have to change query statements to backtics
  //remember to use async and await 

  //--What would you like to do ---
  //view all employees
  //add employee
  //update employee role
  //view all roles

  //view all departments
  //add department
  //quit



  // app.post('/api/add-movie', (req,res) => {
  //     const title = req.body.movie;
  //     db.query('INSERT INTO movies(movie_name) VALUES(?)', title, function (err, results) {
  //         console.log(results);
  //         res.status(418), res.json('A movie listing has been created')
  //     });
  // })
  // app.get('/api/movies', (req,res) => {
  //     db.query('SELECT * FROM movie_name', function (err, results) {
  //         console.log(results);
  //         res.status(418), res.json(results)
  //     });
  // })

  // app.delete('/api/movies/:id', (req,res) => {
  //     const movieID = req.params.id;
  //     db.query('DELETE FROM movies WHERE id = ?', movieID, function (err, results) {
  //         console.log(results);
  //         res.status(418), res.json(results)
  //     });

  // })




  app.listen(PORT, () => {
    console.log('app now running on http://localhost:3001/');
  })
