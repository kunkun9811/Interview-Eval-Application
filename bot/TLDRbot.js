'use strict';

// import environment variables
import dotenv from 'dotenv';
dotenv.config();

// Extract the required classes from the discord.js module
import { Client, Message } from 'discord.js';

/** Parsing helper function */
// const {ParseMessage}  = require('./ParseMessage');
import { GoToLink, GenerateMessageEmbed, ParseMessage} from './ParseMessage.js';

// set success and failure colors
var BOT_SUCCESS = 0x007e33;
var BOT_FAILURE = 0xcc0000;
// Create an instance of a Discord client
const client = new Client();

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */

client.on('ready', () => {
  console.log('I am yours truly, tldr bot!');
});

client.on('message', message => {
  //parse message
  let link = ParseMessage(message);

  //if link exists and is not the empty string
  if(link && link != ""){
    //message.channel.send("Heading to " + link + ", be back with summary soon :)");
    //create empty message object

    let embedJson = {
      color: 0x000000,
      title: "", 
      description: ""
    };
    
    GoToLink(link).then(response => {
      // when promise is resolved, generate message and output to discord.
      console.log("YAY Resolved: " + JSON.stringify(response));
      // populate object
      embedJson["color"] = BOT_SUCCESS;
      embedJson["title"] = "Summary";
      embedJson["description"] = response["message"];
      // generate message
      GenerateMessageEmbed(message.channel, embedJson);
    }).catch(rejection =>{
      console.log("Error: " + rejection);
      // populate object
      embedJson["color"] = BOT_FAILURE;
      embedJson["title"] = "ERROR";
      embedJson["description"] = rejection;
      // generate message
      GenerateMessageEmbed(message.channel, embedJson);
    });
  }
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.BOT_TOKEN);