const AWS = require("aws-sdk");

// Create DynamoDB service object
const dynamoDB = new AWS.DynamoDB();

module.exports.handler = async (event) => {
  var body=JSON.parse(event.body);
  // var body = event;
  var item_id = body.item_id;
  var restaurant_id = body.restaurant_id;
 // Specify the table name and the key of the item you want to delete
  const params = {
    TableName: 'food-menu-table',
    Key: {
      item_id: { S: item_id } ,
      restaurant_id :{S:restaurant_id}
    }
  };
  console.log(params);
  try{
    const response = await dynamoDB.deleteItem(params).promise()
    // console.log(response);
    return{
      "success":"Item deleted successfully"
    }
  }
  catch(err){
    return{
      "error":"Failed to delete item"
    }
  }
  
};
