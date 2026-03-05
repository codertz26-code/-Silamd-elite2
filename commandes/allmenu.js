const { silamd } = require("../silamd/sila");
const fs = require('fs');
const path = require('path');
const moment = require("moment-timezone");

const menuImage = "https://files.catbox.moe/36vahk.png";

// FakevCard
const fkontak = {
    "key": {
        "participant": '0@s.whatsapp.net',
        "remoteJid": '0@s.whatsapp.net',
        "fromMe": false,
        "id": "Halo"
    },
    "message": {
        "conversation": "𝚂𝙸𝙻𝙰"
    }
};

// Function to extract all nomCom from a file
const extractCommandsFromFile = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const commands = [];
        
        // Regex to find all nomCom occurrences
        const nomComRegex = /nomCom:\s*['"]([^'"]+)['"]/g;
        let match;
        
        while ((match = nomComRegex.exec(content)) !== null) {
            commands.push(match[1]);
        }
        
        return commands;
    } catch (e) {
        console.log("Error extracting commands from file:", e);
        return [];
    }
};

// Get all commands from all files
const getAllCommands = () => {
    try {
        const commandsDir = path.join(__dirname);
        const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));
        
        const allCommands = [];
        const commandDetails = []; // For detailed info
        
        files.forEach(file => {
            const filePath = path.join(commandsDir, file);
            const fileName = file.replace('.js', '');
            
            // Skip menu files
            if (fileName === 'menu' || fileName === 'allmenu' || fileName === 'menu2') return;
            
            const commands = extractCommandsFromFile(filePath);
            
            // Add each command to the list
            commands.forEach(cmd => {
                allCommands.push(cmd);
                commandDetails.push({
                    command: cmd,
                    file: fileName,
                    category: extractCategory(filePath)
                });
            });
        });
        
        return { allCommands, commandDetails };
    } catch (e) {
        console.log("Error reading commands:", e);
        return { allCommands: [], commandDetails: [] };
    }
};

// Extract category from file
const extractCategory = (filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const categoryMatch = content.match(/Categorie:\s*['"]([^'"]+)['"]/);
        return categoryMatch ? categoryMatch[1] : 'General';
    } catch (e) {
        return 'General';
    }
};

// Group commands by category
const getCommandsByCategory = () => {
    try {
        const commandsDir = path.join(__dirname);
        const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));
        
        const categories = {};
        
        files.forEach(file => {
            const filePath = path.join(commandsDir, file);
            const fileName = file.replace('.js', '');
            
            if (fileName === 'menu' || fileName === 'allmenu' || fileName === 'menu2') return;
            
            const commands = extractCommandsFromFile(filePath);
            const category = extractCategory(filePath);
            
            if (!categories[category]) {
                categories[category] = [];
            }
            
            // Add all commands from this file to the category
            commands.forEach(cmd => {
                categories[category].push(cmd);
            });
        });
        
        // Sort commands within each category
        for (let cat in categories) {
            categories[cat].sort();
        }
        
        return categories;
    } catch (e) {
        console.log("Error reading commands by category:", e);
        return {};
    }
};

silamd({
    nomCom: 'allmenu',
    alias: ['allmenu', 'allcmd', 'commands', 'cmds', 'all', 'menuall'],
    reaction: '📚',
    desc: 'Show all bot commands',
    Categorie: 'General',
    fromMe: 'true'
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre, prefixe, nomAuteurMessage } = commandeOptions;

    const { allCommands, commandDetails } = getAllCommands();
    const categories = getCommandsByCategory();
    const categoryNames = Object.keys(categories);

    // Buttons: Menu, Owner, Get Bot
    const commandButtons = [
        { buttonId: `${prefixe}menu`, buttonText: { displayText: "📋 𝙼𝙴𝙽𝚄" }, type: 1 },
        { buttonId: `${prefixe}owner`, buttonText: { displayText: "👨‍💼 𝙾𝚆𝙽𝙴𝚁" }, type: 1 },
        { buttonId: `${prefixe}getbot`, buttonText: { displayText: "🤖 𝙶𝙴𝚃 𝙱𝙾𝚃" }, type: 1 }
    ];

    // Generate commands list
    let commandsText = `┏━❑ 𝙰𝙻𝙻 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂 ━━━━━━━━━
┃ 📊 *𝚃𝚘𝚝𝚊𝚕:* ${allCommands.length}
┃ 👥 *𝙲𝚊𝚝𝚎𝚐𝚘𝚛𝚒𝚎𝚜:* ${categoryNames.length}
┃ 📁 *𝙵𝚒𝚕𝚎𝚜:* ${commandDetails.length ? 'Multiple' : '0'}
┗━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (categoryNames.length > 0) {
        for (const category of categoryNames.sort()) {
            commandsText += `┏━❑ *${category.toUpperCase()}* ━━━━━━━━━\n`;
            categories[category].forEach((cmd, index) => {
                commandsText += `┃ ${index + 1}. ${prefixe}${cmd}\n`;
            });
            commandsText += `┗━━━━━━━━━━━━━━━━━━━━\n\n`;
        }
    } else {
        commandsText += `┃ ❌ No commands found\n┗━━━━━━━━━━━━━━━━━━━━\n\n`;
    }

    // Optional: Show detailed breakdown by file
    const showFileBreakdown = false; // Set to true if you want to see which commands are in which files
    
    if (showFileBreakdown) {
        commandsText += `┏━❑ 𝙱𝚈 𝙵𝙸𝙻𝙴 ━━━━━━━━━\n`;
        const files = fs.readdirSync(path.join(__dirname)).filter(f => f.endsWith('.js') && !f.includes('menu'));
        
        files.forEach(file => {
            const filePath = path.join(__dirname, file);
            const commands = extractCommandsFromFile(filePath);
            if (commands.length > 0) {
                commandsText += `┃ 📄 ${file} (${commands.length}):\n`;
                commands.forEach((cmd, i) => {
                    commandsText += `┃   ${i+1}. ${prefixe}${cmd}\n`;
                });
            }
        });
        commandsText += `┗━━━━━━━━━━━━━━━━━━━━\n\n`;
    }

    const buttonMessage = {
        text: commandsText + `━━━━━━━━━━━━━━━━━━━━\n> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
        footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝙾𝚃 © 2026",
        buttons: commandButtons,
        headerType: 1,
        contextInfo: {
            mentionedJid: [dest],
            externalAdReply: {
                title: `📚 𝙰𝚕𝚕 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜 (${allCommands.length})`,
                body: `👤 @${dest.split('@')[0]}`,
                mediaType: 1,
                previewType: 0,
                thumbnailUrl: menuImage,
                sourceUrl: 'https://github.com/',
                renderLargerThumbnail: false,
            }
        }
    };

    await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });

} catch (e) {
    console.log("❌ Allmenu Error: " + e);
    repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
}
});
