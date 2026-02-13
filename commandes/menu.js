const { silamd } = require("../silamd/sila");
const moment = require("moment-timezone");
const fs = require('fs');
const path = require('path');
const { getBuffer } = require("../silamd/dl/Function");
const { default: axios } = require('axios');

// Runtime function
const runtime = function (seconds) { 
    seconds = Number(seconds); 
    var d = Math.floor(seconds / (3600 * 24)); 
    var h = Math.floor((seconds % (3600 * 24)) / 3600); 
    var m = Math.floor((seconds % 3600) / 60); 
    var s = Math.floor(seconds % 60); 
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " d, ") : ""; 
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " h, ") : ""; 
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " m, ") : ""; 
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " s") : ""; 
    return dDisplay + hDisplay + mDisplay + sDisplay; 
};

// Font converter for 𝚂𝙸𝙻𝙰 𝚃𝙴𝙲𝙷 style
function convertToMonospace(text) {
    const normal = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const monospace = '𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣';
    let result = '';
    for (let char of text) {
        const index = normal.indexOf(char);
        result += index !== -1 ? monospace[index] : char;
    }
    return result;
}

// Function to scan commands from folder
function getCommandsByCategory() {
    const commandsPath = path.join(__dirname);
    const categories = {};
    
    try {
        const files = fs.readdirSync(commandsPath).filter(file => 
            file.endsWith('.js') && !file.includes('menu')
        );
        
        files.forEach(file => {
            const filePath = path.join(commandsPath, file);
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const categoryMatch = content.match(/Categorie:\s*['"]([^'"]+)['"]/);
                const nomComMatch = content.match(/nomCom:\s*['"]([^'"]+)['"]/);
                const descMatch = content.match(/desc:\s*['"]([^'"]+)['"]/);
                
                if (nomComMatch) {
                    const category = categoryMatch ? categoryMatch[1] : 'Uncategorized';
                    const command = nomComMatch[1];
                    const description = descMatch ? descMatch[1] : 'No description';
                    
                    if (!categories[category]) {
                        categories[category] = [];
                    }
                    categories[category].push({ command, description });
                }
            } catch (e) {
                console.log(`Error reading ${file}:`, e);
            }
        });
    } catch (e) {
        console.log('Error scanning commands:', e);
    }
    
    return categories;
}

// Main menu command
silamd({ 
    nomCom: 'menu',
    desc: 'Show all bot commands',
    Categorie: 'General',
    reaction: '📋', 
    fromMe: 'true',
},
async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, prefixe } = commandeOptions;
    
    try {
        const categories = getCommandsByCategory();
        
        const botName = convertToMonospace('SILA TECH');
        const header = `╭─❏ *${botName}* ❏─╮
│  ⏰ *Runtime*: ${runtime(process.uptime())}
│  👤 *Owner*: 255789661031
│  📦 *Commands*: ${Object.values(categories).flat().length}
╰────────────────╯\n\n`;
        
        let menuText = header;
        const sortedCategories = Object.keys(categories).sort();
        
        sortedCategories.forEach((category, index) => {
            menuText += `┏━━━❰ *${category.toUpperCase()}* ❱━━━┓\n`;
            const sortedCommands = categories[category].sort((a, b) => 
                a.command.localeCompare(b.command)
            );
            
            sortedCommands.forEach(cmd => {
                menuText += `┃ ✦ *${prefixe}${cmd.command}* : ${cmd.description}\n`;
            });
            
            menuText += `┗━━━━━━━━━━━━━━━━━━┛\n\n`;
        });
        
        menuText += `\n╭─❏ *${convertToMonospace('SILA BOT')}* ❏─╮
│  💡 *Total*: ${Object.values(categories).flat().length} commands
│  📌 *Prefix*: ${prefixe}
│  ⚡ *Status*: Online
╰────────────────╯`;
        
        // Buttons - Now they directly call the commands
        const buttons = [
            { 
                buttonId: `${prefixe}getbot`, 
                buttonText: { displayText: '🤖 GET BOT' }, 
                type: 1 
            },
            { 
                buttonId: `${prefixe}owner`, 
                buttonText: { displayText: '👑 OWNER' }, 
                type: 1 
            }
        ];
        
        const njabulox = [
            "https://files.catbox.moe/krnlo3.jpeg",
            "https://files.catbox.moe/36vahk.png",
            "https://files.catbox.moe/j7kue0.jpeg",
            "https://files.catbox.moe/edcfwx.jpeg",
            "https://files.catbox.moe/98k75b.jpeg"
        ];
        const randomThumbnail = njabulox[Math.floor(Math.random() * njabulox.length)];
        
        await zk.sendMessage(dest, { 
            text: menuText,
            footer: `➤®${botName}`,
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402325089913@newsletter',
                    newsletterName: `➤®${botName}`,
                    serverMessageId: 143,
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: `📋 BOT MENU - ${runtime(process.uptime())}`,
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: randomThumbnail,
                    renderLargerThumbnail: true,
                }
            }
        }, { 
            quoted: {
                key: {
                    fromMe: false,
                    participant: `0@s.whatsapp.net`,
                    remoteJid: "status@broadcast"
                },
                message: {
                    contactMessage: {
                        displayName: "𝐒𝐈𝐋𝐀",
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:𝐒𝐈𝐋𝐀-𝐌𝐃;BOT;;;\nFN:𝐒𝐈𝐋𝐀-𝐌𝐃\nitem1.TEL;waid=255789661031:+255789661031\nitem1.X-ABLabel:Bot\nEND:VCARD`
                    }
                }
            } 
        });
        
    } catch (e) {
        console.log("❌ Menu Command Error: " + e);
        repondre("❌ Error loading menu: " + e);
    }
});