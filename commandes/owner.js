const { silamd } = require("../silamd/sila");
const conf = require("../set");

// FakevCard sawa na zilizopita
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
    alias: ['owner', 'creators', 'developer', 'silamd'],
    reaction: '👑',
    desc: '𝚂𝚑𝚘𝚠 𝙱𝚘𝚝 𝙾𝚠𝚗𝚎𝚛 𝚒𝚗𝚏𝚘',
    Categorie: 'General',
    fromMe: 'false'
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre, prefixe, nomAuteurMessage } = commandeOptions;

    const ownerName = conf.OWNER_NAME || '𝚂𝙸𝙻𝙰';
    const ownerNumber = conf.NUMERO_OWNER || '255789661031';
    const formattedOwnerNumber = ownerNumber.replace(/[^0-9]/g, '');

    // Buttons: Contact, Repo, Channel, Menu
    const buttons = [
        { 
            buttonId: `${prefixe}getbot`, 
            buttonText: { displayText: "🤖 𝙶𝙴𝚃 𝙱𝙾𝚃" }, 
            type: 1 
        },
        { 
            buttonId: `https://github.com/Sila-Md/SILA-MD`, 
            buttonText: { displayText: "📂 𝙶𝙸𝚃𝙷𝚄𝙱" }, 
            type: 1 
        },
        { 
            buttonId: `https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02`, 
            buttonText: { displayText: "📢 𝙲𝙷𝙰𝙽𝙽𝙴𝙻" }, 
            type: 1 
        },
        { 
            buttonId: `${prefixe}menu`, 
            buttonText: { displayText: "📋 𝙼𝙴𝙽𝚄" }, 
            type: 1 
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

    // Small delay between messages
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Send owner info with buttons and external ad reply
    const ownerMessage = {
        image: { url: 'https://files.catbox.moe/36vahk.png' },
        caption: `┏━❑ 𝙱𝙾𝚃 𝙾𝚆𝙽𝙴𝚁 𝙸𝙽𝙵𝙾 ━━━━━━━━━
┃ 👑 *𝙽𝚊𝚖𝚎:* ${ownerName}
┃ 📞 *𝙽𝚞𝚖𝚋𝚎𝚛:* wa.me/${formattedOwnerNumber}
┃ 
┃ 🤖 *𝙱𝚘𝚝:* 𝚂𝙸𝙻𝙰-𝙼𝙳
┃ ⭐ *𝚅𝚎𝚛𝚜𝚒𝚘𝚗:* 𝚟𝟸.𝟶.𝟶
┃ 📍 *𝙲𝚘𝚞𝚗𝚝𝚛𝚢:* 𝚃𝚊𝚗𝚣𝚊𝚗𝚒𝚊
┃ 
┃ 📢 *𝙲𝚑𝚊𝚗𝚗𝚎𝚕:* @𝚂𝙸𝙻𝙰_𝙼𝙳
┃ 
┃ 💬 *𝙰𝚋𝚘𝚞𝚝:*
┃ 𝙿𝚘𝚠𝚎𝚛𝚏𝚞𝚕 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝙱𝚘𝚝 𝚠𝚒𝚝𝚑 𝙼𝚞𝚕𝚝𝚒-𝙳𝚎𝚟𝚒𝚌𝚎 𝚂𝚞𝚙𝚙𝚘𝚛𝚝. 
┃ 𝙲𝚛𝚎𝚊𝚝𝚎𝚍 𝚝𝚘 𝚖𝚊𝚔𝚎 𝚢𝚘𝚞𝚛 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝚎𝚡𝚙𝚎𝚛𝚒𝚎𝚗𝚌𝚎 𝚋𝚎𝚝𝚝𝚎𝚛.
┗━━━━━━━━━━━━━━━━━━━━

𝙲𝚘𝚗𝚝𝚊𝚌𝚝 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚜𝚎𝚗𝚝! 𝙲𝚑𝚘𝚘𝚜𝚎 𝚊𝚗 𝚘𝚙𝚝𝚒𝚘𝚗 𝚋𝚎𝚕𝚘𝚠:
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
        footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝙾𝚃 © 2026",
        buttons: buttons,
        headerType: 4,
        contextInfo: {
            mentionedJid: [dest],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363402325089913@newsletter',
                newsletterName: '© 𝚂𝙸𝙻𝙰 𝙼𝙳',
                serverMessageId: 143,
            },
            externalAdReply: {
                title: `👑 𝙱𝙾𝚃 𝙾𝚆𝙽𝙴𝚁: ${ownerName}`,
                body: `📞 wa.me/${formattedOwnerNumber}`,
                mediaType: 1,
                previewType: 0,
                thumbnailUrl: 'https://files.catbox.moe/36vahk.png',
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