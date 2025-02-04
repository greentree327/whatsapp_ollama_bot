package.json: stores the installed dependencies 
    -> npm install express: Express.js simplifies the process of building web applications and APIs in Node.js
    -> npm install axios: used for making HTTP requests from both the browser and Node.js environments
    -> npm install ollama-node: 
index.js: 
include code-trigger functions that actively send messages to users, if the user responds to the template message , then we are allowed to message the user within 24 hours , so sendtextmessage and sendMediamessage will work
--> do not receive real-time updates

Solution: use Webhook
Explanation: Webhook provides a way for the Whatsapp business API to actively notify your application when certain events occur,such as when your application receives a message from a user.
--> Real-time updates: Webhooks provide near real-time updates as soon as a user sends a message or interacts with your WhatsApp Business account. You can immediately respond or take other actions based on the received message.

complete documentation in sending media messages and how to configure each type of media message by visiting
https://developers.facebook.com/docs/whatsapp/api/messages/media

all media files we sent to Whatsapp servers are encrypted and persist for 30 days, we can check the media endpoint by visiting
https://developers.facebook.com/docs/whatsapp/cloud-api/reference/media

User reveing status: sent => delivered => read

How to run
1. download ngrok from official wbsite, upon sucessful unzipping, double click to activate it and type ngrok http 5001
2. retrieve the public_url and go to developers.facebook.com and in Quickstart > Configuration, set the callback URL to be public_url/webhook
3. Download ollama locally, type ollama run <Your desired model>, in my case I choose ollama run deepseek-r1, 
double check y running ollama ps to ensure the model is loaded 