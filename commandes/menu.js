const { silamd } = require("../silamd/sila");
const moment = require("moment-timezone");

const menuImage = "https://files.catbox.moe/36vahk.png";

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

silamd({
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

    // Buttons: All Menu, Owner, Get Bot
    const commandButtons = [
        { buttonId: `${prefixe}allmenu`, buttonText: { displayText: "📋 𝙰𝙻𝙻 𝙼𝙴𝙽𝚄" }, type: 1 },
        { buttonId: `${prefixe}owner`, buttonText: { displayText: "👨‍💼 𝙾𝚆𝙽𝙴𝚁" }, type: 1 },
        { buttonId: `${prefixe}getbot`, buttonText: { displayText: "🤖 𝙶𝙴𝚃 𝙱𝙾𝚃" }, type: 1 }
    ];

    // TEXT ONLY - NO IMAGE
    const buttonMessage = {
        text: `┏━❑ 𝐒𝐈𝐋𝐀-𝐌𝐃 ━━━━━━━━━
┃ 🤖 *𝙱𝚘𝚝:* 𝐒𝐈𝐋𝐀-𝙼𝙳
┃ ⏰ *𝚃𝚒𝚖𝚎:* ${moment().tz("Africa/Nairobi").format("DD/MM/YYYY HH:mm")}
┃ 👤 *𝚄𝚜𝚎𝚛:* @${dest.split('@')[0]}
┗━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
        footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝙾𝚃 © 2026",
        buttons: commandButtons,
        headerType: 1,
        contextInfo: {
            mentionedJid: [dest],
            externalAdReply: {
                title: `📋 𝚂𝙸𝙻𝙰-𝙼𝙳 𝙼𝚎𝚗𝚞`,
                body: `👤 @${dest.split('@')[0]}`,
                mediaType: 1,
                previewType: 0,
                thumbnailUrl: menuImage,  // Thumbnail pekee
                sourceUrl: 'https://github.com/',
                renderLargerThumbnail: false,
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