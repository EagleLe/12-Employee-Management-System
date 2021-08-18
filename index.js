const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "test1"
});

connection.connect(function(err) {
    if (err) throw err;

    menuChoices();
});

function menuChoices() {

    inquirer
        .prompt({
            type: "list",
            name: "menu",
            message: "Would you like to do?",
            choices: [
                "Add Employee",
                "View Employees",
                "Add Department",
                "View Departments",
                "View Employees by Department",
                "Add Role",
                "Update Employee Role",
                "End"
            ]
        })
        .then(function({ menu }) {
            switch (menu) {
                case "Add Employee":
                    addEmployee();
                    break;
                case "View Employees":
                    viewEmployee();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "View Departments":
                    viewDepartments();
                    break;
                case "View Employees by Department":
                    viewEmployeeByDepartment();
                    break;

                case "Remove Employees":
                    removeEmployees();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Add Role":
                    addRole();
                    break;

                case "End":
                    connection.end();
                    break;
            }
        });
}