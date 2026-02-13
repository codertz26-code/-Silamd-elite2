const { silamd } = require("../silamd/sila");
const fs = require('fs');
const path = require('path');

const thumbnails = [
    "https://files.catbox.moe/krnlo3.jpeg",
    "https://files.catbox.moe/36vahk.png"
];

const randomThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)];
const AUDIO_URL = "https://files.catbox.moe/7ydtb3.mp3";

sila({ nomCom: 'setprefix',
    desc: 'Change bot command prefix',
    Categorie: 'Owner',
    reaction: '⚙️',
    fromMe: 'true',

}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, prefixe } = commandeOptions;
    const file = path.join(__dirname, '..', 'set.js');
    
    try {
        // Audio message
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
                    title: `⚙️ Prefix Settings`,
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

        if (!arg || arg.length === 0) {
            const buttons = [
                { buttonId: `${prefixe}setprefix .`, buttonText: { displayText: "🟢 . (Dot)" }, type: 1 },
                { buttonId: `${prefixe}setprefix /`, buttonText: { displayText: "🔵 / (Slash)" }, type: 1 },
                { buttonId: `${prefixe}setprefix !`, buttonText: { displayText: "🟡 ! (Mark)" }, type: 1 },
                { buttonId: `${prefixe}setprefix #`, buttonText: { displayText: "🔴 # (Hash)" }, type: 1 }
            ];
            
            await zk.sendMessage(dest, {
                image: { url: randomThumbnail },
                caption: `╔════════════════════════════════╗
║  ⚙️ PREFIX SETTINGS ⚙️  ║
╚════════════════════════════════╝

*Current Prefix:* ${prefixe}

This changes the command prefix for the entire bot.

Examples of prefixes:
🟢 . (Dot) - .menu, .alive, .song
🔵 / (Slash) - /menu, /alive, /song
🟡 ! (Mark) - !menu, !alive, !song
🔴 # (Hash) - #menu, #alive, #song

Or type any custom prefix:
${prefixe}setprefix $
${prefixe}setprefix ~`,
                footer: "SILA-MD Prefix © 2026",
                buttons: buttons,
                headerType: 4
            });
            return;
        }

        // Set custom prefix
        const newPrefix = arg[0];
        
        // Read current set.js
        let content = fs.readFileSync(file, 'utf8');
        
        // Replace prefix in set.js
        content = content.replace(/prefix\s*:\s*['"][^'"]*['"]/g, `prefix: '${newPrefix}'`);
        
        fs.writeFileSync(file, content);
        repondre(`✅ Prefix changed to: *${newPrefix}*\n\nNow use *${newPrefix}menu* to see commands!`);

    } catch (e) {
        console.log("❌ Setprefix Command Error: " + e);
        repondre("❌ Error: " + e.message);
    }
});
