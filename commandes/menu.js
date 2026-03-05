const { sila } = require("../silamd/sila");
const moment = require("moment-timezone");
const os = require('os');

// PICHA YAKO MPYA
const menuImage = "https://files.catbox.moe/i4aqjo.png";

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

// Function to calculate uptime
function getUptime() {
    const uptimeSeconds = process.uptime();
    const days = Math.floor(uptimeSeconds / (3600 * 24));
    const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);
    
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

sila({ 
    nomCom: 'menu',
    alias: ['menu', 'help', 'cmd'],
    reaction: '📋',
    desc: 'Show bot menu',
    Categorie: 'General',
    fromMe: 'true'
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre, prefixe, nomAuteurMessage } = commandeOptions;
    
    // Get total commands count automatically
    const totalCommands = Object.keys(sila.commands || {}).length || 100;

    const commandButtons = [
        { buttonId: `${prefixe}allmenu`, buttonText: { displayText: "📋 𝙰𝙻𝙻 𝙼𝙴𝙽𝚄" }, type: 1 },
        { buttonId: `${prefixe}owner`, buttonText: { displayText: "👨‍💼 𝙾𝚆𝙽𝙴𝚁" }, type: 1 },
        { buttonId: `${prefixe}getbot`, buttonText: { displayText: "🤖 𝙶𝙴𝚃 𝙱𝙾𝚃" }, type: 1 }
    ];

    const buttonMessage = {
        image: { url: menuImage },  // PICHA IKO HAPA KAMA KAWAIDA, SI THUMBNAIL
        caption: `┏━[ 𝐒𝐈𝐋𝐀-𝐌𝐃 ]━❍
┃ 🤖 *ʙᴏᴛ ɴᴀᴍᴇ:* 𝐒𝐈𝐋𝐀-𝐌𝐃
┃ ⏰ *ᴜᴘᴛɪᴍᴇ:* ${getUptime()}
┃ 👤 *ᴜsᴇʀ:* @${dest.split('@')[0]}
┃ 📊 *ᴛᴏᴛᴀʟ ᴄᴍᴅs:* ${totalCommands}
┃ 🔰 *ᴘʀᴇғɪx:* ${prefixe}
┗━━━━━━━━━━━━━━━━━━❍

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ sɪʟᴀ-ᴍᴅ`,
        footer: "© 2026",
        buttons: commandButtons,
        headerType: 4,  // HeaderType 4 ni kwa image
        contextInfo: {
            mentionedJid: [dest],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363317350973182@newsletter',
                newsletterName: "𝐒𝐈𝐋𝐀-𝐌𝐃",
                serverMessageId: -1
            }
        }
    };

    await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });

} catch (e) {
    console.log("❌ Menu Error: " + e);
    repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
}
});
