const { silamd } = require("../silamd/sila");
const fs = require('fs');
const path = require('path');

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

// Database path
const WELCOME_FILE = path.join(__dirname, '../database/welcome.json');

// Ensure database exists
const ensureDatabase = () => {
    const dbDir = path.join(__dirname, '../database');
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    if (!fs.existsSync(WELCOME_FILE)) fs.writeFileSync(WELCOME_FILE, JSON.stringify({}));
};

// Load settings
const loadSettings = () => {
    try {
        ensureDatabase();
        return JSON.parse(fs.readFileSync(WELCOME_FILE, 'utf8'));
    } catch {
        return {};
    }
};

// Save settings
const saveSettings = (settings) => {
    try {
        ensureDatabase();
        fs.writeFileSync(WELCOME_FILE, JSON.stringify(settings, null, 2));
    } catch (e) {
        console.log('❌ Error saving:', e);
    }
};

// Random thumbnails
const thumbnails = [
    "https://files.catbox.moe/krnlo3.jpeg",
    "https://files.catbox.moe/36vahk.png"
];

const getRandomThumbnail = () => thumbnails[Math.floor(Math.random() * thumbnails.length)];

sila({
    nomCom: 'welcome',
    alias: ['welcome', 'goodbye', 'farewell', 'wlc', 'gwelcome', 'gbye'],
    reaction: '👋',
    desc: '𝙾𝚗/𝙾𝚏𝚏 𝚠𝚎𝚕𝚌𝚘𝚖𝚎/𝚐𝚘𝚘𝚍𝚋𝚢𝚎',
    Categorie: 'Group',
    fromMe: 'false'
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre, prefixe, arg, verifGroupe, verifAdmin, superUser, infosGroupe, nomAuteurMessage } = commandeOptions;

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

    let settings = loadSettings();
    if (!settings[dest]) settings[dest] = { welcome: 'off', goodbye: 'off' };

    const type = arg[0] ? arg[0].toLowerCase() : null;
    const action = arg[1] ? arg[1].toLowerCase() : null;

    // Show menu if no valid args
    if (!type || (type !== 'welcome' && type !== 'goodbye') || !action || (action !== 'on' && action !== 'off')) {
        const welcomeStatus = settings[dest].welcome === 'on' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵';
        const goodbyeStatus = settings[dest].goodbye === 'on' ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵';

        const buttons = [
            { 
                buttonId: `${prefixe}welcome welcome on`, 
                buttonText: { displayText: `👋 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 ${settings[dest].welcome === 'on' ? '✅' : '🔴'}` }, 
                type: 1 
            },
            { 
                buttonId: `${prefixe}welcome welcome off`, 
                buttonText: { displayText: `👋 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 ${settings[dest].welcome === 'off' ? '⚫' : '⚪'}` }, 
                type: 1 
            },
            { 
                buttonId: `${prefixe}welcome goodbye on`, 
                buttonText: { displayText: `👋 𝙶𝙾𝙾𝙳𝙱𝚈𝙴 ${settings[dest].goodbye === 'on' ? '✅' : '🔴'}` }, 
                type: 1 
            },
            { 
                buttonId: `${prefixe}welcome goodbye off`, 
                buttonText: { displayText: `👋 𝙶𝙾𝙾𝙳𝙱𝚈𝙴 ${settings[dest].goodbye === 'off' ? '⚫' : '⚪'}` }, 
                type: 1 
            }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝚆𝙴𝙻𝙲𝙾𝙼𝙴/𝙶𝙾𝙾𝙳𝙱𝚈𝙴 ━━━━━━━━━
┃ 👥 ${infosGroupe.subject}
┃ 👋 𝚆𝚎𝚕𝚌𝚘𝚖𝚎: ${welcomeStatus}
┃ 👋 𝙶𝚘𝚘𝚍𝚋𝚢𝚎: ${goodbyeStatus}
┗━━━━━━━━━━━━━━━━━━━━`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                externalAdReply: {
                    title: `👋 𝙶𝚛𝚘𝚞𝚙 𝚆𝚎𝚕𝚌𝚘𝚖𝚎`,
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

    // Handle welcome on/off
    if (type === 'welcome') {
        if (action === 'on') {
            if (settings[dest].welcome === 'on') {
                return await repondre(`┏━❑ 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 ━━━━━━━━━
┃ ⚠️ 𝙰𝚕𝚛𝚎𝚊𝚍𝚢 𝙾𝙽
┗━━━━━━━━━━━━━━━━━━━━`);
            }
            settings[dest].welcome = 'on';
            saveSettings(settings);
            await repondre(`┏━❑ 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 ━━━━━━━━━
┃ ✅ 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝙾𝙽
┗━━━━━━━━━━━━━━━━━━━━`);
        } else if (action === 'off') {
            if (settings[dest].welcome === 'off') {
                return await repondre(`┏━❑ 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 ━━━━━━━━━
┃ ⚠️ 𝙰𝚕𝚛𝚎𝚊𝚍𝚢 𝙾𝙵𝙵
┗━━━━━━━━━━━━━━━━━━━━`);
            }
            settings[dest].welcome = 'off';
            saveSettings(settings);
            await repondre(`┏━❑ 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 ━━━━━━━━━
┃ ❌ 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝙾𝙵𝙵
┗━━━━━━━━━━━━━━━━━━━━`);
        }
    }

    // Handle goodbye on/off
    if (type === 'goodbye') {
        if (action === 'on') {
            if (settings[dest].goodbye === 'on') {
                return await repondre(`┏━❑ 𝙶𝙾𝙾𝙳𝙱𝚈𝙴 ━━━━━━━━━
┃ ⚠️ 𝙰𝚕𝚛𝚎𝚊𝚍𝚢 𝙾𝙽
┗━━━━━━━━━━━━━━━━━━━━`);
            }
            settings[dest].goodbye = 'on';
            saveSettings(settings);
            await repondre(`┏━❑ 𝙶𝙾𝙾𝙳𝙱𝚈𝙴 ━━━━━━━━━
┃ ✅ 𝙶𝚘𝚘𝚍𝚋𝚢𝚎 𝙾𝙽
┗━━━━━━━━━━━━━━━━━━━━`);
        } else if (action === 'off') {
            if (settings[dest].goodbye === 'off') {
                return await repondre(`┏━❑ 𝙶𝙾𝙾𝙳𝙱𝚈𝙴 ━━━━━━━━━
┃ ⚠️ 𝙰𝚕𝚛𝚎𝚊𝚍𝚢 𝙾𝙵𝙵
┗━━━━━━━━━━━━━━━━━━━━`);
            }
            settings[dest].goodbye = 'off';
            saveSettings(settings);
            await repondre(`┏━❑ 𝙶𝙾𝙾𝙳𝙱𝚈𝙴 ━━━━━━━━━
┃ ❌ 𝙶𝚘𝚘𝚍𝚋𝚢𝚎 𝙾𝙵𝙵
┗━━━━━━━━━━━━━━━━━━━━`);
        }
    }

} catch (e) {
    console.log("❌ Welcome Command Error: " + e);
    await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━`);
}
});