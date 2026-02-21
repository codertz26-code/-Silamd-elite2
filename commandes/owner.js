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

// Thumbnail
const OWNER_THUMB = "https://files.catbox.moe/98k75b.jpeg";

// VCard ya owner
const ownerVcard = (ownerName, ownerNumber) => {
    const formattedNumber = ownerNumber.replace(/[^0-9]/g, '');
    return `BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
ORG:𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝙾𝚃;
TEL;type=CELL;type=VOICE;waid=${formattedNumber}:+${formattedNumber}
EMAIL:silamd@gmail.com
URL:https://github.com/Sila-Md
NOTE:𝙿𝚘𝚠𝚎𝚛𝚏𝚞𝚕 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝙱𝚘𝚝 𝙲𝚛𝚎𝚊𝚝𝚘𝚛
ADR:𝚃𝚊𝚗𝚣𝚊𝚗𝚒𝚊
BDAY:20260101
END:VCARD`;
};

sila({
    nomCom: 'owner',
    alias: ['owner', 'creators', 'developer', 'sila', 'dev', 'mods'],
    reaction: '👑',
    desc: 'Show Bot Owner info',
    Categorie: 'General',
    fromMe: 'true'
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre, prefixe, nomAuteurMessage } = commandeOptions;

    const ownerName = conf.OWNER_NAME || '𝚂𝙸𝙻𝙰';
    const ownerNumber = conf.NUMERO_OWNER || '255789661031';
    const formattedOwnerNumber = ownerNumber.replace(/[^0-9]/g, '');

    // Interactive buttons
    const interactiveButtons = [
        {
            name: 'cta_call',
            buttonParamsJson: JSON.stringify({
                display_text: '📞 𝙲𝙰𝙻𝙻 𝙾𝚆𝙽𝙴𝚁',
                phone_number: formattedOwnerNumber
            })
        },
        {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
                display_text: '🌐 𝙶𝙸𝚃𝙷𝚄𝙱',
                url: 'https://github.com/Sila-Md'
            })
        },
        {
            name: 'cta_url',
            buttonParamsJson: JSON.stringify({
                display_text: '📢 𝙲𝙷𝙰𝙽𝙽𝙴𝙻',
                url: 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02'
            })
        }
    ];

    // Send contact message first (vcard)
    await zk.sendMessage(dest, {
        contacts: {
            displayName: ownerName,
            contacts: [{
                vcard: ownerVcard(ownerName, formattedOwnerNumber)
            }]
        }
    }, { quoted: fkontak });

    // Small delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Send owner info with buttons
    const ownerMessage = {
        text: `┏━❑ 𝙾𝚆𝙽𝙴𝚁 𝙸𝙽𝙵𝙾 ━━━━━━━━━
┃ 👑 *𝙽𝚊𝚖𝚎:* ${ownerName}
┃ 📞 *𝙽𝚞𝚖𝚋𝚎𝚛:* wa.me/${formattedOwnerNumber}
┃ 🤖 *𝙱𝚘𝚝:* 𝚂𝙸𝙻𝙰-𝙼𝙳
┃ ⭐ *𝚅𝚎𝚛:* 𝚟𝟸.𝟶.𝟶
┗━━━━━━━━━━━━━━━━━━━━

𝙲𝚘𝚗𝚝𝚊𝚌𝚝 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚜𝚎𝚗𝚝!
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
        footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝙾𝚃 © 2026",
        interactiveButtons: interactiveButtons,
        headerType: 1,
        contextInfo: {
            mentionedJid: [dest],
            externalAdReply: {
                title: `👑 𝙾𝚠𝚗𝚎𝚛: ${ownerName}`,
                body: `📞 wa.me/${formattedOwnerNumber}`,
                mediaType: 1,
                previewType: 0,
                thumbnailUrl: OWNER_THUMB,
                sourceUrl: `https://wa.me/${formattedOwnerNumber}`,
                renderLargerThumbnail: false,
            }
        }
    };

    await zk.sendMessage(dest, ownerMessage, { quoted: fkontak });

} catch (e) {
    console.log("❌ Owner Command Error: " + e);
    await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
}
});