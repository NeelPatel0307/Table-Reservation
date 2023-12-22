const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  region: 'us-east-1', // replace with your AWS region
  accessKeyId: 'ASIA3NIWTCHXJRO2VCJL', // replace with your AWS access key ID
  secretAccessKey: 'B5ptFQMPeqZT/6t7xl6F4x5G4nm2xR2gASldDhNi', // replace with your AWS secret access key
  sessionToken:"FwoGZXIvYXdzEJP//////////wEaDFhChAlhbM8rYCwlSyLAAY7bRkI3P2RAhyb4XGsPPogKRDdXXLsLSe21pTa2Ct0UhtIl7L27L9mK2v0G43mI5GOR1XV7xNsTvIQR1xGsTboJkVWyCI4cK69YuRmfxiKD54CBJAneVmlB9tBV854W6brZghfM5bX6hqpju4PwAxe2i93Iavw33zxX6MUjjCj+oSj0wkAnQqOwBjDeXe18zK5GOVdqaNUxJdYt5x44jOZaotESak7Z16ENlwJOyFMNfJCPdALXRJy2f1UouvN4LSjezeWqBjItx6qSTG3vcVT4SklGHotcdTqlFBH2+blk7gnQzyq+bGqPR7qCsncHzI7wCvnM"
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
      const item_id = item.item_id
      const restaurant_id = item.restaurant_id; // Replace 'ItemID' with your primary key attribute
      const updateParams = {
        TableName: tableName,
        Key: { 
            'item_id': item_id,
            "restaurant_id":restaurant_id
         },
        UpdateExpression: 'SET offers = :value',
        ExpressionAttributeValues: { ':value': [] } // Adjust the value as needed
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
