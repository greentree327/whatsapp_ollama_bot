require('dotenv').config() // initializing the dotenv dependency
const express = require('express')
const axios = require('axios')
/*
const { Ollama } = require('ollama-node');

const ollamaInstances = {}; // Store Ollama instances, keyed by phone number

function getOllamaInstance(phoneNumber) {  // From ollama.js
    if (!ollamaInstances[phoneNumber]) {
      ollamaInstances[phoneNumber] = new Ollama({
        host: 'http://localhost:11434',
      });
    }
    return ollamaInstances[phoneNumber];
}
*/


const WEBHOOK_VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN; // Set the webhook verify token as a global parameter such that it can be used in any route

const app = express() // we need to tell express to accept Json type request, as whatsapp messages from users will be sent in Json type
app.use(express.json())



// Next, we need to tell the server(localhost3000) what to do when it receives incoming http/webhook request,
    // http request includes direct typing the http://localhost:3000/
        // The root path (/) is the default landing point, i.e. (/) in http://localhost:3000/, unless the user specify a particular path

app.get('/', (request, response) => {
    response.send('Whatsapp with Node.js and Webhooks')
})

// Next, we create the webhook GET route inside the whatsapp platform and to validate our webhook configuration
    // Routes define how a server responds to different types of requests
        // A "GET route" specifically handles get requests, typically used to retrieve information

app.get('/webhook', (request, response) => { // base on the Whatsapp (WS) doc, WS will call this api, and send data on the query parameters, including hub.mode, hub.challenge, and hub.verify_token
    // console.log(request.query) : logs the incoming request query parameters
    // response.send() : send (empty) respond back to WS
    const mode = request.query['hub.mode'] 
    const token = request.query['hub.verify_token']
    const challenge = request.query['hub.challenge']

    if (mode === 'subscribe' && token === WEBHOOK_VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        response.status(200).send(challenge) // 200 indicate success
    } else {
        console.error('Webhook verification failed.');
        response.sendStatus(403) // 403 means forbidden
    }
})

// Add POST route
app.post('/webhook', async (request, response) => { // handle if it is a message request / status request

    // Send 200 OK *after* processing all messages and changes
    response.status(200).send('Webhook processed'); // return HTTP 200 status to Meta, let them know that the message has been received successfully to webhook, and served my my application, so that meta won't retry to send the same message again
    
    // console.log(JSON.stringify(request.body, null, 2)) : JSON.stringify() converts that object into a string representation of the JSON
    const { entry } = request.body

    if (!entry || entry.length === 0) { // all POST requests should contain the entry array
        return response.status(400).send('Invalid Request')
    }

    const changes = entry[0].changes

    if (!changes || changes.length === 0) { // all POST requests should contain the changes array
        return response.status(400).send('Invalid Request')
    }

    const statueses = changes[0].value.statuses ? changes[0].value.statuses[0] : null 
    // or in python, we write changes[0][value][statuses] 
    const messages = changes[0].value.messages ? changes[0].value.messages[0] : null

    if (statueses) {
        // Handle message status
        console.log(`
            MESSAGE STATUS UPDATE:
            ID:  ${statueses.id},
            STATUS: ${statueses.status}
        `)
    }

    if (messages) {

        // Handle incoming messages
        if (messages.type === 'text') {
            const userMessage = messages.text.body;
            try {
                // Make direct request to Ollama API
                const ollamaResponse = await axios.post('http://127.0.0.1:11434/api/chat', { // use IPv4 address
                    model: 'deepseek-r1:latest',
                    // prompt: userMessage, only use when api/generate is set
                    messages: [{
                        role: 'user',
                        content: userMessage
                    }],
                    stream: false
                });
        
                // Extract just the response text
                    // for api/generate, use let botReply = ollamaResponse.data.response; 
                let botReply = ollamaResponse.data.message?.content;
                
                if (!botReply) {
                    throw new Error('Empty response from Ollama');
                }
        
                // Send response back through WhatsApp in correct order, allow error handling first
                await replyMessage(messages.from, botReply, messages.id);

                
        
            } catch (error) {
                console.error('Ollama error:', error.response?.data || error.message || error);
                
                // Send error message to user
                await replyMessage(
                    messages.from, 
                    "I apologize, but I'm having trouble processing your request at the moment.", 
                    messages.id
                );

                
            }
        
            /*
            // Check if the HTTP request is successful, provided my the ollama server (status 200-299)
            if (messages.text.body.toLowerCase() === 'hello') {
                replyMessage(messages.from, 'Hello. How are you?', messages.id)
            }
            if (messages.text.body.toLowerCase() === 'list') {
                sendList(messages.from)
            }
            if (messages.text.body.toLowerCase() === 'buttons') {
                sendReplyButton(messages.from)
            }
            */  
        }
        if (messages.type === 'interactive') {
            if (messages.interactive.type === 'list_reply'){
                sendMessage(messages.from, `You selected the option with ID ${messages.interactive.list_reply.id} - Title ${messages.interactive.list_reply.title}`)
                response.status(200).send('Webhook processed');
            }

            if (messages.interactive.type === 'button_reply'){
                sendMessage(messages.from, `You selected the button with ID ${messages.interactive.button_reply.id} - Title ${messages.interactive.button_reply.title}`)
                response.status(200).send('Webhook processed');
            }
        }
        console.log(JSON.stringify(messages, null, 2))
    }
    
})

