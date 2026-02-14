const { silamd } = require("../silamd/sila");

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

sila({
    nomCom: 'getbot',
    alias: ['getbot', 'bot', 'script', 'repo', 'deploy'],
    reaction: '🤖',
    desc: '𝙶𝚎𝚝 𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝚘𝚝 𝚕𝚒𝚗𝚔𝚜',
    Categorie: 'General',
    fromMe: 'false'
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre, prefixe, nomAuteurMessage } = commandeOptions;

    // Button 1: Repo GitHub
    // Button 2: Channel
    // Button 3: Group
    // Button 4: Menu
    const buttons = [
        { 
            buttonId: `https://github.com/Sila-Md/SILA-MD`, 
            buttonText: { displayText: "📂 𝙶𝙸𝚃𝙷𝚄𝙱 𝚁𝙴𝙿𝙾" }, 
            type: 1 
        },
        { 
            buttonId: `https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02`, 
            buttonText: { displayText: "📢 𝙾𝙵𝙵𝙸𝙲𝙸𝙰𝙻 𝙲𝙷𝙰𝙽𝙽𝙴𝙻" }, 
            type: 1 
        },
        { 
            buttonId: `https://chat.whatsapp.com/IdGNaKt80DEBqirc2ek4ks`, 
            buttonText: { displayText: "👥 𝚂𝚄𝙿𝙿𝙾𝚁𝚃 𝙶𝚁𝙾𝚄𝙿" }, 
            type: 1 
        },
        { 
            buttonId: `${prefixe}menu`, 
            buttonText: { displayText: "📋 𝙼𝙰𝙸𝙽 𝙼𝙴𝙽𝚄" }, 
            type: 1 
        }
    ];

    const buttonMessage = {
        image: { url: 'https://files.catbox.moe/36vahk.png' }, // Tumia picha yako ya menu
        caption: `┏━❑ 𝙶𝙴𝚃 𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝙾𝚃 ━━━━━━━━━
┃ 🤖 *𝙱𝚘𝚝 𝙽𝚊𝚖𝚎:* 𝚂𝙸𝙻𝙰-𝙼𝙳
┃ 
┃ 📢 *𝚃𝚑𝚎 𝚄𝚕𝚝𝚒𝚖𝚊𝚝𝚎 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝙴𝚡𝚙𝚎𝚛𝚒𝚎𝚗𝚌𝚎*
┃ 
┃ ✨ *𝙵𝚎𝚊𝚝𝚞𝚛𝚎𝚜:* 
┃    • 🤖 𝙰𝙸 𝙲𝚑𝚊𝚝𝚋𝚘𝚝 (𝙶𝙿𝚃-𝟻)
┃    • 📥 𝙼𝚎𝚍𝚒𝚊 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚎𝚛
┃    • 👥 𝙶𝚛𝚘𝚞𝚙 𝙼𝚊𝚗𝚊𝚐𝚎𝚖𝚎𝚗𝚝
┃    • 🔒 𝙰𝚗𝚝𝚒-𝚕𝚒𝚗𝚔 / 𝙰𝚗𝚝𝚒-𝚋𝚘𝚝
┃    • 🎮 𝙶𝚊𝚖𝚎𝚜 & 𝙵𝚞𝚗
┃ 
┃ 📊 *𝚃𝚎𝚌𝚑 𝚂𝚝𝚊𝚌𝚔:*
┃    • 𝙹𝚊𝚟𝚊𝚂𝚌𝚛𝚒𝚙𝚝 𝟿𝟺%
┃    • 𝙱𝚊𝚒𝚕𝚎𝚢𝚜 𝙼𝙳
┃    • 𝙼𝚞𝚕𝚝𝚒-𝙳𝚎𝚟𝚒𝚌𝚎 𝚂𝚞𝚙𝚙𝚘𝚛𝚝
┃ 
┃ ⭐ *𝚂𝚝𝚊𝚛 𝚝𝚑𝚎 𝚛𝚎𝚙𝚘 𝚒𝚏 𝚢𝚘𝚞 𝚕𝚒𝚔𝚎 𝚝𝚑𝚒𝚜 𝚋𝚘𝚝!*
┗━━━━━━━━━━━━━━━━━━━━

𝙲𝚑𝚘𝚘𝚜𝚎 𝚊𝚗 𝚘𝚙𝚝𝚒𝚘𝚗 𝚋𝚎𝚕𝚘𝚠:
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
                title: `🤖 𝙶𝚎𝚝 𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝙾𝚃`,
                body: `⭐ 38 𝚜𝚝𝚊𝚛𝚜 | 𝟼𝟶 𝚏𝚘𝚛𝚔𝚜`,
                mediaType: 1,
                previewType: 0,
                thumbnailUrl: 'https://files.catbox.moe/36vahk.png',
                sourceUrl: 'https://github.com/Sila-Md/SILA-MD',
                renderLargerThumbnail: false,
            }
        }
    };

    await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });

} catch (e) {
    console.log("❌ Getbot Command Error: " + e);
    await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
}
});