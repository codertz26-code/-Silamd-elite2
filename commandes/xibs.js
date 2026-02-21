const { silamd } = require("../silamd/sila");
const conf = require("../set");

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

// Thumbnail moja (ile uliyonipa)
const XIBS_THUMBNAIL = "https://files.catbox.moe/98k75b.jpeg";

silamd({
    nomCom: 'xibs',
    alias: ['xibs', 'xibsbot', 'xibslink'],
    reaction: '🔗',
    desc: 'XIBS bot interactive buttons',
    Categorie: 'General',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, repondre, prefixe, nomAuteurMessage } = commandeOptions;

        // Create interactive buttons - NJIA SAHIHI
        const interactiveButtons = [
            {
                name: 'cta_call',
                buttonParamsJson: JSON.stringify({
                    display_text: '📞 𝙲𝙰𝙻𝙻 𝙼𝙴 𝙽𝙾𝚁𝙼𝙰𝙻',
                    phone_number: '255778206728'
                })
            },
            {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                    display_text: '🌐 𝚅𝙸𝚂𝙸𝚃 𝚆𝙴𝙱𝚂𝙸𝚃𝙴',
                    url: 'https://www.xibs.space',
                    merchant_url: 'https://auto.xibs.space'
                })
            },
            {
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                    display_text: '📋 𝙲𝙾𝙳𝙴',
                    copy_code: 'X15BXYa'
                })
            }
        ];

        // NJIA SAHIHI YA KUTUMA INTERACTIVE BUTTONS
        const buttonMessage = {
            text: `┏━❑ 𝚇𝙸𝙱𝚂 𝙸𝙽𝙵𝙾 ━━━━━━━━━
┃ 🔗 *𝙽𝚊𝚖𝚎:* XIBS Bot
┃ 📞 *𝙿𝚑𝚘𝚗𝚎:* +255778206728
┃ 🌐 *𝚆𝚎𝚋:* xibs.space
┃ 📋 *𝙲𝚘𝚍𝚎:* X15BXYa
┃ 
┃ 👤 *𝚄𝚜𝚎𝚛:* @${dest.split('@')[0]}
┗━━━━━━━━━━━━━━━━━━━━

𝙲𝚑𝚘𝚘𝚜𝚎 𝚊𝚗 𝚘𝚙𝚝𝚒𝚘𝚗 𝚋𝚎𝚕𝚘𝚠:
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝙾𝚃 © 2026",
            interactiveButtons: interactiveButtons, // BADALA YA 'buttons'
            headerType: 1,
            contextInfo: {
                mentionedJid: [dest],
                externalAdReply: {
                    title: `🔗 𝚇𝙸𝙱𝚂 𝙱𝚘𝚝`,
                    body: `📞 +255778206728 | 🌐 xibs.space`,
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: XIBS_THUMBNAIL,
                    sourceUrl: 'https://www.xibs.space',
                    renderLargerThumbnail: false,
                }
            }
        };

        await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });

    } catch (e) {
        console.log("❌ XIBS Command Error: " + e);
        await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }
});