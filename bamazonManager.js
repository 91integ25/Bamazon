var mysql = require("mysql");
var inquirer = require("inquirer");

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
});

function options(){
	inquirer.prompt([
		{
			type:"list",
			message:"What would you like to do today?",
			choices:["Products for sale","View low inventory","Add to inventory","Add new product"],
			name:"manager"
		}

		]).then(function(user){
			switch(user.manager){
				case "Products for sale":
				break;
				case "View low inventory":
				break;
				case "Add to inventory":
				break;
				case "Add new product":
				break;
			}
		})
}

function products(){
	connection.query(
		"select * from products",
		function(err,res){
			if(err){
				console.log(err)
			}
			res.map(function(e){
				console.log("Item Id: ",e.item_id, " || Products: ",e.product_name," || Price: ",e.price, " || Quantity: ", e.stock_quantity);
			})
		})
}
products();