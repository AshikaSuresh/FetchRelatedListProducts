var count = 0, productData, maxRows = 0;

ZOHO.embeddedApp.on("PageLoad", async function (data) {
	const formattedArray = data.id.map(item => `'${item}'`);
	const formattedString = formattedArray.join(',');	// Join the formatted array elements into a string

	maxRows = data.max_rows;

	document.getElementsByClassName("lyteModalClose").innerHTML = "";
	
	var config = {
		"select_query": "select Product_Name, Product_Category, Unit_Price, Qty_in_Stock from Products where id in ("+formattedString+")"
   }

   ZOHO.CRM.API.coql(config).then(function(data){
	 console.log("products ...",data.data);
	 productData = data.data;
	if(data && data.data && data.data.length){
		var htmlString = "";
		productData.forEach(({ id, Product_Category, Product_Name, Unit_Price, Qty_in_Stock }) => {
			htmlString = htmlString.concat(
				`<tr>
					<td><input type='checkbox' onclick='selected(this)' id='${id}' class='products'></td>
					<td>${Product_Name}</td>
					<td>${Product_Category}</td>
					<td>${Unit_Price}</td>
					<td>${Qty_in_Stock}</td>
				</tr>`
			);
		});
		document.getElementById("tbody").innerHTML = htmlString;
	}
	else {
		document.getElementById("pTable").hidden = true;
		document.getElementById("noProductDiv").hidden = false;
	}
   }); 
});

ZOHO.embeddedApp.init();

function selected(element) {
	element.checked ? count++ : count-- ;
	document.getElementById("selectedCount").innerHTML = `${count} Products selected`;
}

function selectAll(select_all) {
	for (product_element of document.getElementsByClassName('products')) {
		product_element.checked = select_all;
	}
	count = select_all ? productData.length : 0;
	document.getElementById("selectedCount").innerHTML = `${count} Products selected`;
	document.getElementById("selectAll").checked = select_all;
}

function selectAllProducts(element) {
	selectAll(element.checked);
}

function clearSelection() {
	selectAll(false);
}

function closewidget() {
	if (count > maxRows) {
		alert("Selected product is greater than the maximum subform rows.");
	} else {
		var selected_products = [];
		for (product_element of document.getElementsByClassName('products')) {
			product_element.checked && selected_products.push(productData.find(product => product.id === product_element.id));
		}
		console.log("returning to Client Script ...", JSON.stringify(selected_products));
		$Client.close(selected_products);
	}
}