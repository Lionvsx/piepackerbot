const path = require('path');
const fs = require('fs-extra').promises;
const BaseCommand = require('./structures/BaseCommand');
const BaseEvent = require('./structures/BaseEvent');
const BaseInteraction = require('./structures/BaseInteraction')
const {Client} = require('discord.js')

const ascii = require('ascii-table');
let table = new ascii('Commands');
let interactionTable = new ascii('Interactions');
table.setHeading('Command', 'Status')
interactionTable.setHeading('Interaction', 'Status')

const Logger = require('../utils/services/logger')
const registerLogger = new Logger('register');

/**
 *
 * @param client {Client}
 * @param dir {string}
 * @returns {Promise<void>}
 */
async function registerCommands(client, dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) await registerCommands(client, path.join(dir, file));
    if (file.endsWith('.js')) {
      const Command = require(path.join(filePath, file));
      if (Command.prototype instanceof BaseCommand) {
        const cmd = new Command();
        table.addRow(`${cmd.name}.js`,'✅')
        await client.commands.set(cmd.name, cmd);
        if (!cmd.name && cmd.help) {
          table.addRow(`${cmd.name}.js`, '❌ -> Error in the structure')
        }
      }
    }
  }
}

/**
 *
 * @param client {Client}
 * @param dir {String}
 * @returns {Promise<void>}
 */
async function registerEvents(client, dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) await registerEvents(client, path.join(dir, file));
    if (file.endsWith('.js')) {
      const Event = require(path.join(filePath, file));
      if (Event.prototype instanceof BaseEvent) {
        const event = new Event();
        client.on(event.name, event.run.bind(event, client));
      }
    }
  }
}

/**
 *
 * @param client {Client}
 * @param dir {String}
 * @returns {Promise<void>}
 */
async function registerInteractions(client, dir = '') {
  const filePath = path.join(__dirname, dir);
  const files = await fs.readdir(filePath);
  for (const file of files) {
    const stat = await fs.lstat(path.join(filePath, file));
    if (stat.isDirectory()) await registerInteractions(client, path.join(dir, file));
    if (file.endsWith('.js')) {
      const Interaction = require(path.join(filePath, file));
      if (Interaction.prototype instanceof BaseInteraction) {
        const inter = new Interaction();
        interactionTable.addRow(`${inter.name}.js`,'✅')
        client.interactions.set(inter.name, inter);
        if (!inter.name && inter.help) {
          interactionTable.addRow(`${inter.name}.js`, '❌ -> Error in the structure')
        }
      }
    }
  }
}

/**
 * Display
 */
function showCommandLoad() {
  if (table.__rows.length !== 0) {
    console.log(table.toString());
  } else {
    registerLogger.info(`No commands to load !`)
  }
  if (interactionTable.__rows.length !== 0) {
    console.log(interactionTable.toString());
  } else {
    registerLogger.info(`No interactions to load !`)
  }
}

module.exports = { 
    registerCommands,
    registerEvents,
    showCommandLoad,
    registerInteractions
  };