async function sendMessage(to, body) { // to: phone number; body: the actual message sent back to user
    await axios({ // use axios to call the Whatsapp API to sent the messages
        url: 'https://graph.facebook.com/v21.0/600590879793242/messages',
        method: 'post',
        headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            messaging_product: 'whatsapp',
            to, // since the key name === value name, just need to write 1 
            type: 'text',
            text: {
                body // since the key name === value name, just need to write 1 
            }
            
        })
    })
}

async function replyMessage(to, body, messageId) { // to: phone number; body: the actual message sent back to user
    await axios({ // use axios to call the Whatsapp API to sent the messages
        url: 'https://graph.facebook.com/v21.0/600590879793242/messages',
        method: 'post',
        headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            messaging_product: 'whatsapp',
            to, // since the key name === value name, just need to write 1 
            type: 'text',
            text: {
                body // since the key name === value name, just need to write 1 
            },
            context: {
                message_id: messageId
            }
            
        })
    })
}

async function sendList(to) { // to: phone number; body: the actual message sent back to user
    await axios({ // use axios to call the Whatsapp API to sent the messages
        url: 'https://graph.facebook.com/v21.0/600590879793242/messages',
        method: 'post',
        headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            messaging_product: 'whatsapp',
            to, // since the key name === value name, just need to write 1 
            type: 'interactive',
            interactive: {
                type: 'list', // either a list / button
                header: {
                    type: 'text',
                    text: 'Message Header'
                },
                body: {
                    text: 'This is a interactive list message'
                },
                footer: {
                    text: 'This is the message footer'
                },
                action:{
                    button: 'Tap for the options',
                    sections: [
                        {
                            title: 'First Section',
                            rows: [
                                {
                                    id: 'first_option',
                                    title: 'First option',
                                    description: 'This is the description of the first option'
                                },
                                {
                                    id: 'second_option',
                                    title: 'Second option',
                                    description: 'This is the description of the second option'
                                },
                                
                            ]
                        },
                        {
                            title: 'Second Section',
                            rows: [
                                {
                                    id: 'third_option',
                                    title: 'Third option',
                                    description: 'This is the description of the third option'
                                }
                            ]
                            
                        }
                    ]
                }
            }
            
        })
    })
}

async function sendReplyButton(to) { // to: phone number; body: the actual message sent back to user
    await axios({ // use axios to call the Whatsapp API to sent the messages
        url: 'https://graph.facebook.com/v21.0/600590879793242/messages',
        method: 'post',
        headers: {
            'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            messaging_product: 'whatsapp',
            to, // since the key name === value name, just need to write 1 
            type: 'interactive',
            interactive: {
                type: 'button', 
                header: {
                    type: 'text',
                    text: 'Message Header'
                },
                body: {
                    text: 'This is a interactive reply button message'
                },
                footer: {
                    text: 'This is the message footer'
                },
                action:{
                    buttons: [ // max 3 buttons
                        {
                            type: 'reply',
                            reply: {
                                id: 'first_button',
                                title: 'First Button'
                            }
                        },
                        {
                            type: 'reply',
                            reply: {
                                id: 'second_button',
                                title: 'Second Button'
                            }
                        }
                    ]
                }
            }
            
        })
    })
}
// Must be placed after defining all routes, as it starts the express.js server and begins to listen for incoming requests. 
    // Any routes defined after app.listen() will not be registered.
app.listen(5001, () => { // we need to tell express to listen our application on a specific port, i.e.localhost3000
    console.log('Server started on port 5001')
    // sendMessage('85269275379', 'Hello')
})

 