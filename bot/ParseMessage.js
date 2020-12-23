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

      // Navigate to link
      await GoToLink(link);
    }

    OutputMessage(message);    
  }
}

/* outputs embedded message to discord chat */
const OutputMessage = (msg) => {
  // create MessageEmbed instance
  const embed = new MessageEmbed()
    .setTitle('A slick little embed')   // Set the title of the field
    .setColor(0xff0000)                 // Set the color of the embed
    .setDescription('Hello, this is a slick embed!');   // Set the main content of the embed
  
  // Send the embed to the same channel as the message
  msg.channel.send(embed);
}

/* Creates a page instance */
const GoToLink = async link => {
  /* TODO: TESTING - to be deleted */

  // Create a browser instance and page instance
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Go to the link
  console.log("Going to: " + link);
  await page.goto(link);
  console.log("Reached: " + link);
    
  // Grab all the text in p tags - In our production version we would probably need to handle <p> <span> ... </span> </p> AND <p> ... </p> duplicate text
  var links = await page.evaluate(async () => {
    let a_elements = Array.from(document.querySelectorAll('p'));
    let links = a_elements.map(a => a.textContent);
    return links
  });

  // Print out the search result links
  console.log(links);
  

  /* END */

  await browser.close();
}