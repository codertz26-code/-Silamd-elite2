const { silamd } = require("../silamd/sila");
const conf = require("../set");
const fs = require('fs');
const path = require('path');
const Heroku = require('heroku-client');

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
    "https://files.catbox.moe/36vahk.png",
    "https://files.catbox.moe/j7kue0.jpeg",
    "https://files.catbox.moe/edcfwx.jpeg",
    "https://files.catbox.moe/98k75b.jpeg"
];

const getRandomThumbnail = () => thumbnails[Math.floor(Math.random() * thumbnails.length)];

// Function to get description from app.json
function getDescriptionFromEnv(varName) {
    try {
        const filePath = "./app.json";
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const config = JSON.parse(fileContent);
        return config.env[varName]?.description || "Description not found.";
    } catch (e) {
        return "Description not available.";
    }
}

// Function to change Heroku vars
async function changeHerokuVar(varName, value) {
    try {
        if (!conf.HEROKU_APP_NAME || !conf.HEROKU_API_KEY) {
            return { success: false, error: "Heroku credentials missing" };
        }
        const heroku = new Heroku({ token: conf.HEROKU_API_KEY });
        await heroku.patch(`/apps/${conf.HEROKU_APP_NAME}/config-vars`, {
            body: { [varName]: value }
        });
        return { success: true };
    } catch (e) {
        return { success: false, error: e.message };
    }
}

