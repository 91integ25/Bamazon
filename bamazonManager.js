var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var table = new Table({
	head:["Item id","Product name","Price","Stock quantity"]
})
var invTable = new Table({
	head:["Item id","Product name","Price","Stock quantity"]
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
		});
}

function products(){
	connection.query(
		"select * from products",
		function(err,res){
			if(err){
				throw err;
			}
			var itemArr = res.map(function(e){
				return [e.item_id,e.product_name,e.price,e.stock_quantity];
			});
			for(var i = 0;i < itemArr.length;i++){
				table.push(itemArr[i]);
			}
			console.log(table.toString());
			somethingElse();
		});

}

function lowInventory(){
	connection.query(
		"select * from products where stock_quantity < 5",
		function(err,res){
			if(err){
				throw err;
			}
			var itemArr = res.map(function(e){
				return [e.item_id,e.product_name,e.price,e.stock_quantity];
			});
			for(var i = 0;i < itemArr.length;i++){
				invTable.push(itemArr[i]);
			}
			if(itemArr[0]){
				console.log(invTable.toString());
			somethingElse();
			}
			else{
				console.log("All inventory has Stock quantity above 5");
				somethingElse();
			}
			
		});
}

function addInventory(products){
connection.query(
	"select * from products",
	function(err,res){
			if(err){
				throw err;
			}
		
		var itemArr = res.map(function(e){
			return [e.item_id,e.product_name,e.price,e.stock_quantity];
		});
		for(var i = 0;i < itemArr.length;i++){
			table.push(itemArr[i]);
		}

		console.log(table.toString());

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
			somethingElse();
			
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
				"INSERT INTO products(product_name,department_name,price,stock_quantity,product_sales) VALUES(?,?,?,?,?)",
				[u.product,u.dept,u.price,u.quantity,0],
				function(err){
					if(err){
						throw err;
					}
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
					table.splice(0,table.length);
					options();
				}else{

					console.log("Have a good day!");
					process.exit(0);
				}
		})
}
