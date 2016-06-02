var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

//URL
/* https://floating-falls-19686.herokuapp.com/ */
/* Restart Heroku */
//cd into directory
//heroku restart

//Access Page Token - REference the Token file
var token = "CAAPAYGiaAOIBAGme6IZAiiZBX8fvIpy1cZBLW2zDE31A64XDpCJoms7lMznueTU306ah4m9Mjo90MlIWjIt1ZBaGYrytZA7iBBMpqbni4LPOojYVye8B0tjuW0RsnfP9PJqrYsrKsUdN8oZAtSxZC1X4ZCeuxjRmd9WR76Tt8wvgLTrZB4ZB3gpqRQrff3jDDhgDMZD"

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a meme bot 2.0')
})

//Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'hello_meme_bot') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

//Responses
app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'Meme') {
                sendMeme(sender)
                continue
            }
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})


//Normal Text
function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {        
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

//Swaggy P Meme
function sendMeme(sender)
{
    messageData = {
        "attachment":{
            "type":"image",
            "payload":{
                "url":"http://www.geeksandcleats.com/wp-content/uploads/2015/06/nick-young-confused-face-300x256.png"
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    },function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })

}

