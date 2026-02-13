const { silamd } = require("../silamd/sila");
const fs = require('fs');
const path = require('path');
const moment = require("moment-timezone");

const menuImage = "https://files.catbox.moe/36vahk.png";
const AUDIO_URL = "https://files.catbox.moe/7ydtb3.mp3";

const thumbnails = [
    "https://files.catbox.moe/krnlo3.jpeg",
    "https://files.catbox.moe/36vahk.png"
];

const randomThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)];

// Get all commands from folder
const getCommands = () => {
    try {
        const commandsDir = path.join(__dirname);
        const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));
        
        const commandList = [];
        files.forEach(file => {
            const name = file.replace('.js', '');
            if (name !== 'menu2') {
                commandList.push(name);
            }
        });
        
        return commandList;
    } catch (e) {
        console.log("Error reading commands:", e);
        return [];
    }
};

sila({
    nomCom: 'menu',
    reaction: '📋',
    desc: 'Show bot menu with all commands',
    Categorie: 'General',
    fromMe: 'true'
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre, prefixe } = commandeOptions;
    
    // Get all commands
    const allCommands = getCommands();
    
    // Create buttons (max 10 per message in WhatsApp)
    const buttons = [];
    const commandButtons = [
        { buttonId: `${prefixe}getbot`, buttonText: { displayText: "🤖 Get Bot" }, type: 1 },
        { buttonId: `${prefixe}owner`, buttonText: { displayText: "👨‍💼 Owner" }, type: 1 }
    ];

    const buttonMessage = {
        image: { url: menuImage },
        caption: `╔════════════════════════════════╗
║    🤖 𝐒𝐈𝐋𝐀-𝐌𝐃 𝐌𝐄𝐍𝐔 🤖    ║
╚════════════════════════════════╝

👋 Welcome to SILA-MD Bot
⏰ Time: ${moment().tz("Africa/Nairobi").format("DD/MM/YYYY HH:mm")}

📋 *Available Commands (${allCommands.length}):*
━━━━━━━━━━━━━━━━━━━━━━━━

${allCommands.map((cmd, i) => `${i + 1}. ${prefixe}${cmd}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━

*Quick Access:*
Click buttons or type commands with prefix: ${prefixe}

Example: ${prefixe}alive
         ${prefixe}song shape of you

> © Powered by Sila Tech`,
        footer: "SILA-MD Bot © 2026",
        buttons: commandButtons,
        headerType: 4
    };

    // Audio message
    await zk.sendMessage(dest, { 
        audio: { url: AUDIO_URL }, 
        mimetype: 'audio/mp4', 
        ppt: true,
        contextInfo: {
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363402325089913@newsletter',
                newsletterName: "➤®𝐒𝐈𝐋𝐀-𝐌𝐃",
                serverMessageId: 143,
            },
            forwardingScore: 999,
            externalAdReply: {
                title: `📋 SILA-MD Menu (${allCommands.length} commands)`,
                mediaType: 1,
                previewType: 0,
                thumbnailUrl: randomThumbnail,
                renderLargerThumbnail: true,
            },
        },
    }, { quoted: {
        key: {
            fromMe: false,
            participant: `0@s.whatsapp.net`,
            remoteJid: "status@broadcast"
        },
        message: {
            contactMessage: {
                displayName: "𝐒𝐈𝐋𝐀-𝐌𝐃",
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:𝐒𝐈𝐋𝐀-𝐌𝐃;BOT;;;\nFN:𝐒𝐈𝐋𝐀-𝐌𝐃\nitem1.TEL;waid=255789661031:+255789661031\nitem1.X-ABLabel:Bot\nEND:VCARD`
            }
        }
    } });

    await zk.sendMessage(dest, buttonMessage);

} catch (e) {
    console.log("❌ Menu Command Error: " + e);
    repondre("❌ Error: " + e);
}
});
