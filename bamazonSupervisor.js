var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var table = new Table({
	head:['department_id','department_name','over_head_costs','total_sales',"Total profit"]
	
	
})

var connection = mysql.createConnection({
	host:"localhost",
	port:3306,
	user:"root",
	password:"91integ25@gmail.com",
	database:"bamazon"
})
connection.connect(function (err){
	if(err){
		throw err;
	}
	options();
});
function options(){
		inquirer.prompt([
		{
			type:"list",
			message:"What would you like to do today?",
			choices:["View product sales by department","Create new department"],
			name:"manager"
		}

		]).then(function(user){
			switch(user.manager){
				case "View product sales by department":
				viewProducts();
				break;
				case "Create new department":
				newDep();
				break;
			}
		});
}

function viewProducts(){
	connection.query(
		"select * from departments",
		function(err,res){
			if(err){
				throw err;
			}
			var totalProfit;
			var myArr = res.map(function(e){
				totalProfit = e.total_sales - e.over_head_costs;
				return [e.department_id,e.department_name,e.over_head_costs,e.total_sales,totalProfit];
			});
			for(var i = 0; i < myArr.length;i++){
				table.push(myArr[i]);
			}
			
			console.log(table.toString())
			somethingElse();
			
		});
}

function newDep(){
	inquirer.prompt([
		{
			type:"input",
			message:"What department would you like to create?",
			name:"department"
		}

		]).then(function(user){
			var overhead = Math.floor(Math.random() * (10000 - 5000)) + 5000;
			connection.query(
				"insert into departments(department_name,over_head_costs,total_sales) values(?,?,?)",
				[user.department,overhead,0],
				function(err){
					if(err){
						throw err;
					}
					console.log("Department ",user.department," created")
					
				});
			somethingElse();
		});
}
function somethingElse(){
	inquirer.prompt([
		{
			name:"confirm",
			message:"Would you like to do something else?",
			type:"confirm"
		}

		]).then(function(user){
				if(user.confirm){
					options();
				}else{

					console.log("Have a good day!");
					process.exit(0);
				}
		})
}

