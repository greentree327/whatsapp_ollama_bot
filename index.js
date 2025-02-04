require('dotenv').config() // initializing the dotenv dependency
const axios = require('axios') // import the axios module
const FormData = require('form-data') // The form-data module is crucial for creating form data objects,
const fs = require('fs') // THe fs module provides a wide range of functions for interacting with the file system, including reading from files, writing to files, deleting files, and working with directories.




// Create a new function to send the 'hello world' template message to the test number
async function sendTemplateMessage() {
    const response = await axios({ // configure some properties inside the object "response"
        url:'https://graph.facebook.com/v21.0/600590879793242/messages', // configure the api-endpoint url we will use to send the message
        method: 'post',
        headers: {
            'Authorization': 'Bearer ' + process.env.WHATSAPP_TOKEN,
            'Content-Type': 'application/json' // send json data to the api
        },
        data: JSON.stringify({ // configure data properities
            messaging_product: 'whatsapp',
            to: '85269275379', // phone number which we are going to messsage to
            type: 'template', // can be changed
            template: {     // configure template properties
                name: 'hello_world',
                language: { // configure language property
                    code: 'en_US'
                }},
                /*
                components: [
                    {
                        type: 'header',
                        parameters: [
                            {
                                type: 'text',
                                text: 'Sum Cheng'
                            }
                        ]
                    },
                    {
                        type: 'body',
                        parameters: [
                            {
                                type: 'text',
                                text: '50'
                            }
                        ]
                    }
                ]
                    */
             
        })
            

    })
    console.log(response.data) // add .data to get the body response
}

// function for when the receipent engage in a conversation with us
// default to be text messages
async function sendTextMessage() {
    const response = await axios({ // configure some properties inside the object "response"
        url:'https://graph.facebook.com/v21.0/600590879793242/messages', // configure the api-endpoint url we will use to send the message
        method: 'post',
        headers: {
            'Authorization': 'Bearer ' + process.env.WHATSAPP_TOKEN,
            'Content-Type': 'application/json' // send json data to the api
        },
        data: JSON.stringify({ // configure data properities
            messaging_product: 'whatsapp',
            to: '85269275379', // phone number which we are going to messsage to
            type: 'text', // user's text messsage response
            text: {     // configure text properties
                body: 'This is a text message'
            }
             
        })
            

    })
    console.log(response.data) // add .data to get the body response

}

async function sendMediaMessage() {
    const response = await axios({ // configure some properties inside the object "response"
        url:'https://graph.facebook.com/v21.0/600590879793242/messages', // configure the api-endpoint url we will use to send the message
        method: 'post',
        headers: {
            'Authorization': 'Bearer ' + process.env.WHATSAPP_TOKEN,
            'Content-Type': 'application/json' // send json data to the api
        },
        data: JSON.stringify({ // configure data properities
            messaging_product: 'whatsapp',
            to: '85269275379', // phone number which we are going to messsage to
            type: 'image', // user's image  response
            image: {     // configure text properties
                //link: 'https://dummyimage.com/600x400/000/fff.png&text=manfra.io',
                id: '2347066075665423',
                caption: 'This is a image message' // allow image
            }
             
        })
            

    })
    console.log(response.data) // add .data to get the body response
}

// upload png image from inside our project to whatsapp server
async function uploadImage() {
    const data = new FormData()
    data.append('messaging_product', 'whatsapp')
    data.append('file', fs.createReadStream(process.cwd() + '/DSa blue logo.jpg', {contentType: 'image/jpg'})) //process.cwd: returns the current working directory of our project
    data.append('type', 'image/jpg')

    const response = await axios({ 
        url:'https://graph.facebook.com/v21.0/600590879793242/media', // change 'message' to 'media'
        method: 'post',
        headers: {
            'Authorization': 'Bearer ' + process.env.WHATSAPP_TOKEN,
            // remove content-type = json
        },
        data: data // the media endpoint only accepts form data content
        // hence we need to create a javascript form data type
    })
    console.log(response.data) // add .data to get the body response
}

sendTemplateMessage() // call the function
