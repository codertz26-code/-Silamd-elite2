const { silamd } = require("../silamd/sila");
const moment = require("moment-timezone");
const { getBuffer } = require("../silamd/dl/Function");
const { default: axios } = require('axios');

const AUDIO_URL = "https://files.catbox.moe/7ydtb3.mp3";

const thumbnails = [
    "https://files.catbox.moe/krnlo3.jpeg",
    "https://files.catbox.moe/36vahk.png"
];

const randomThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)];

// Update messages structure
const updateMessages = {
    showAll: `╔════════════════════════════════╗
║  🔄 SILA-MD BOT UPDATE 🔄  ║
╚════════════════════════════════╝

✅ *Bot Updated Successfully!*

📋 *NEW FEATURES ADDED:*
━━━━━━━━━━━━━━━━━━━━━━━
✨ Update Command - Check bot updates
🔄 Enhanced Menu - Better UI/UX
📦 Repo Link - Easy access to source code
🎵 Audio Messages - Premium quality
⭐ GitHub Integration - Star & Follow

📝 *RECENT CHANGES:*
━━━━━━━━━━━━━━━━━━━━━━━
• Added update command with prefix support
• Menu buttons now fully functional
• Real-time response system activated
• Database integration improved

🚀 *Version:* 2.1.0
📅 *Updated:* ${moment().tz("Africa/Nairobi").format("DD/MM/YYYY HH:mm")}

> © Powered by Sila Tech`,
    
    commands: `╔════════════════════════════════╗
║  📋 ACTIVE COMMANDS 📋  ║
╚════════════════════════════════╝

*General Commands:*
⏰ .alive - Check bot status
📱 .owner - Contact owner
🔗 .repo - Get repository
📡 .ping - Response time
🔄 .update - Check updates
ℹ️ .menu - Show menu

*Download Commands:*
🎵 .song - Download music
🎬 .video - Download video

*Utility Commands:*
🖼️ .img - Search images
🎮 .play - Play games

Type the command with prefix to use!`,
    
    status: `╔════════════════════════════════╗
║  ✅ BOT STATUS ✅  ║
╚════════════════════════════════╝

*System Status:* 🟢 ONLINE
*Database:* 🟢 CONNECTED
*Commands:* 🟢 ACTIVE
*Prefix:* ✓ Working

✅ All systems operational!
📊 Bot is running smoothly
🎯 Ready for commands!

> © Powered by Sila Tech`,
    
    changelog: `╔════════════════════════════════╗
║  📝 CHANGELOG 📝  ║
╚════════════════════════════════╝

*v2.1.0 - Current*
✨ Added real update system
🔧 Fixed button responses
📱 Menu improvements

*v2.0.0 - Previous*
🎵 Audio message system
📦 Repo integration
⚡ Performance boost

> © Powered by Sila Tech`
};

sila({ nomCom: 'update',
    desc: 'Check and manage bot updates',
    Categorie: 'General',
    reaction: '🔄', 
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, prefixe } = commandeOptions;
      
    try {
        const buttons = [
            { buttonId: `${prefixe}update all`, buttonText: { displayText: "📋 All Updates" }, type: 1 },
            { buttonId: `${prefixe}update commands`, buttonText: { displayText: "📝 Commands" }, type: 1 },
            { buttonId: `${prefixe}update status`, buttonText: { displayText: "✅ Status" }, type: 1 },
            { buttonId: `${prefixe}update changelog`, buttonText: { displayText: "📊 Changelog" }, type: 1 }
        ];

        // First message with audio
        await zk.sendMessage(dest, { 
            audio: { url: AUDIO_URL }, 
            mimetype: 'audio/mp4', 
            ptt: true,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402325089913@newsletter',
                    newsletterName: "➤®𝐒𝐈𝐋𝐀-𝐌𝐃",
                    serverMessageId: 143,
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: `🔄 Bot Update System`,
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

        // Button message
        await zk.sendMessage(dest, {
            image: { url: randomThumbnail },
            caption: `🔄 *BOT UPDATE SYSTEM*

Select what you want to check:

🔹 All Updates - Full update details
🔹 Commands - List all active commands  
🔹 Status - Bot status check
🔹 Changelog - Version history

Click buttons below or use:
${prefixe}update all
${prefixe}update commands
${prefixe}update status
${prefixe}update changelog`,
            footer: "SILA-MD Update System © 2026",
            buttons: buttons,
            headerType: 4
        });

        // Handle sub-commands
        if (arg && arg.length > 0) {
            const subCommand = arg.join(" ").toLowerCase();
            
            if (subCommand.includes("all")) {
                await repondre(updateMessages.showAll);
            } else if (subCommand.includes("command")) {
                await repondre(updateMessages.commands);
            } else if (subCommand.includes("status")) {
                await repondre(updateMessages.status);
            } else if (subCommand.includes("changelog")) {
                await repondre(updateMessages.changelog);
            } else {
                await repondre("❌ Unknown option. Use: all, commands, status, or changelog");
            }
        }

    } catch (e) {
        console.log("❌ Update Command Error: " + e);
        repondre("❌ Error: " + e.message);
    }
});
