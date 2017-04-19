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
	options();
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
				products();
				break;
				case "View low inventory":
				lowInventory();
				break;
				case "Add to inventory":
				addInventory();
				break;
				case "Add new product":
				newProduct();

				break;
			}
		})
}

function products(){
	connection.query(
		"select * from products",
		function(err,res){
			if(err){
				throw err;
			}
			res.map(function(e){
				console.log("Item Id: ",e.item_id, " || Products: ",e.product_name," || Price: ",e.price, " || Quantity: ", e.stock_quantity);
			})
		})
}

function lowInventory(){
	connection.query(
		"select * from products where stock_quantity < 5",
		function(err,res){
				if(err){
					throw err;
				}
				res.map(function(e){
					console.log("Product: ",e.product_name," || Quantity: ", e.stock_quantity);
				});
		});
}

function addInventory(products){
connection.query(
	"select * from products",
	function(err,res){
			if(err){
				throw err;
			}
		
	res.map(function(e){
		console.log("Item ID: ",e.item_id," || Product: ",e.product_name," || In stock: ", e.stock_quantity);
	});

	inquirer.prompt([
		{
			name:"item_id",
			type:"input",
			message:"What is the id of the item you would like to add to?"
		},
		{
			name:"quantity",
			type: "input",
			message:"How many would you like add?"
		}
	]).then(function(user){
		var itemChosen = res.slice(user.item_id - 1, user.item_id);

		itemChosen.map(function(e){
			var add = Number(user.quantity) + Number(e.stock_quantity);
			connection.query(
			"update products set stock_quantity = ? where item_id = ?",
			[add,user.item_id],
			function(err){
				if(err){
					throw err;
				}
			});
		});

	});
});
}

function newProduct(){
	inquirer.prompt([
		{
			name:"product",
			message:"Enter name of product.",
			type:"input",
		},
		{
			name: "dept",
			message:"Enter department.",
			type:"input"
		},
		{
			name: "price",
			message:"Enter price.",
			type:"input"
		},
		{
			name:"quantity",
			message:"Enter quantity.",
			type:"input"
		}

		]).then(function(u){
			
			connection.query(
				"INSERT INTO products(product_name,department_name,price,stock_quantity) VALUES(?,?,?,?)",
				[u.product,u.dept,u.price,u.quantity],
				function(err){
					if(err){
						throw err;
					}
				});
		});
}
