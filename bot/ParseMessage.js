/**
 * Some Notes:
 *    (1) "link" has to be a full link instead of say "google.com", it has to be "https://www.google.com" <-- might need to mention this in our documentation
 *    (2) Puppetteer doc says that "headless" mode doesn't support navigation to pdf documentation
 * 
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

  // Go to the link - Note
  console.log("Going to: " + link);
  await page.goto(link);
  console.log("Reached: " + link);

  // Modifies the search bar value
  await page.evaluate(async () => {
    document.querySelector('input[name="q"]').value = 'displate';
  });

  // Click the search button
  await Promise.all([
    page.waitForNavigation(),     // waitForNavigation - function that waits until a page's certain condition is met, default to "load"
    page.evaluate(() => {
      document.querySelector('input[value="Google Search"]').click();
    })
  ]);
    
  // Grab all the links (in this case all the search result links)
  var links = await page.evaluate(async () => {
    let a_elements = Array.from(document.querySelectorAll('a')).slice(50, 60);
    let links = a_elements.map(a => a.href);
    return links
  });

  // Print out the search result links
  console.log(links);
  

  /* END */

  await browser.close();
}