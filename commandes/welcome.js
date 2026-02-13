const { silamd } = require("../silamd/sila");
const fs = require('fs');
const path = require('path');

const thumbnails = [
    "https://files.catbox.moe/krnlo3.jpeg",
    "https://files.catbox.moe/36vahk.png"
];

const randomThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)];
const AUDIO_URL = "https://files.catbox.moe/7ydtb3.mp3";

sila({ nomCom: 'welcome',
    desc: 'Set welcome message for new members',
    Categorie: 'Group',
    reaction: '👋',
    fromMe: 'true',

}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, prefixe, isAdminMessage, isGroupMessage } = commandeOptions;
    
    try {
        if (!isGroupMessage) {
            return await repondre("❌ This command is only for groups");
        }

        if (!isAdminMessage) {
            return await repondre("❌ Only admins can use this command");
        }

        const file = path.join(__dirname, '..', 'features.json');
        let features = {};
        if (fs.existsSync(file)) features = JSON.parse(fs.readFileSync(file));
        const key = 'welcome';
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
                    title: `👋 Welcome System`,
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
                { buttonId: `${prefixe}welcome on`, buttonText: { displayText: '✅ Turn ON' }, type: 1 },
                { buttonId: `${prefixe}welcome off`, buttonText: { displayText: '❌ Turn OFF' }, type: 1 }
            ];
            
            await zk.sendMessage(dest, {
                image: { url: randomThumbnail },
                caption: `╔════════════════════════════════╗
║  👋 WELCOME MESSAGE 👋  ║
╚════════════════════════════════╝

*Current Status:* ${current === 'yes' ? '✅ ON' : '❌ OFF'}

This feature sends a welcome message when new members join.

Choose an option:

✅ Turn ON - Welcome new members
❌ Turn OFF - Disable welcomes`,
                footer: "SILA-MD Welcome © 2026",
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
        repondre(`✅ Welcome messages is now: *${next === 'yes' ? 'ON ✅' : 'OFF ❌'}*`);

    } catch (e) {
        console.log("❌ Welcome Command Error: " + e);
        repondre("❌ Error: " + e.message);
    }
});
