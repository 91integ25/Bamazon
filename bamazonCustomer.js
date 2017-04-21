var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var table = new Table({
	head:["Item id","Product name","Price","Product sales","Stock quantity"]
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
	displayItems();
});

function buyMore(){
	inquirer.prompt([
		{
			name:"confirm",
			message:"Would you like to buy more items?",
			type:"confirm"
		}

		]).then(function(user){
				if(user.confirm){
					displayItems();
					table.splice(0,table.length);
				}else{

					console.log("Thank you for shopping at Bamazon");
					process.exit(0);
				}
		})
}
function displayItems(){
connection.query(
	"select * from products",
	function(err,res){
		if(err){
			throw err;
		}
		var itemArr = res.map(function(e){
			return[e.item_id,e.product_name,e.price,e.product_sales,e.stock_quantity];
		});
		
		for(var i = 0; i < itemArr.length; i++){
			table.push(itemArr[i]);
		}
		console.log(table.toString());

		askPurchase(res);
});
}

function askPurchase(products){
	inquirer.prompt([
	{
		name:"item_id",
		type:"input",
		message:"What is the id of the item you would like to purchase?"
	},
	{
		name:"quantity",
		type: "input",
		message:"How many would you like to purchase?"
	}
]).then(function(user){
	var itemChosen = products.slice(user.item_id - 1, user.item_id);


	itemChosen.map(function(e){

		if(e.stock_quantity < user.quantity){
			console.log("There is not enough in stock");
		}else{
			totalSales(user.quantity,itemChosen,user.item_id);
			var remaining = Number(e.stock_quantity) - Number(user.quantity);
			connection.query(
				"update products set stock_quantity = ? where item_id = ?",
				[remaining,user.item_id],
				function(err){
					if(err){
						throw err;
					}
				});
			console.log( user.quantity,e.product_name, "Purchased")
			buyMore();
		}
	});
});
}

function totalSales(sold,item,id){
	item.map(function(e){
		var totalSold = Number(e.price) * Number(sold);
		console.log(totalSold)
		var overhead = Number(e.price) * 200;
		connection.query(
			"update products set product_sales=? where item_id =?",
			[totalSold,id],
			function(err){
				if(err){
					throw err;
				}
			});

		connection.query(
			"update departments set total_sales = ? where department_name = ?",
			[totalSold,e.department_name],
			function(err){
				if(err){
					throw err;
				}
			});
	});
}
