import AWS from 'aws-sdk'

AWS.config.update({ region: 'us-east-1' });

const sns = new AWS.SNS();

export const handler = async (event) => {
   
  var body = JSON.parse(event.body)
  var topicName = body.topicName;
  var message = body.message?body.message:"";
  var subject = body.subject?body.subject:"";
  var endPoint = body.endPoint?body.endPoint:null;
 if(topicName){
    try 
    {
        // Check if the topic already exists
        const topicsResponse = await sns.listTopics().promise();
        const existingTopics = topicsResponse.Topics || [];

        for (const topic of existingTopics)
        {
            if (topic.TopicArn.includes(topicName))
            {
                if(endPoint){
                     // Check if the endpoint is already subscribed to the topic
                    const subscriptions = await sns.listSubscriptionsByTopic({ TopicArn: topic.TopicArn }).promise();
                    const isSubscribed = subscriptions.Subscriptions.some(sub => sub.Endpoint === endPoint && sub.Protocol === 'email');
                    
                    if(!isSubscribed){
                        await sns.subscribe({
                              Protocol: 'email', // e.g., 'email', 'sms', 'lambda', etc.
                              TopicArn: topic.TopicArn,
                              Endpoint: endPoint, // e.g., email address, phone number, Lambda function ARN, etc.
                            }).promise();
                    }
                }
               
              var params = {
                "Message": message,
                "Subject": subject,
                "TopicArn": topic.TopicArn
              }
              console.log(params)
               var status = sns.publish(params, (err, data) => {
                  if (err) {
                  return false;
                  } else {
                    return true;
                  }
                })
                console.log(status)
               if(status)
                  return ({"success":"Email sent successfully"})
               else 
                  return ({"err":"unable to send the email"})
            }
                
        }

        // If the topic doesn't exist, create it
        const createTopicResponse = await sns.createTopic({ Name: topicName }).promise();
        const topicArn = createTopicResponse.TopicArn;
        
        // Subscribe to the topic
        const subscribeResponse = await sns.subscribe({
          Protocol: 'email', // e.g., 'email', 'sms', 'lambda', etc.
          TopicArn: topicArn,
          Endpoint: endPoint, // e.g., email address, phone number, Lambda function ARN, etc.
        }).promise();
        
        return subscribeResponse;
        
    } 
    catch (error) {
        throw error;
      }
    }
    else
        return({"Error":"Missing hotel name"})
  
};