// ============================================
// 1️⃣ ANTICALL COMMAND
// ============================================
silamd({
    nomCom: 'anticall',
    alias: ['anticall', 'rejectcall', 'blockcall'],
    reaction: '📞',
    categorie: 'Settings',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝚊𝚗𝚝𝚒-𝚌𝚊𝚕𝚕'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg, nomAuteurMessage } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        const buttons = [
            { buttonId: `anticall yes`, buttonText: { displayText: conf.ANTICALL === 'yes' ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, type: 1 },
            { buttonId: `anticall no`, buttonText: { displayText: conf.ANTICALL === 'no' ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, type: 1 }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙰𝙽𝚃𝙸𝙲𝙰𝙻𝙻 ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${conf.ANTICALL === 'yes' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `📞 𝙰𝚗𝚝𝚒𝚌𝚊𝚕𝚕`,
                    body: conf.ANTICALL === 'yes' ? '𝙴𝚗𝚊𝚋𝚕𝚎𝚍' : '𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍',
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        };
        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    const option = arg[0].toLowerCase();
    if (option === 'yes') {
        conf.ANTICALL = 'yes';
        await repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙲𝙰𝙻𝙻 ━━━━━━━━━
┃ ✅ 𝙴𝚗𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    } else if (option === 'no') {
        conf.ANTICALL = 'no';
        await repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙲𝙰𝙻𝙻 ━━━━━━━━━
┃ ❌ 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 2️⃣ AUTO REACT COMMAND
// ============================================
silamd({
    nomCom: 'areact',
    alias: ['areact', 'autoreact', 'autoreaction'],
    reaction: '❤️',
    categorie: 'Settings',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝚊𝚞𝚝𝚘 𝚛𝚎𝚊𝚌𝚝𝚒𝚘𝚗'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        const buttons = [
            { buttonId: `areact yes`, buttonText: { displayText: conf.AUTO_REACT === 'yes' ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, type: 1 },
            { buttonId: `areact no`, buttonText: { displayText: conf.AUTO_REACT === 'no' ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, type: 1 }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙰𝚄𝚃𝙾 𝚁𝙴𝙰𝙲𝚃 ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${conf.AUTO_REACT === 'yes' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `❤️ 𝙰𝚞𝚝𝚘 𝚁𝚎𝚊𝚌𝚝`,
                    body: conf.AUTO_REACT === 'yes' ? '𝙴𝚗𝚊𝚋𝚕𝚎𝚍' : '𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍',
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        };
        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    const option = arg[0].toLowerCase();
    if (option === 'yes') {
        conf.AUTO_REACT = 'yes';
        await repondre(`┏━❑ 𝙰𝚄𝚃𝙾 𝚁𝙴𝙰𝙲𝚃 ━━━━━━━━━
┃ ✅ 𝙴𝚗𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    } else if (option === 'no') {
        conf.AUTO_REACT = 'no';
        await repondre(`┏━❑ 𝙰𝚄𝚃𝙾 𝚁𝙴𝙰𝙲𝚃 ━━━━━━━━━
┃ ❌ 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 3️⃣ READ STATUS COMMAND
// ============================================
silamd({
    nomCom: 'readstatus',
    alias: ['readstatus', 'autoreadstatus', 'viewstatus'],
    reaction: '👁️',
    categorie: 'Settings',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝚊𝚞𝚝𝚘 𝚛𝚎𝚊𝚍 𝚜𝚝𝚊𝚝𝚞𝚜'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        const buttons = [
            { buttonId: `readstatus yes`, buttonText: { displayText: conf.AUTO_READ_STATUS === 'yes' ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, type: 1 },
            { buttonId: `readstatus no`, buttonText: { displayText: conf.AUTO_READ_STATUS === 'no' ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, type: 1 }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝚁𝙴𝙰𝙳 𝚂𝚃𝙰𝚃𝚄𝚂 ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${conf.AUTO_READ_STATUS === 'yes' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `👁️ 𝙰𝚞𝚝𝚘 𝚁𝚎𝚊𝚍`,
                    body: conf.AUTO_READ_STATUS === 'yes' ? '𝙴𝚗𝚊𝚋𝚕𝚎𝚍' : '𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍',
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        };
        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    const option = arg[0].toLowerCase();
    if (option === 'yes') {
        conf.AUTO_READ_STATUS = 'yes';
        await repondre(`┏━❑ 𝚁𝙴𝙰𝙳 𝚂𝚃𝙰𝚃𝚄𝚂 ━━━━━━━━━
┃ ✅ 𝙴𝚗𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    } else if (option === 'no') {
        conf.AUTO_READ_STATUS = 'no';
        await repondre(`┏━❑ 𝚁𝙴𝙰𝙳 𝚂𝚃𝙰𝚃𝚄𝚂 ━━━━━━━━━
┃ ❌ 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 4️⃣ ANTIDELETE COMMAND
// ============================================
silamd({
    nomCom: 'antidelete',
    alias: ['antidelete', 'antidel'],
    reaction: '🗑️',
    categorie: 'Settings',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝚊𝚗𝚝𝚒𝚍𝚎𝚕𝚎𝚝𝚎'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        const buttons = [
            { buttonId: `antidelete yes`, buttonText: { displayText: conf.ADM === 'yes' ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, type: 1 },
            { buttonId: `antidelete no`, buttonText: { displayText: conf.ADM === 'no' ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, type: 1 }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙰𝙽𝚃𝙸𝙳𝙴𝙻𝙴𝚃𝙴 ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${conf.ADM === 'yes' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `🗑️ 𝙰𝚗𝚝𝚒𝚍𝚎𝚕𝚎𝚝𝚎`,
                    body: conf.ADM === 'yes' ? '𝙴𝚗𝚊𝚋𝚕𝚎𝚍' : '𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍',
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        };
        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    const option = arg[0].toLowerCase();
    if (option === 'yes') {
        conf.ADM = 'yes';
        await repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙳𝙴𝙻𝙴𝚃𝙴 ━━━━━━━━━
┃ ✅ 𝙴𝚗𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    } else if (option === 'no') {
        conf.ADM = 'no';
        await repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙳𝙴𝙻𝙴𝚃𝙴 ━━━━━━━━━
┃ ❌ 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 5️⃣ DOWNLOAD STATUS COMMAND
// ============================================
silamd({
    nomCom: 'downloadstatus',
    alias: ['downloadstatus', 'savestatus', 'dlstatus'],
    reaction: '📥',
    categorie: 'Settings',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝚊𝚞𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚜𝚝𝚊𝚝𝚞𝚜'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        const buttons = [
            { buttonId: `downloadstatus yes`, buttonText: { displayText: conf.AUTO_DOWNLOAD_STATUS === 'yes' ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, type: 1 },
            { buttonId: `downloadstatus no`, buttonText: { displayText: conf.AUTO_DOWNLOAD_STATUS === 'no' ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, type: 1 }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝚂𝚃𝙰𝚃𝚄𝚂 ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${conf.AUTO_DOWNLOAD_STATUS === 'yes' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `📥 𝙰𝚞𝚝𝚘 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍`,
                    body: conf.AUTO_DOWNLOAD_STATUS === 'yes' ? '𝙴𝚗𝚊𝚋𝚕𝚎𝚍' : '𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍',
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        };
        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    const option = arg[0].toLowerCase();
    if (option === 'yes') {
        conf.AUTO_DOWNLOAD_STATUS = 'yes';
        await repondre(`┏━❑ 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝚂𝚃𝙰𝚃𝚄𝚂 ━━━━━━━━━
┃ ✅ 𝙴𝚗𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    } else if (option === 'no') {
        conf.AUTO_DOWNLOAD_STATUS = 'no';
        await repondre(`┏━❑ 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝚂𝚃𝙰𝚃𝚄𝚂 ━━━━━━━━━
┃ ❌ 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 6️⃣ START MESSAGE COMMAND
// ============================================
silamd({
    nomCom: 'startmessage',
    alias: ['startmessage', 'startmsg', 'dp'],
    reaction: '📢',
    categorie: 'Settings',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝚜𝚝𝚊𝚛𝚝 𝚖𝚎𝚜𝚜𝚊𝚐𝚎'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        const buttons = [
            { buttonId: `startmessage yes`, buttonText: { displayText: conf.DP === 'yes' ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, type: 1 },
            { buttonId: `startmessage no`, buttonText: { displayText: conf.DP === 'no' ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, type: 1 }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝚂𝚃𝙰𝚁𝚃 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${conf.DP === 'yes' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `📢 𝚂𝚝𝚊𝚛𝚝 𝙼𝚎𝚜𝚜𝚊𝚐𝚎`,
                    body: conf.DP === 'yes' ? '𝙴𝚗𝚊𝚋𝚕𝚎𝚍' : '𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍',
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        };
        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    const option = arg[0].toLowerCase();
    if (option === 'yes') {
        conf.DP = 'yes';
        await repondre(`┏━❑ 𝚂𝚃𝙰𝚁𝚃 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 ━━━━━━━━━
┃ ✅ 𝙴𝚗𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    } else if (option === 'no') {
        conf.DP = 'no';
        await repondre(`┏━❑ 𝚂𝚃𝙰𝚁𝚃 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 ━━━━━━━━━
┃ ❌ 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 7️⃣ READ MESSAGE COMMAND
// ============================================
silamd({
    nomCom: 'readmessage',
    alias: ['readmessage', 'autoread', 'readmsg'],
    reaction: '👁️',
    categorie: 'Settings',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝚊𝚞𝚝𝚘 𝚛𝚎𝚊𝚍 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        const buttons = [
            { buttonId: `readmessage yes`, buttonText: { displayText: conf.AUTO_READ_MESSAGES === 'yes' ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, type: 1 },
            { buttonId: `readmessage no`, buttonText: { displayText: conf.AUTO_READ_MESSAGES === 'no' ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, type: 1 }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝚁𝙴𝙰𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${conf.AUTO_READ_MESSAGES === 'yes' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `👁️ 𝙰𝚞𝚝𝚘 𝚁𝚎𝚊𝚍`,
                    body: conf.AUTO_READ_MESSAGES === 'yes' ? '𝙴𝚗𝚊𝚋𝚕𝚎𝚍' : '𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍',
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        };
        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    const option = arg[0].toLowerCase();
    if (option === 'yes') {
        conf.AUTO_READ_MESSAGES = 'yes';
        await repondre(`┏━❑ 𝚁𝙴𝙰𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 ━━━━━━━━━
┃ ✅ 𝙴𝚗𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    } else if (option === 'no') {
        conf.AUTO_READ_MESSAGES = 'no';
        await repondre(`┏━❑ 𝚁𝙴𝙰𝙳 𝙼𝙴𝚂𝚂𝙰𝙶𝙴 ━━━━━━━━━
┃ ❌ 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 8️⃣ PM PERMIT COMMAND
// ============================================
silamd({
    nomCom: 'pmpermit',
    alias: ['pmpermit', 'pm', 'privatemessage'],
    reaction: '🔒',
    categorie: 'Settings',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝙿𝙼 𝚙𝚎𝚛𝚖𝚒𝚝'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        const buttons = [
            { buttonId: `pmpermit yes`, buttonText: { displayText: conf.PM_PERMIT === 'yes' ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, type: 1 },
            { buttonId: `pmpermit no`, buttonText: { displayText: conf.PM_PERMIT === 'no' ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, type: 1 }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙿𝙼 𝙿𝙴𝚁𝙼𝙸𝚃 ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${conf.PM_PERMIT === 'yes' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `🔒 𝙿𝙼 𝙿𝚎𝚛𝚖𝚒𝚝`,
                    body: conf.PM_PERMIT === 'yes' ? '𝙴𝚗𝚊𝚋𝚕𝚎𝚍' : '𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍',
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        };
        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    const option = arg[0].toLowerCase();
    if (option === 'yes') {
        conf.PM_PERMIT = 'yes';
        await repondre(`┏━❑ 𝙿𝙼 𝙿𝙴𝚁𝙼𝙸𝚃 ━━━━━━━━━
┃ ✅ 𝙴𝚗𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    } else if (option === 'no') {
        conf.PM_PERMIT = 'no';
        await repondre(`┏━❑ 𝙿𝙼 𝙿𝙴𝚁𝙼𝙸𝚃 ━━━━━━━━━
┃ ❌ 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 9️⃣ CHATBOT COMMAND
// ============================================
silamd({
    nomCom: 'chatbot',
    alias: ['chatbot', 'ai', 'botai'],
    reaction: '🤖',
    categorie: 'Settings',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝙲𝚑𝚊𝚝𝚋𝚘𝚝'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        const buttons = [
            { buttonId: `chatbot yes`, buttonText: { displayText: conf.CHAT_BOT === 'yes' ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, type: 1 },
            { buttonId: `chatbot no`, buttonText: { displayText: conf.CHAT_BOT === 'no' ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, type: 1 }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${conf.CHAT_BOT === 'yes' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `🤖 𝙲𝚑𝚊𝚝𝚋𝚘𝚝`,
                    body: conf.CHAT_BOT === 'yes' ? '𝙴𝚗𝚊𝚋𝚕𝚎𝚍' : '𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍',
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        };
        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    const option = arg[0].toLowerCase();
    if (option === 'yes') {
        conf.CHAT_BOT = 'yes';
        await repondre(`┏━❑ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 ━━━━━━━━━
┃ ✅ 𝙴𝚗𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    } else if (option === 'no') {
        conf.CHAT_BOT = 'no';
        await repondre(`┏━❑ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 ━━━━━━━━━
┃ ❌ 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 🔟 GREET COMMAND
// ============================================
silamd({
    nomCom: 'greet',
    alias: ['greet', 'autoreply', 'welcome'],
    reaction: '👋',
    categorie: 'Settings',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝚊𝚞𝚝𝚘 𝚛𝚎𝚙𝚕𝚢'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        const buttons = [
            { buttonId: `greet yes`, buttonText: { displayText: conf.AUTO_REPLY === 'yes' ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, type: 1 },
            { buttonId: `greet no`, buttonText: { displayText: conf.AUTO_REPLY === 'no' ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, type: 1 }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙶𝚁𝙴𝙴𝚃 ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${conf.AUTO_REPLY === 'yes' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `👋 𝙰𝚞𝚝𝚘 𝚁𝚎𝚙𝚕𝚢`,
                    body: conf.AUTO_REPLY === 'yes' ? '𝙴𝚗𝚊𝚋𝚕𝚎𝚍' : '𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍',
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        };
        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    const option = arg[0].toLowerCase();
    if (option === 'yes') {
        conf.AUTO_REPLY = 'yes';
        await repondre(`┏━❑ 𝙶𝚁𝙴𝙴𝚃 ━━━━━━━━━
┃ ✅ 𝙴𝚗𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    } else if (option === 'no') {
        conf.AUTO_REPLY = 'no';
        await repondre(`┏━❑ 𝙶𝚁𝙴𝙴𝚃 ━━━━━━━━━
┃ ❌ 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 1️⃣1️⃣ ANTIVV COMMAND
// ============================================
silamd({
    nomCom: 'antivv',
    alias: ['antivv', 'antiviewonce'],
    reaction: '👁️‍🗨️',
    categorie: 'Settings',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝚊𝚗𝚝𝚒-𝚟𝚒𝚎𝚠 𝚘𝚗𝚌𝚎'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        const buttons = [
            { buttonId: `antivv yes`, buttonText: { displayText: conf.ANTI_VV === 'yes' ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, type: 1 },
            { buttonId: `antivv no`, buttonText: { displayText: conf.ANTI_VV === 'no' ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, type: 1 }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙰𝙽𝚃𝙸𝚅𝚅 ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${conf.ANTI_VV === 'yes' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `👁️‍🗨️ 𝙰𝚗𝚝𝚒𝚅𝚅`,
                    body: conf.ANTI_VV === 'yes' ? '𝙴𝚗𝚊𝚋𝚕𝚎𝚍' : '𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍',
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        };
        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    const option = arg[0].toLowerCase();
    if (option === 'yes') {
        conf.ANTI_VV = 'yes';
        await repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝚅𝚅 ━━━━━━━━━
┃ ✅ 𝙴𝚗𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    } else if (option === 'no') {
        conf.ANTI_VV = 'no';
        await repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝚅𝚅 ━━━━━━━━━
┃ ❌ 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 1️⃣2️⃣ PUBLIC MODE COMMAND
// ============================================
silamd({
    nomCom: 'publicmode',
    alias: ['publicmode', 'public', 'mode'],
    reaction: '🌐',
    categorie: 'Settings',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝚙𝚞𝚋𝚕𝚒𝚌 𝚖𝚘𝚍𝚎'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        const buttons = [
            { buttonId: `publicmode yes`, buttonText: { displayText: conf.MODE === 'yes' ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, type: 1 },
            { buttonId: `publicmode no`, buttonText: { displayText: conf.MODE === 'no' ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, type: 1 }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙿𝚄𝙱𝙻𝙸𝙲 𝙼𝙾𝙳𝙴 ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${conf.MODE === 'yes' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `🌐 𝙿𝚞𝚋𝚕𝚒𝚌 𝙼𝚘𝚍𝚎`,
                    body: conf.MODE === 'yes' ? '𝙴𝚗𝚊𝚋𝚕𝚎𝚍' : '𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍',
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        };
        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    const option = arg[0].toLowerCase();
    if (option === 'yes') {
        conf.MODE = 'yes';
        await repondre(`┏━❑ 𝙿𝚄𝙱𝙻𝙸𝙲 𝙼𝙾𝙳𝙴 ━━━━━━━━━
┃ ✅ 𝙴𝚗𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    } else if (option === 'no') {
        conf.MODE = 'no';
        await repondre(`┏━❑ 𝙿𝚄𝙱𝙻𝙸𝙲 𝙼𝙾𝙳𝙴 ━━━━━━━━━
┃ ❌ 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 1️⃣3️⃣ PRIVATE MODE COMMAND
// ============================================
silamd({
    nomCom: 'privatemode',
    alias: ['privatemode', 'private'],
    reaction: '🔒',
    categorie: 'Settings',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝚙𝚛𝚒𝚟𝚊𝚝𝚎 𝚖𝚘𝚍𝚎'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        const buttons = [
            { buttonId: `privatemode yes`, buttonText: { displayText: conf.MODE === 'no' ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, type: 1 },
            { buttonId: `privatemode no`, buttonText: { displayText: conf.MODE === 'yes' ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, type: 1 }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙿𝚁𝙸𝚅𝙰𝚃𝙴 𝙼𝙾𝙳𝙴 ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${conf.MODE === 'no' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `🔒 𝙿𝚛𝚒𝚟𝚊𝚝𝚎 𝙼𝚘𝚍𝚎`,
                    body: conf.MODE === 'no' ? '𝙴𝚗𝚊𝚋𝚕𝚎𝚍' : '𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍',
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        };
        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    const option = arg[0].toLowerCase();
    if (option === 'yes') {
        conf.MODE = 'no';
        await repondre(`┏━❑ 𝙿𝚁𝙸𝚅𝙰𝚃𝙴 𝙼𝙾𝙳𝙴 ━━━━━━━━━
┃ ✅ 𝙴𝚗𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    } else if (option === 'no') {
        conf.MODE = 'yes';
        await repondre(`┏━❑ 𝙿𝚁𝙸𝚅𝙰𝚃𝙴 𝙼𝙾𝙳𝙴 ━━━━━━━━━
┃ ❌ 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 1️⃣4️⃣ AUTORECORD COMMAND
// ============================================
silamd({
    nomCom: 'autorecord',
    alias: ['autorecord', 'recording'],
    reaction: '⏺️',
    categorie: 'Settings',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝚊𝚞𝚝𝚘 𝚛𝚎𝚌𝚘𝚛𝚍𝚒𝚗𝚐'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        const buttons = [
            { buttonId: `autorecord yes`, buttonText: { displayText: conf.ETAT === '3' ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, type: 1 },
            { buttonId: `autorecord no`, buttonText: { displayText: conf.ETAT !== '3' ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, type: 1 }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙰𝚄𝚃𝙾 𝚁𝙴𝙲𝙾𝚁𝙳 ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${conf.ETAT === '3' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `⏺️ 𝙰𝚞𝚝𝚘 𝚁𝚎𝚌𝚘𝚛𝚍`,
                    body: conf.ETAT === '3' ? '𝙴𝚗𝚊𝚋𝚕𝚎𝚍' : '𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍',
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        };
        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    const option = arg[0].toLowerCase();
    if (option === 'yes') {
        conf.ETAT = '3';
        await repondre(`┏━❑ 𝙰𝚄𝚃𝙾 𝚁𝙴𝙲𝙾𝚁𝙳 ━━━━━━━━━
┃ ✅ 𝙴𝚗𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    } else if (option === 'no') {
        conf.ETAT = '0';
        await repondre(`┏━❑ 𝙰𝚄𝚃𝙾 𝚁𝙴𝙲𝙾𝚁𝙳 ━━━━━━━━━
┃ ❌ 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 1️⃣5️⃣ AUTOTYPING COMMAND
// ============================================
silamd({
    nomCom: 'autotyping',
    alias: ['autotyping', 'typing'],
    reaction: '✍️',
    categorie: 'Settings',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝚊𝚞𝚝𝚘 𝚝𝚢𝚙𝚒𝚗𝚐'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        const buttons = [
            { buttonId: `autotyping yes`, buttonText: { displayText: conf.ETAT === '2' ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, type: 1 },
            { buttonId: `autotyping no`, buttonText: { displayText: conf.ETAT !== '2' ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, type: 1 }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙰𝚄𝚃𝙾 𝚃𝚈𝙿𝙸𝙽𝙶 ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${conf.ETAT === '2' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `✍️ 𝙰𝚞𝚝𝚘 𝚃𝚢𝚙𝚒𝚗𝚐`,
                    body: conf.ETAT === '2' ? '𝙴𝚗𝚊𝚋𝚕𝚎𝚍' : '𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍',
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        };
        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    const option = arg[0].toLowerCase();
    if (option === 'yes') {
        conf.ETAT = '2';
        await repondre(`┏━❑ 𝙰𝚄𝚃𝙾 𝚃𝚈𝙿𝙸𝙽𝙶 ━━━━━━━━━
┃ ✅ 𝙴𝚗𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    } else if (option === 'no') {
        conf.ETAT = '0';
        await repondre(`┏━❑ 𝙰𝚄𝚃𝙾 𝚃𝚈𝙿𝙸𝙽𝙶 ━━━━━━━━━
┃ ❌ 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 1️⃣6️⃣ ALWAYSONLINE COMMAND
// ============================================
silamd({
    nomCom: 'alwaysonline',
    alias: ['alwaysonline', 'online'],
    reaction: '🟢',
    categorie: 'Settings',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝚊𝚕𝚠𝚊𝚢𝚜 𝚘𝚗𝚕𝚒𝚗𝚎'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        const buttons = [
            { buttonId: `alwaysonline yes`, buttonText: { displayText: conf.ETAT === '1' ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, type: 1 },
            { buttonId: `alwaysonline no`, buttonText: { displayText: conf.ETAT !== '1' ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, type: 1 }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙰𝙻𝚆𝙰𝚈𝚂 𝙾𝙽𝙻𝙸𝙽𝙴 ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${conf.ETAT === '1' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `🟢 𝙰𝚕𝚠𝚊𝚢𝚜 𝙾𝚗𝚕𝚒𝚗𝚎`,
                    body: conf.ETAT === '1' ? '𝙴𝚗𝚊𝚋𝚕𝚎𝚍' : '𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍',
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        };
        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    const option = arg[0].toLowerCase();
    if (option === 'yes') {
        conf.ETAT = '1';
        await repondre(`┏━❑ 𝙰𝙻𝚆𝙰𝚈𝚂 𝙾𝙽𝙻𝙸𝙽𝙴 ━━━━━━━━━
┃ ✅ 𝙴𝚗𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    } else if (option === 'no') {
        conf.ETAT = '0';
        await repondre(`┏━❑ 𝙰𝙻𝚆𝙰𝚈𝚂 𝙾𝙽𝙻𝙸𝙽𝙴 ━━━━━━━━━
┃ ❌ 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 1️⃣7️⃣ AUTOLIKESTATUS COMMAND
// ============================================
silamd({
    nomCom: 'autolikestatus',
    alias: ['autolikestatus', 'likestatus'],
    reaction: '❤️',
    categorie: 'Settings',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝚊𝚞𝚝𝚘 𝚕𝚒𝚔𝚎 𝚜𝚝𝚊𝚝𝚞𝚜'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        const buttons = [
            { buttonId: `autolikestatus yes`, buttonText: { displayText: conf.AUTO_LIKE_STATUS === 'yes' ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, type: 1 },
            { buttonId: `autolikestatus no`, buttonText: { displayText: conf.AUTO_LIKE_STATUS === 'no' ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, type: 1 }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙰𝚄𝚃𝙾 𝙻𝙸𝙺𝙴 𝚂𝚃𝙰𝚃𝚄𝚂 ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${conf.AUTO_LIKE_STATUS === 'yes' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `❤️ 𝙰𝚞𝚝𝚘 𝙻𝚒𝚔𝚎`,
                    body: conf.AUTO_LIKE_STATUS === 'yes' ? '𝙴𝚗𝚊𝚋𝚕𝚎𝚍' : '𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍',
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: getRandomThumbnail(),
                    renderLargerThumbnail: false,
                }
            }
        };
        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    const option = arg[0].toLowerCase();
    if (option === 'yes') {
        conf.AUTO_LIKE_STATUS = 'yes';
        await repondre(`┏━❑ 𝙰𝚄𝚃𝙾 𝙻𝙸𝙺𝙴 𝚂𝚃𝙰𝚃𝚄𝚂 ━━━━━━━━━
┃ ✅ 𝙴𝚗𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    } else if (option === 'no') {
        conf.AUTO_LIKE_STATUS = 'no';
        await repondre(`┏━❑ 𝙰𝚄𝚃𝙾 𝙻𝙸𝙺𝙴 𝚂𝚃𝙰𝚃𝚄𝚂 ━━━━━━━━━
┃ ❌ 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 1️⃣8️⃣ SETTINGS COMMAND (MENU KUU)
// ============================================
silamd({
    nomCom: 'settings',
    alias: ['settings', 'setting', 'config'],
    reaction: '⚙️',
    categorie: 'Settings',
    desc: '𝚂𝚑𝚘𝚠 𝚊𝚕𝚕 𝚜𝚎𝚝𝚝𝚒𝚗𝚐𝚜'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    const settingsList = `┏━❑ 𝙱𝙾𝚃 𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂 ━━━━━━━━━
┃ 1️⃣ 𝙰𝚗𝚝𝚒𝚌𝚊𝚕𝚕: ${conf.ANTICALL === 'yes' ? '✅' : '⚫'}
┃ 2️⃣ 𝙰𝚞𝚝𝚘 𝚁𝚎𝚊𝚌𝚝: ${conf.AUTO_REACT === 'yes' ? '✅' : '⚫'}
┃ 3️⃣ 𝚁𝚎𝚊𝚍 𝚂𝚝𝚊𝚝𝚞𝚜: ${conf.AUTO_READ_STATUS === 'yes' ? '✅' : '⚫'}
┃ 4️⃣ 𝙰𝚗𝚝𝚒𝚍𝚎𝚕𝚎𝚝𝚎: ${conf.ADM === 'yes' ? '✅' : '⚫'}
┃ 5️⃣ 𝙳𝚕 𝚂𝚝𝚊𝚝𝚞𝚜: ${conf.AUTO_DOWNLOAD_STATUS === 'yes' ? '✅' : '⚫'}
┃ 6️⃣ 𝚂𝚝𝚊𝚛𝚝 𝙼𝚜𝚐: ${conf.DP === 'yes' ? '✅' : '⚫'}
┃ 7️⃣ 𝚁𝚎𝚊𝚍 𝙼𝚜𝚐: ${conf.AUTO_READ_MESSAGES === 'yes' ? '✅' : '⚫'}
┃ 8️⃣ 𝙿𝙼 𝙿𝚎𝚛𝚖𝚒𝚝: ${conf.PM_PERMIT === 'yes' ? '✅' : '⚫'}
┃ 9️⃣ 𝙲𝚑𝚊𝚝𝚋𝚘𝚝: ${conf.CHAT_BOT === 'yes' ? '✅' : '⚫'}
┃ 🔟 𝙶𝚛𝚎𝚎𝚝: ${conf.AUTO_REPLY === 'yes' ? '✅' : '⚫'}
┃ 1️⃣1️⃣ 𝙰𝚗𝚝𝚒𝚅𝚅: ${conf.ANTI_VV === 'yes' ? '✅' : '⚫'}
┃ 1️⃣2️⃣ 𝙿𝚞𝚋𝚕𝚒𝚌: ${conf.MODE === 'yes' ? '✅' : '⚫'}
┃ 1️⃣3️⃣ 𝙿𝚛𝚒𝚟𝚊𝚝𝚎: ${conf.MODE === 'no' ? '✅' : '⚫'}
┃ 1️⃣4️⃣ 𝙰𝚞𝚝𝚘 𝙻𝚒𝚔𝚎: ${conf.AUTO_LIKE_STATUS === 'yes' ? '✅' : '⚫'}
┗━━━━━━━━━━━━━━━━━━━━

𝚄𝚜𝚎 𝚒𝚗𝚍𝚒𝚟𝚒𝚍𝚞𝚊𝚕 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜 𝚝𝚘 𝚌𝚑𝚊𝚗𝚐𝚎
> © 𝚂𝙸𝙻𝙰-𝙼𝙳`;

    await repondre(settingsList);
});

// ============================================
// 1️⃣9️⃣ SETPREFIX COMMAND (HEROKU)
// ============================================
silamd({
    nomCom: 'setprefix',
    alias: ['setprefix', 'prefix'],
    reaction: '#️⃣',
    categorie: 'Settings',
    desc: '𝙲𝚑𝚊𝚗𝚐𝚎 𝚋𝚘𝚝 𝚙𝚛𝚎𝚏𝚒𝚡'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!conf.HEROKU_APP_NAME || !conf.HEROKU_API_KEY) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙷𝚎𝚛𝚘𝚔𝚞 𝚌𝚛𝚎𝚍𝚎𝚗𝚝𝚒𝚊𝚕𝚜 𝚖𝚒𝚜𝚜𝚒𝚗𝚐
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        return repondre(`┏━❑ 𝚄𝚂𝙰𝙶𝙴 ━━━━━━━━━
┃ 📝 𝚂𝚎𝚝𝚙𝚛𝚎𝚏𝚒𝚡 [𝚗𝚎𝚠𝚙𝚛𝚎𝚏𝚒𝚡]
┃ 𝙴𝚡: 𝚜𝚎𝚝𝚙𝚛𝚎𝚏𝚒𝚡 .
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    const result = await changeHerokuVar('PREFIXES', arg[0]);
    if (result.success) {
        await repondre(`┏━❑ 𝚂𝙴𝚃𝙿𝚁𝙴𝙵𝙸𝚇 ━━━━━━━━━
┃ ✅ 𝙿𝚛𝚎𝚏𝚒𝚡 𝚌𝚑𝚊𝚗𝚐𝚎𝚍 𝚝𝚘: ${arg[0]}
┃ 🔄 𝙱𝚘𝚝 𝚛𝚎𝚜𝚝𝚊𝚛𝚝𝚒𝚗𝚐...
┗━━━━━━━━━━━━━━━━━━━━`);
    } else {
        await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${result.error}
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});

// ============================================
// 2️⃣0️⃣ MENULINKS COMMAND (HEROKU)
// ============================================
silamd({
    nomCom: 'menulinks',
    alias: ['menulinks', 'setmenu'],
    reaction: '🔗',
    categorie: 'Settings',
    desc: '𝙲𝚑𝚊𝚗𝚐𝚎 𝚖𝚎𝚗𝚞 𝚕𝚒𝚗𝚔𝚜'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, arg } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!conf.HEROKU_APP_NAME || !conf.HEROKU_API_KEY) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙷𝚎𝚛𝚘𝚔𝚞 𝚌𝚛𝚎𝚍𝚎𝚗𝚝𝚒𝚊𝚕𝚜 𝚖𝚒𝚜𝚜𝚒𝚗𝚐
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    if (!arg[0]) {
        return repondre(`┏━❑ 𝚄𝚂𝙰𝙶𝙴 ━━━━━━━━━
┃ 📝 𝙼𝚎𝚗𝚞𝚕𝚒𝚗𝚔𝚜 [𝚞𝚛𝚕]
┃ 𝙴𝚡: 𝚖𝚎𝚗𝚞𝚕𝚒𝚗𝚔𝚜 https://files.catbox.moe/...
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    const result = await changeHerokuVar('BOT_MENU_LINKS', arg.join(' '));
    if (result.success) {
        await repondre(`┏━❑ 𝙼𝙴𝙽𝚄𝙻𝙸𝙽𝙺𝚂 ━━━━━━━━━
┃ ✅ 𝙼𝚎𝚗𝚞 𝚕𝚒𝚗𝚔𝚜 𝚞𝚙𝚍𝚊𝚝𝚎𝚍
┃ 🔄 𝙱𝚘𝚝 𝚛𝚎𝚜𝚝𝚊𝚛𝚝𝚒𝚗𝚐...
┗━━━━━━━━━━━━━━━━━━━━`);
    } else {
        await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${result.error}
┗━━━━━━━━━━━━━━━━━━━━`);
    }
});