const { silamd } = require("../silamd/sila");
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const thumbnails = [
    "https://files.catbox.moe/krnlo3.jpeg",
    "https://files.catbox.moe/36vahk.png"
];

const randomThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)];
const AUDIO_URL = "https://files.catbox.moe/7ydtb3.mp3";

sila({ nomCom: 'chatbot',
    desc: 'Toggle Chatbot AI (on/off) with voice support',
    Categorie: 'Config',
    reaction: '🤖',
    fromMe: 'true',

}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, prefixe, isGroupMessage } = commandeOptions;
    const file = path.join(__dirname, '..', 'features.json');
    let features = {};
    if (fs.existsSync(file)) features = JSON.parse(fs.readFileSync(file));
    const key = `CHATBOT_${dest}`;
    const current = features[key] || 'no';

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
                title: `🤖 Chatbot AI System`,
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
            { buttonId: `${prefixe}chatbot on`, buttonText: { displayText: '✅ Turn ON' }, type: 1 },
            { buttonId: `${prefixe}chatbot off`, buttonText: { displayText: '❌ Turn OFF' }, type: 1 }
        ];
        
        await zk.sendMessage(dest, {
            image: { url: randomThumbnail },
            caption: `╔════════════════════════════════╗
║  🤖 CHATBOT AI SYSTEM 🤖  ║
╚════════════════════════════════╝

*Current Status:* ${current === 'yes' ? '✅ ON' : '❌ OFF'}

AI Chatbot responds to all messages automatically.
Just send a message, no prefix needed!

Features:
🤖 AI Powered Responses
📱 Works in Inbox & Groups (if enabled)
💬 Automatic replies
🎤 Voice support available

Choose an option:

✅ Turn ON - Enable chatbot
❌ Turn OFF - Disable chatbot`,
            footer: "SILA-MD Chatbot © 2026",
            buttons: buttons,
            headerType: 4
        });
        return;
    }

    let next = current === 'yes' ? 'no' : 'yes';
    if (arg) {
        const a = arg.toString().toLowerCase();
        if (a === 'on' || a === 'yes') next = 'yes';
        if (a === 'off' || a === 'no') next = 'no';
    }
    features[key] = next;
    fs.writeFileSync(file, JSON.stringify(features, null, 2));
    repondre(`✅ Chatbot is now: *${next === 'yes' ? 'ON ✅' : 'OFF ❌'}*`);
});
