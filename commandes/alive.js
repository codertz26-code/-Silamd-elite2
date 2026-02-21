const { silamd } = require("../silamd/sila");
const moment = require("moment-timezone");

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

// Thumbnail moja tu (iliyotolewa)
const ALIVE_THUMBNAIL = "https://files.catbox.moe/98k75b.jpeg";

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

sila({ 
    nomCom: 'alive',
    alias: ['alive', 'runtime', 'uptime'],
    desc: 'To check bot runtime',
    Categorie: 'General',
    reaction: '⏰', 
    fromMe: 'true', 
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, nomAuteurMessage } = commandeOptions;

    try {
        // Send text message with external ad reply only (no image)
        await zk.sendMessage(dest, {
            text: `┏━❑ 𝙰𝙻𝙸𝚅𝙴 ━━━━━━━━━
┃ ⏰ *${runtime(process.uptime())}*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
            contextInfo: {
                mentionedJid: [nomAuteurMessage],
                externalAdReply: {
                    title: `⏰ 𝙱𝚘𝚝 𝙰𝚕𝚒𝚟𝚎`,
                    body: `𝚁𝚞𝚗𝚝𝚒𝚖𝚎: ${runtime(process.uptime())}`,
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: ALIVE_THUMBNAIL,
                    sourceUrl: 'https://github.com/',
                    renderLargerThumbnail: false,
                }
            }
        }, { quoted: fkontak });

    } catch (e) {
        console.log("❌ Alive Command Error: " + e);
        repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }
});