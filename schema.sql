CREATE DATABASE bamazon;
use bamazon;
/* CREATES DEPARTMENTS TABLE*/
/***********************************************/
CREATE TABLE departments(
id int auto_increment not null,
department_id varchar(50) null,
department_name varchar(50) null,
over_head_costs int(11) null,
total_sales int(11) null,
primary key(id)
);
/* CREATES PRODUCTS TABLE*/
/***********************************************/
CREATE TABLE products(
item_id int auto_increment not null,
product_name varchar(50) null,
department_name varchar(50) null,
price int(11) null,
quantity int(11) null,
product_sales int(11) null,
primary key(id)
);
