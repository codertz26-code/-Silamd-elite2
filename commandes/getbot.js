const { silamd } = require("../silamd/sila");
const moment = require("moment-timezone");

const thumbnails = [
    "https://files.catbox.moe/krnlo3.jpeg",
    "https://files.catbox.moe/36vahk.png"
];

const randomThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)];

const AUDIO_URL = "https://files.catbox.moe/7ydtb3.mp3";
const REPO_LINK = "https://github.com/codertz26-code/-Silamd-elite2";
const CHANNEL_LINK = "https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02";
const GROUP_LINK = "https://chat.whatsapp.com/IdGNaKt80DEBqirc2ek4ks";

sila({ nomCom: 'getbot',
    desc: 'Get bot information and links',
    Categorie: 'General',
    reaction: '🤖', 
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, prefixe } = commandeOptions;
      
    try {
        const buttons = [
            { buttonId: `${prefixe}getbot repo`, buttonText: { displayText: "📦 Repo" }, type: 1 },
            { buttonId: `${prefixe}getbot channel`, buttonText: { displayText: "📢 Channel" }, type: 1 },
            { buttonId: `${prefixe}getbot group`, buttonText: { displayText: "👥 Group" }, type: 1 }
        ];

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
                    title: `🤖 SILA-MD Bot Information`,
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
            caption: `╔════════════════════════════════╗
║  🤖 SILA-MD BOT 🤖  ║
╚════════════════════════════════╝

*Get The Bot Now!*

Choose what you want:

📦 Repository - Download bot source
📢 Channel - Follow updates
👥 Group - Join community

Click buttons or use:
${prefixe}getbot repo
${prefixe}getbot channel
${prefixe}getbot group`,
            footer: "SILA-MD Bot © 2026",
            buttons: buttons,
            headerType: 4
        });

    } catch (e) {
        console.log("❌ Getbot Command Error: " + e);
        repondre("❌ Error: " + e.message);
    }
});
