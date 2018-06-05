// Copyright 2018, Ishan Khatri

'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
    dialogflow,
    Permission,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'.
app.intent('favorite color', (conv, {color}) => {
    const luckyNumber = color.length;
    // Respond with the user's lucky number and end the conversation.
    if(conv.data.userName){
        conv.close(`${conv.data.userName}, your lucky number is ` + luckyNumber);
    } else {
        conv.close('Your lucky number is ' + luckyNumber);
    }
});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

// Override the default welcome intent in order to ask for permission to use the user's name
app.intent('Default Welcome Intent', (conv) => {
    conv.ask(new Permission({
        context: 'Hey! In order to get to know you better',
        permissions: 'NAME'
    }));
});

// Set up a custom intent to respond to the users query regardless of their permissions
app.intent('actions_intent_PERMISSION', (conv, params, permissionGranted) => {
    if(!permissionGranted){
        conv.ask('Ok, no worries. What\'s your favorite color');
    } else {
        conv.data.userName = conv.user.name.given;
        conv.ask(`Thanks, ${conv.data.userName}. What's your favorite color?`);
    }
});

// Intent to return one's sleep score
app.intent('sleep score', (conv) => {
    const sleepScore = Math.floor((Math.random() * 100) + 1);
    if(conv.data.userName){
        if(sleepScore > 80){
            conv.close(`Great job, ${conv.data.userName}, your sleep score of ` + sleepScore + ' was excellent. Keep it up!');
        } else {
            conv.close('Your sleep score was ' + sleepScore + ' the best way to improve your score is to get more sleep.');
        }
    } else{
        conv.close('Your sleep score for last night was' + sleepScore);
    }
});