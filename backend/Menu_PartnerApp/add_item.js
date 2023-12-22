const AWS = require('aws-sdk')

// Create DynamoDB service object
const dynamoDB = new AWS.DynamoDB();

module.exports.handler = async (event) => {
  var body = JSON.parse(event.body);
  console.log(body);
  var name = body.name?body.name:null;
  var restaurant_id = body.restaurant_id?body.restaurant_id:null;
  var category = body.category?body.category:"General";
  var description = body.description?body.description:"";
  var price = body.price?body.price:null;
  const tableName = "food-menu-table";

  // Simulate an auto-incrementing ID 
  const getNextId = async () => {
    // Specify the scan parameters
    const params = {
      TableName: tableName,
      Select: 'COUNT' // Specify 'COUNT' to get the count without retrieving the items
    };
  
    try {
      const response = await dynamoDB.scan(params).promise();
      const itemCount = response.Count;
      console.log(itemCount)
      return {
        status:true,
        count: itemCount
      };
    } catch (err) {
      return {
        status: false
      };
    }
  };
  
  if(restaurant_id && name && price){
     var countResponse = await getNextId();
     var itemId = "I"+(countResponse.count+1)
    // Specify the table name and the item to be added
    const params = {
      TableName: 'food-menu-table',
      Item: {
        item_id: { S: itemId },
        name: { S: name },
        restaurant_id: { S: restaurant_id },
        description:{S:description},
        category:{S:category},
        price:{S:price}
        // Add other attributes as needed
      }
    };
    console.log(params)
  
    try {
      await dynamoDB.putItem(params).promise();
      return {
        "success": "Item added successfully",
        "item_id": itemId
      };
    } catch (err) {
      console.error('Error:', err);
      return {
        "error": "Failed to add item"
      };
    }
  }
  else{
    return{
      "error":"Missing required parameters(restaurant_id, price,name)"
    }
  }
};
