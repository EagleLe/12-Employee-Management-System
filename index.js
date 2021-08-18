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

function viewEmployee() {
    console.log("Viewing employees\n");

    var query =
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON d.id = r.department_id LEFT JOIN employee m ON m.id = e.manager_id`

    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);

        menuChoices();
    });
}


function viewEmployeeByDepartment() {
    console.log("Viewing employees by department\n");

    var query =
        `SELECT d.id, d.name, r.salary AS budget FROM employee e LEFT JOIN role r ON e.role_id = r.id LEFT JOIN department d ON d.id = r.department_id GROUP BY d.id, d.name`

    connection.query(query, (err, res) => {
        if (err) throw err;
        const departmentChoices = res.map(data => ({
            value: data.id,
            name: data.name
        }));

        console.table(res);

        inquirer
            .prompt([{
                type: "list",
                name: "departmentId",
                message: "Which department would you choose?",
                choices: departmentChoices
            }])
            .then(function(answer) {
                console.log("answer ", answer.departmentId);

                var query =
                    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON d.id = r.department_id WHERE d.id = ?`

                connection.query(query, answer.departmentId, (err, res) => {
                    if (err) throw err;

                    console.table(res);

                    menuChoices();
                });
            });
    });

}
function addEmployee() {
    console.log("Inserting an employee!");

    var query = `SELECT r.id, r.title, r.salary FROM role r`

    connection.query(query, (err, res) => {
        if (err) throw err;

        const roleChoices = res.map(({ id, title, salary }) => ({
            value: id,
            title: `${title}`,
            salary: `${salary}`
        }));


        inquirer
            .prompt([{
                    type: "input",
                    name: "first_name",
                    message: "What is the employee's first name?"
                },
                {
                    type: "input",
                    name: "last_name",
                    message: "What is the employee's last name?"
                },
                {
                    type: "list",
                    name: "roleId",
                    message: "What is the employee's role?",
                    choices: roleChoices
                },

            ])
            .then(function(answer) {
                console.log(answer);

                var query = `INSERT INTO employee SET ?`
                connection.query(query, {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.roleId,
                    manager_id: answer.managerId,
                }, (err, res) => {
                    if (err) throw err;

                    console.table(res);

                    menuChoices();
                });
            });

    });
}
function addDepartment() {

    inquirer.prompt([{
        type: 'input',
        name: 'name',
        message: 'what is department name ?'
    }]).then(function(answer) {
        console.log(answer);

        var query = "insert into department SET ?"
        connection.query(query, { name: answer.name }, (err, res) => {
            if (err) throw err;

            console.log("Department Inserted successfully!\n");

            menuChoices();
        })
    })



}

function viewDepartments() {
    var query = "SELECT * FROM department"
    connection.query(query, (err, res) => {
        if (err) throw err;

        console.table(res);


    });
    menuChoices();
}