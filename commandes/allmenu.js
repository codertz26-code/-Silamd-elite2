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

// Get all commands from folder
const getCommands = () => {
    try {
        const commandsDir = path.join(__dirname);
        const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));

        const commandList = [];
        files.forEach(file => {
            const name = file.replace('.js', '');
            if (name !== 'menu' && name !== 'allmenu' && name !== 'menu2') {
                commandList.push(name);
            }
        });

        return commandList;
    } catch (e) {
        console.log("Error reading commands:", e);
        return [];
    }
};

// Group commands by category
const getCommandsByCategory = () => {
    try {
        const commandsDir = path.join(__dirname);
        const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));

        const categories = {};

        files.forEach(file => {
            const name = file.replace('.js', '');
            if (name === 'menu' || name === 'allmenu' || name === 'menu2') return;

            let category = 'General';
            try {
                const commandPath = path.join(commandsDir, file);
                const commandContent = fs.readFileSync(commandPath, 'utf8');
                const categoryMatch = commandContent.match(/Categorie:\s*['"]([^'"]+)['"]/);
                if (categoryMatch && categoryMatch[1]) {
                    category = categoryMatch[1];
                }
            } catch (e) {}

            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(name);
        });

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

    const allCommands = getCommands();
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
┗━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (categoryNames.length > 0) {
        for (const category of categoryNames.sort()) {
            commandsText += `┏━❑ *${category.toUpperCase()}* ━━━━━━━━━\n`;
            categories[category].sort().forEach((cmd, index) => {
                commandsText += `┃ ${index + 1}. ${prefixe}${cmd}\n`;
            });
            commandsText += `┗━━━━━━━━━━━━━━━━━━━━\n\n`;
        }
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