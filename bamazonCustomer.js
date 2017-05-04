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
	displayItems();

function displayItems(){
	connection.query(
		"select * from products",
		function(err,res){
			if(err){
				throw err;
			}
			// returning array of table values
			var itemArr = res.map(function(e){
				return[e.item_id,e.product_name,e.price,e.product_sales,e.stock_quantity];
			});
			//inserting arrays into table for display
			for(var i = 0; i < itemArr.length; i++){
				table.push(itemArr[i]);
			}
			console.log(table.toString());
			// invoking askPurchase and passing the response of the query as argument
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
		// isolating the item that was chosen for purchase
		var itemChosen = products.slice(user.item_id - 1, user.item_id);
		itemChosen.map(function(e){
			// checking if there is enough in stock
			if(e.stock_quantity < user.quantity){
				console.log("There is not enough in stock");
			}
			else{
				var remaining = Number(e.stock_quantity) - Number(user.quantity);
				connection.query(
					"update products set stock_quantity = ? where item_id = ?",
					[remaining,user.item_id],
					function(err){
						if(err){
							throw err;
						}
						console.log( user.quantity,e.product_name, "Purchased")
						buyMore();
				});
				totalDep(products,e.department_name,e.price);
				totalProducts(user.quantity,itemChosen,user.item_id);
			}
		});
	});
}
// function to prompt if they want to buy more items
function buyMore(){
	inquirer.prompt([
		{
			name:"confirm",
			message:"Would you like to buy more items?",
			type:"confirm"
		}

	]).then(function(user){
		if(user.confirm){
			//invoking function to display items and clearing table 
			displayItems();
			table.splice(0,table.length);
		}else{

			console.log("Thank you for shopping at Bamazon");
			process.exit(0);
		}
	});
}
// updating total sales per product
function totalProducts(sold,item,id){
	item.map(function(e){
		var totalSold = Number(e.price) * Number(sold) + e.product_sales;
		connection.query(
			"update products set product_sales=? where item_id =?",
			[totalSold,id],
			function(err){
				if(err){
					throw err;
				}
		});
	});
}
// updating total sales for department
function totalDep(products,dep,price){
	var totalArr = [];
		totalArr.push(price);

	for(var i = 0;i < products.length;i++){
		if(products[i].department_name === dep){
			totalArr.push(products[i].product_sales);
		}
	}

	var totalSales = totalArr.reduce(function(a,b){
		return a + b;
	})
	connection.query(
		"update departments set total_sales= ? where department_name = ?",
		[totalSales,dep],
		function(err){
			if(err){
				throw err;
			}
		});
}
