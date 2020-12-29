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
  MessageEmbed
} from 'discord.js';
import puppeteer from 'puppeteer';
import fetch from 'node-fetch';

var API_URL = 'http://127.0.0.1:5000/';
// Input: !tldr SOME_LINK
// Output: Some summary of the article/website/etc
export const ParseMessage = async message => {
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
      //TODO: return link, go to link in TLDRbot.js 

      // Navigate to link
      const response = await GoToLink(link).then(response => {
        //when promise is resolved, set message and return
        console.log("ParseMessage message: " + JSON.stringify(response));
        return response;
      });
      //TODO: Output message in TLDRbot.js
      OutputMessage(message, response["message"]);
    }
  }
}

/* outputs embedded message to discord chat */
export const OutputMessage = (msg, summary) => {
  // create MessageEmbed instance
  const embed = new MessageEmbed()
    .setTitle('A slick little embed')   // Set the title of the field
    .setColor(0xff0000)                 // Set the color of the embed
    .setDescription(summary);   // Set the main content of the embed
  
  // Send the embed to the same channel as the message
  msg.channel.send(embed);
}

/* Creates a page instance */
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
  }

  for(let i in texts_json){
    console.log(`${i} = ${texts_json[i]}`);
  }

  return fetch(`${API_URL}/datatext`, {
    method: "POST",
    body: JSON.stringify(texts_json)
  })
  .then((response) => {
    if(!response.ok){
      //throw error for catch block
      throw new Error(`HTTP error! status: ${response.status}`);
    }else{
      return response.json();
    }
  })
  .then(responseJson => {
    //console.log("logging data: " + JSON.stringify(responseJson));
    return responseJson;
  })
  .catch(e => {
    //catch errors in fetch
    console.log("Error with fetch: " + e.message);
    return e;
  });
}