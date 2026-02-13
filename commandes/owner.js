const { silamd } = require("../silamd/sila");
const moment = require("moment-timezone");

sila({ 
    nomCom: 'owner',
    desc: 'Show bot owner information',
    Categorie: 'General',
    reaction: '👑', 
    fromMe: 'true',
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;

    const ownerInfo = `╭─❏ *👑 OWNER INFO* ❏─╮
│
│  *Name*: SILA TECH
│  *Number*: wa.me/255789661031
│  *Role*: Bot Creator & Developer
│  *Country*: Tanzania 🇹🇿
│
│  *About*:
│  >> Expert in WhatsApp Bots
│  >> JavaScript Developer
│  >> Tech Enthusiast
│
╰────────────────────╯

💬 *Feel free to contact me for:*
• Bot development
• Technical support
• Collaboration
• Questions`;

    await zk.sendMessage(dest, { 
        text: ownerInfo,
        contextInfo: {
            externalAdReply: {
                title: "👑 BOT OWNER",
                body: "SILA TECH",
                mediaType: 1,
                thumbnailUrl: "https://files.catbox.moe/krnlo3.jpeg",
                renderLargerThumbnail: true,
            }
        }
    }, { quoted: ms });
});