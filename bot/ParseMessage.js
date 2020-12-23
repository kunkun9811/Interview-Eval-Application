import {
  MessageEmbed
} from 'discord.js';
import puppeteer from 'puppeteer';

// Input: !tldr SOME_LINK
// Output: Some summary of the article/website/etc
export const ParseMessage = message => {
  if (message.content.length != 0) {
    // If the message is "!tldr (link)"
    let msgbody = message.content;
    //array of tokens
    // let tokens = msgbody.match(/\S+/g);
    let tokens = msgbody.trim().split(" ");
    console.log(tokens);
    //summon bot with '!tldr (link.com');
    if (tokens[0] === "!tldr" && tokens[1].length != 0) {
      // process the second token (the link)
      let link = tokens[1];
      console.log("going to: " + link);
      await GoToLink(link);
    }
  }
}

const OutputMessage = () => {
  const embed = new MessageEmbed()
    // Set the title of the field
    .setTitle('A slick little embed')
    // Set the color of the embed
    .setColor(0xff0000)
    // Set the main content of the embed
    .setDescription('Hello, this is a slick embed!');
    // Send the embed to the same channel as the message
  message.channel.send(embed);
}

const GoToLink = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://example.com');


  await browser.close();
}