const { silamd } = require("../silamd/sila");
const moment = require("moment-timezone");
const { getBuffer } = require("../silamd/dl/Function");
const { default: axios } = require('axios');

// FakevCard (badala ya contactMessage)
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

// List of image URLs
const silaurl = [
    "https://files.catbox.moe/krnlo3.jpeg",
    "https://files.catbox.moe/36vahk.png",
    "https://files.catbox.moe/j7kue0.jpeg",
    "https://files.catbox.moe/edcfwx.jpeg",
    "https://files.catbox.moe/98k75b.jpeg"
];

// Select a random image
const randomSilaurl = silaurl[Math.floor(Math.random() * silaurl.length)];

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
    desc: 'To check runtime',
    Categorie: 'General',
    reaction: '⏰', 
    fromMe: 'true', 
},
async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, nomAuteurMessage } = commandeOptions;

    try {
        // Send image instead of audio
        await zk.sendMessage(dest, { 
            image: { url: randomSilaurl },
            caption: `┏━❑ 𝙰𝙻𝙸𝚅𝙴 𝙸𝙽𝙵𝙾 ━━━━━━━━━
┃ ⏰ *𝚁𝚞𝚗𝚝𝚒𝚖𝚎:* ${runtime(process.uptime())}
┃ 🤖 *𝙱𝚘𝚝:* 𝚂𝙸𝙻𝙰-𝙼𝙳
┃ ⚡ *𝚂𝚝𝚊𝚝𝚞𝚜:* 𝙾𝚗𝚕𝚒𝚗𝚎
┃ 👤 *𝚄𝚜𝚎𝚛:* @${dest.split('@')[0]}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
            mentions: [dest],
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402325089913@newsletter',
                    newsletterName: "➤®𝐒𝐈𝐋𝐀-𝐌𝐃",
                    serverMessageId: 143,
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: `⏰ 𝙱𝚘𝚝 𝙰𝚕𝚒𝚟𝚎`,
                    body: `𝚁𝚞𝚗𝚝𝚒𝚖𝚎: ${runtime(process.uptime())}`,
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: randomSilaurl,
                    renderLargerThumbnail: true,
                },
            },
        }, { quoted: fkontak });

    } catch (e) {
        console.log("❌ Alive Command Error: " + e);
        repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }
});