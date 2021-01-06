/**
 * Some Notes:
 *    (1) "link" has to be a full link instead of say "google.com", it has to be "https://www.google.com" <-- might need to mention this in our documentation
 *    (2) Puppetteer doc says that "headless" mode doesn't support navigation to pdf documentation
 *    (3) ** page.evaluate() is very flexible and easy to use, there are also other function puppeteer provides that have the same function as any document.___ functions w/out calling page.evaluate
 * 
 * -- Return value of ParseMessage.js --
 *    (1) I was thinking we can write to a textfile where each line is each <p> tag? In our models, we will just read the textfile and process the data
 */

import {
  Message,
  MessageEmbed
} from 'discord.js';
import puppeteer from 'puppeteer';
import fetch from 'node-fetch';

var API_URL = 'http://127.0.0.1:5000/';
var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi; // with http
//var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi                   // without http
var regex = new RegExp(expression);

//TODO: deprecated; remove after testing
// Input: !tldr SOME_LINK
// Output: Some summary of the article/website/etc

export const ParseMessageOld = async message => {
  if (message.content.length != 0) {
    // If the message is "!tldr (link)"
    let msgbody = message.content;

    //array of tokens
    // let tokens = msgbody.match(/\S+/g);
    let tokens = msgbody.trim().split(" ");
    console.log(tokens);  // DEBUG: TODO: To be deleted
    //summon bot with '!tldr (link.com');
    if (tokens[0] === "!tldr" && tokens[1].length != 0) {
      // process the second token (the link)
      let link = tokens[1];
      // Navigate to link
      const response = await GoToLink(link).then(response => {
        //when promise is resolved, set message and return
        console.log("ParseMessage message: " + JSON.stringify(response));
        return response;
      });
      OutputMessage(message.channel, response["message"]);
    }
  }
}

/* Generate message embed to discord chat */
// TODO: deprecated, remove after testing
export const OutputMessage = (channel, summary) => {
  // create MessageEmbed instance
  const embed = new MessageEmbed()
    .setTitle('A slick little embed')   // Set the title of the field
    .setColor(0xff0000)                 // Set the color of the embed
    .setDescription(summary);   // Set the main content of the embed
  
  // Send the embed to the same channel as the message
  channel.send(embed);
}

/**
 * parses message text for summon and returns a URL or empty string
 * @param {Object} message Discord message object
 * @returns {String} URL or empty string for invalid URLs
 */
export const ParseMessage =  message => {
  //check if message is summoning the bot
  if(message.content.startsWith("!tldr")){
    //split message into tokens
    let tokens = message.content.split(" ");
    //check if second token exists
    if(tokens[1] && tokens[1].length != 0){
      if (tokens[1].match(regex)) {
        //valid url
        console.log("Valid URL!");
        return tokens[1];
      } else {
        //invalid url (check lines 19-20 for reference)
        console.error("Invalid URL!");
        //send message to channel:
        message.channel.send("Invalid URL Provided!");
        return "";
      }
    }
  }
}

/**
 * Creates an embedded message based on parameters and sends it to specified channel
 * @param {Object} channel The channel to send message to
 * @param {Object} embedObj Message object of the form:
 * (color, title, description)
 */
export const GenerateMessageEmbed = (channel, embedObj) =>{
  //console.log(embedObj["color"].toString(16));
  const embed = new MessageEmbed()
    .setColor(embedObj["color"])          // set embed color (success or fail color)
    .setTitle(embedObj["title"])           // set title of field
    .setDescription(embedObj["description"])   // set message content

  channel.send(embed);
}

/* Creates a page instance */
/**
 * Goes to link, extracts <p> tags, 
 * ping server api and returns promise with server response
 * @param {String} link link for puppeteer to access
 * @returns {Promise} promise containing summary or error response
 * //TODO: not a modular function pls fix
 */
export const GoToLink = async link => {
  // Create a browser instance and page instance
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Go to the link
  console.log("Going to: " + link);
  await page.goto(link);
  console.log("Reached: " + link);

  // Grab all the text in p tags - In our production version we would probably need to handle <p> <span> ... </span> </p> AND <p> ... </p> duplicate text
  var texts = await page.evaluate(async () => {
    let p_elements = Array.from(document.querySelectorAll('p'));
    
    //array of text contained in the p tags
    let texts = p_elements.map(p => p.textContent);
    return texts;
  });

  // Print out the search result links
  console.log(texts);

  // Close the browser instance
  await browser.close();

  // Create a JSON object from the list of <p> tag texts list
  let texts_json = {};
  for(let i in texts) {
    texts_json[i] = texts[i];
    //console.log(`${i} = ${texts_json[i]}`);
  }

  //check if texts_json is empty
  if(Object.keys(texts_json).length !== 0){
    //console.log("texts_json is NOT empty");
    return fetch(`${API_URL}/datatext`, {
      method: "POST",
      body: JSON.stringify(texts_json)
    })
    .then((response) => {
      //console.log(response);
      if(!response.ok){
        //throw error for catch block
        throw new Error(`HTTP error! status: ${response.status}`);
      }else{
        return response.json();
      }
    })
    .catch(e => {
      //fetch error
      console.log("Error with fetch: " + e.message);
      return Promise.reject("Error with fetch: " + e.message);
    });
  }else{
    //console.log("texts_json is empty");
    return Promise.reject('No Summarizable text found.');
  }
}