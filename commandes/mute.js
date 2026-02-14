const { silamd } = require("../silamd/sila");

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

// Random thumbnails
const thumbnails = [
    "https://files.catbox.moe/krnlo3.jpeg",
    "https://files.catbox.moe/36vahk.png"
];

const getRandomThumbnail = () => thumbnails[Math.floor(Math.random() * thumbnails.length)];

sila({
    nomCom: 'mute',
    alias: ['mute', 'unmute', 'close', 'open', 'lock', 'unlock', 'groupclose', 'groupopen'],
    reaction: '🔇',
    desc: '𝙼𝚞𝚝𝚎/𝚄𝚗𝚖𝚞𝚝𝚎 𝚐𝚛𝚘𝚞𝚙',
    Categorie: 'Group',
    fromMe: 'false'
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre, prefixe, verifGroupe, verifAdmin, superUser, infosGroupe, nomAuteurMessage } = commandeOptions;

    // Check if it's a group
    if (!verifGroupe) {
        return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙶𝚛𝚘𝚞𝚙 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    // Check if user is admin or owner
    if (!verifAdmin && !superUser) {
        return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙰𝚍𝚖𝚒𝚗𝚜 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    // Check if bot is admin
    if (!commandeOptions.verifZokouAdmin) {
        return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙱𝚘𝚝 𝚗𝚘𝚝 𝚊𝚍𝚖𝚒𝚗
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    const action = arg[0] ? arg[0].toLowerCase() : null;
    const currentSetting = await zk.groupMetadata(dest).then(res => res.announce ? 'closed' : 'open');
    const currentStatus = currentSetting === 'closed' ? '🔒 𝙲𝙻𝙾𝚂𝙴𝙳' : '🔓 𝙾𝙿𝙴𝙽';

    // If no action, show buttons
    if (!action) {
        const buttons = [
            { 
                buttonId: `${prefixe}mute close`, 
                buttonText: { displayText: currentSetting === 'closed' ? "✅ 𝙲𝙻𝙾𝚂𝙴𝙳" : "🔒 𝙲𝙻𝙾𝚂𝙴" }, 
                type: 1 
            },
            { 
                buttonId: `${prefixe}mute open`, 
                buttonText: { displayText: currentSetting === 'open' ? "✅ 𝙾𝙿𝙴𝙽" : "🔓 𝙾𝙿𝙴𝙽" }, 
                type: 1 
            }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙶𝚁𝙾𝚄𝙿 𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂 ━━━━━━━━━
┃ 📊 ${currentStatus}
┃ 👥 ${infosGroupe.subject}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `🔇 𝙶𝚛𝚘𝚞𝚙 𝙼𝚞𝚝𝚎`,
                    body: infosGroupe.subject.substring(0, 30),
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    sourceUrl: 'https://github.com/',
                    renderLargerThumbnail: false,
                }
            }
        };

        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    // Handle mute/close
    if (action === 'close' || action === 'mute' || action === 'lock') {
        if (currentSetting === 'closed') {
            return await repondre(`┏━❑ 𝙼𝚄𝚃𝙴 ━━━━━━━━━
┃ ⚠️ 𝙰𝚕𝚛𝚎𝚊𝚍𝚢 𝚌𝚕𝚘𝚜𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
        }

        await zk.groupSettingUpdate(dest, 'announcement');
        
        await zk.sendMessage(dest, {
            text: `┏━❑ 𝙼𝚄𝚃𝙴 ━━━━━━━━━
┃ ✅ 𝙶𝚛𝚘𝚞𝚙 𝚌𝚕𝚘𝚜𝚎𝚍
┃ 👤 @${nomAuteurMessage.split('@')[0]}
┗━━━━━━━━━━━━━━━━━━━━`,
            mentions: [nomAuteurMessage],
            contextInfo: {
                externalAdReply: {
                    title: `🔒 𝙶𝚛𝚘𝚞𝚙 𝙲𝚕𝚘𝚜𝚎𝚍`,
                    body: infosGroupe.subject.substring(0, 30),
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        }, { quoted: fkontak });
    }

    // Handle unmute/open
    if (action === 'open' || action === 'unmute' || action === 'unlock') {
        if (currentSetting === 'open') {
            return await repondre(`┏━❑ 𝚄𝙽𝙼𝚄𝚃𝙴 ━━━━━━━━━
┃ ⚠️ 𝙰𝚕𝚛𝚎𝚊𝚍𝚢 𝚘𝚙𝚎𝚗
┗━━━━━━━━━━━━━━━━━━━━`);
        }

        await zk.groupSettingUpdate(dest, 'not_announcement');
        
        await zk.sendMessage(dest, {
            text: `┏━❑ 𝚄𝙽𝙼𝚄𝚃𝙴 ━━━━━━━━━
┃ ✅ 𝙶𝚛𝚘𝚞𝚙 𝚘𝚙𝚎𝚗𝚎𝚍
┃ 👤 @${nomAuteurMessage.split('@')[0]}
┗━━━━━━━━━━━━━━━━━━━━`,
            mentions: [nomAuteurMessage],
            contextInfo: {
                externalAdReply: {
                    title: `🔓 𝙶𝚛𝚘𝚞𝚙 𝙾𝚙𝚎𝚗𝚎𝚍`,
                    body: infosGroupe.subject.substring(0, 30),
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        }, { quoted: fkontak });
    }

} catch (e) {
    console.log("❌ Mute Command Error: " + e);
    await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━`);
}
});