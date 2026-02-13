const { silamd } = require("../silamd/sila");
const moment = require("moment-timezone");
const { getBuffer } = require("../silamd/dl/Function");
const { default: axios } = require('axios');
    // List of image URLs
    const silaurl = [
        "https://files.catbox.moe/krnlo3.jpeg",
        "https://files.catbox.moe/36vahk.png",
        "https://files.catbox.moe/j7kue0.jpeg",
        "https://files.catbox.moe/edcfwx.jpeg",
        "https://files.catbox.moe/98k75b.jpeg" // New image added
    ];

    // Select a random image file
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
 } 


sila({ nomCom: 'alive',
    desc: 'To check runtime',
    Categorie: 'General',
    reaction: '⏰', 
    fromMe: 'true', 


  },
  async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;
      
    try {
        await zk.sendMessage(dest, { 
        audio: { url: AUDIO_URL }, 
        mimetype: 'audio/mp4', 
        ptt: true, // Voice note form
          contextInfo: {
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
          newsletterJid: '120363402325089913@newsletter',
          newsletterName: "➤®𝐒𝐈𝐋𝐀-𝐌𝐃",
          serverMessageId: 143,
         },
          forwardingScore: 999,
         externalAdReply: {
         title: `⏰ message am alive  ${runtime(process.uptime())}`,
         mediaType: 1,
          previewType: 0,
         thumbnailUrl: randomSilaurl,
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
                    displayName: "𝐒𝐈𝐋𝐀",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:𝐒𝐈𝐋𝐀-𝐌𝐃;BOT;;;\nFN:𝐒𝐈𝐋𝐀-𝐌𝐃\nitem1.TEL;waid=255789661031:+255789661031\nitem1.X-ABLabel:Bot\nEND:VCARD`
                }
            }
        } });

    } catch (e) {
        console.log("❌ uptime Command Error: " + e);
        repondre("❌ Error: " + e);
    }
});
