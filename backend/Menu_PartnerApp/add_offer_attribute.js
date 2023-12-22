const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  region: 'us-east-1', // replace with your AWS region
  accessKeyId: 'ASIA3NIWTCHXAESDKVVN', // replace with your AWS access key ID
  secretAccessKey: 'iqHyI09nb8v7NsWyYAj2P14/KglTOzeDXOLSuE61',
  sessionToken:"FwoGZXIvYXdzECMaDBnd59mToDBAwJaWYCLAAVLs2/grwIs+7pGAOOPA8qEGOXACZ85DMO8rNKS661K+94hVTnXVkceLGd8dh/Yiv5j0ggpOV4C6MV5BYFUUYg6hfP3EP2dZT0/iS3kkKrLDqPsOwO8+iZBIdgesizA3hbYtraJkZrZlx+3KnVd71surlYNuviBwHM8JLZPhsQ9RfT8vSvfgHmaR+NnF4Tajo1/4p41PlHd+A9F1qNBSfb2CNsNLWSW8sdgfd5Y02zvJqkNZ73zdxaVzbVnEBJttHyjUtb2rBjItrblvZ7lj2hHLqUkL54YarSyvZYfFy7OftgUKY1ne2FQqoPCGM3IyPyqAV6RZ"
});

// Create DynamoDB Document Client
const docClient = new AWS.DynamoDB.DocumentClient();

// Specify your table name
const tableName = 'food-menu-table';

// Scan the entire table to get all items
const scanParams = {
  TableName: tableName
};

docClient.scan(scanParams, (err, data) => {
  if (err) {
    console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
  } else {
    // Add a new attribute to each item
    data.Items.forEach(item => {
      const item_id = item.item_id; // Replace 'ItemID' with your primary key attribute
      const restaurant_id = item.restaurant_id
      const updateParams = {
        TableName: tableName,
        Key: { 
          'item_id': item_id,
          'restaurant_id':restaurant_id
         },
        UpdateExpression: 'SET close_hours = :value',
        ExpressionAttributeValues: { ':value': "22:00" } // Adjust the value as needed
      };

      docClient.update(updateParams, (err, data) => {
        if (err) {
          console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
        }
      });
    });
  }
});
