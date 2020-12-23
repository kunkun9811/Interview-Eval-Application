'use strict';

/**
 * An example of how you can send embeds
 */
import dotenv from 'dotenv';
dotenv.config();

// Extract the required classes from the discord.js module
import { Client, MessageEmbed } from 'discord.js';

/** Parsing helper function */
// const {ParseMessage}  = require('./ParseMessage');
import {ParseMessage} from './ParseMessage.js';
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
  ParseMessage(message);
});

// Log our bot in using the token from https://discord.com/developers/applications
client.login(process.env.BOT_TOKEN);