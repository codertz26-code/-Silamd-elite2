const { silamd } = require("../silamd/sila");
const fs = require('fs');
const path = require('path');

// FakevCard sawa na index
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

// Path ya database
const ANTIDELETE_FILE = path.join(__dirname, '../database/antidelete.json');

// Ensure database exists
const ensureDatabase = () => {
    const dbDir = path.join(__dirname, '../database');
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
    if (!fs.existsSync(ANTIDELETE_FILE)) {
        fs.writeFileSync(ANTIDELETE_FILE, JSON.stringify({}));
    }
};

// Load settings
const loadSettings = () => {
    try {
        ensureDatabase();
        const data = fs.readFileSync(ANTIDELETE_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.log('❌ Error loading antidelete settings:', e);
        return {};
    }
};

// Save settings
const saveSettings = (settings) => {
    try {
        ensureDatabase();
        fs.writeFileSync(ANTIDELETE_FILE, JSON.stringify(settings, null, 2));
    } catch (e) {
        console.log('❌ Error saving antidelete settings:', e);
    }
};

sila({
    nomCom: 'antidelete',
    alias: ['antidelete', 'antidel', 'antidelon', 'antideloff'],
    reaction: '🗑️',
    desc: '𝚃𝚞𝚛𝚗 𝙾𝚗/𝙾𝚏𝚏 𝙰𝚗𝚝𝚒𝚍𝚎𝚕𝚎𝚝𝚎 (𝚜𝚎𝚗𝚍𝚜 𝚍𝚎𝚕𝚎𝚝𝚎𝚍 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜 𝚝𝚘 𝚘𝚠𝚗𝚎𝚛)',
    Categorie: 'Owner',
    ownerOnly: true // Only owner can use this
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre, prefixe, nomAuteurMessage, arg, superUser } = commandeOptions;
    
    // Check if user is owner
    if (!superUser) {
        return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚗𝚕𝚢 𝚝𝚑𝚎 𝙱𝚘𝚝 𝙾𝚠𝚗𝚎𝚛 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }

    // Load current settings
    let settings = loadSettings();
    if (!settings.global) {
        settings.global = { 
            enabled: conf.ADM?.toLowerCase() === 'yes' // Use config default
        };
    }

    const currentStatus = settings.global.enabled ? '𝙾𝙽' : '𝙾𝙵𝙵';
    const action = arg[0] ? arg[0].toLowerCase() : null;

    // ============================================
    // SHOW MENU WITH BUTTONS (No argument)
    // ============================================
    if (!action || (action !== 'on' && action !== 'off')) {
        const buttons = [
            { 
                buttonId: `${prefixe}antidelete on`, 
                buttonText: { displayText: currentStatus === '𝙾𝙽' ? "✅ 𝙾𝙽 (𝙰𝚌𝚝𝚒𝚟𝚎)" : "🔴 𝚃𝚄𝚁𝙽 𝙾𝙽" }, 
                type: 1 
            },
            { 
                buttonId: `${prefixe}antidelete off`, 
                buttonText: { displayText: currentStatus === '𝙾𝙵𝙵' ? "⚫ 𝙾𝙵𝙵 (𝙸𝚗𝚊𝚌𝚝𝚒𝚟𝚎)" : "⚫ 𝚃𝚄𝚁𝙽 𝙾𝙵𝙵" }, 
                type: 1 
            },
            { 
                buttonId: `${prefixe}antidelete status`, 
                buttonText: { displayText: "📊 𝙲𝙷𝙴𝙲𝙺 𝚂𝚃𝙰𝚃𝚄𝚂" }, 
                type: 1 
            }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙰𝙽𝚃𝙸𝙳𝙴𝙻𝙴𝚃𝙴 𝙲𝙾𝙽𝙵𝙸𝙶 ━━━━━━━━━
┃ 📊 *𝙶𝚕𝚘𝚋𝚊𝚕 𝚂𝚝𝚊𝚝𝚞𝚜:* ${currentStatus}
┃ 
┃ 🗑️ *𝙵𝚎𝚊𝚝𝚞𝚛𝚎𝚜:* 
┃    • 𝙳𝚎𝚝𝚎𝚌𝚝𝚜 𝚊𝚕𝚕 𝚍𝚎𝚕𝚎𝚝𝚎𝚍 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜
┃    • 𝚂𝚎𝚗𝚍𝚜 𝚌𝚘𝚙𝚢 𝚝𝚘 𝚘𝚠𝚗𝚎𝚛'𝚜 𝚒𝚗𝚋𝚘𝚡
┃    • 𝚆𝚘𝚛𝚔𝚜 𝚒𝚗 𝚋𝚘𝚝𝚑 𝚐𝚛𝚘𝚞𝚙𝚜 & 𝙿𝙼
┗━━━━━━━━━━━━━━━━━━━━

𝙲𝚑𝚘𝚘𝚜𝚎 𝚊𝚗 𝚘𝚙𝚝𝚒𝚘𝚗 𝚋𝚎𝚕𝚘𝚠:
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝙾𝚃 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                mentionedJid: [nomAuteurMessage],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402325089913@newsletter',
                    newsletterName: '© 𝚂𝙸𝙻𝙰 𝙼𝙳',
                    serverMessageId: 143,
                }
            }
        };

        return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
    }

    // ============================================
    // HANDLE STATUS CHECK
    // ============================================
    if (action === 'status') {
        return await repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙳𝙴𝙻𝙴𝚃𝙴 𝚂𝚃𝙰𝚃𝚄𝚂 ━━━━━━━━━
┃ 📊 *𝙲𝚞𝚛𝚛𝚎𝚗𝚝 𝚂𝚝𝚊𝚝𝚞𝚜:* ${currentStatus}
┃ 
┃ 📋 *𝙳𝚎𝚝𝚊𝚒𝚕𝚜:*
┃ • 𝙲𝚘𝚗𝚏𝚒𝚐 𝚜𝚎𝚝𝚝𝚒𝚗𝚐: ${conf.ADM}
┃ • 𝙰𝚌𝚝𝚒𝚟𝚎: ${settings.global.enabled ? '𝚈𝚎𝚜' : '𝙽𝚘'}
┃ 
┃ 📍 *𝙳𝚎𝚕𝚎𝚝𝚎𝚍 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜 𝚠𝚒𝚕𝚕 𝚋𝚎 𝚜𝚎𝚗𝚝 𝚝𝚘:*
┃ 👑 ${conf.NUMERO_OWNER}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }

    // ============================================
    // HANDLE ON/OFF
    // ============================================
    if (action === 'on') {
        if (settings.global.enabled) {
            return await repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙳𝙴𝙻𝙴𝚃𝙴 ━━━━━━━━━
┃ ⚠️ 𝙰𝚗𝚝𝚒𝚍𝚎𝚕𝚎𝚝𝚎 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 *𝙾𝙽*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }
        
        settings.global.enabled = true;
        saveSettings(settings);
        
        await zk.sendMessage(dest, {
            text: `┏━❑ 𝙰𝙽𝚃𝙸𝙳𝙴𝙻𝙴𝚃𝙴 ━━━━━━━━━
┃ ✅ *𝙰𝚗𝚝𝚒𝚍𝚎𝚕𝚎𝚝𝚎 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚝𝚞𝚛𝚗𝚎𝚍 𝙾𝙽*
┃ 
┃ 📋 *𝙵𝚎𝚊𝚝𝚞𝚛𝚎𝚜 𝙴𝚗𝚊𝚋𝚕𝚎𝚍:*
┃ • 🗑️ 𝙰𝚕𝚕 𝚍𝚎𝚕𝚎𝚝𝚎𝚍 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜 𝚠𝚒𝚕𝚕 𝚋𝚎 𝚌𝚊𝚙𝚝𝚞𝚛𝚎𝚍
┃ • 📬 𝚂𝚎𝚗𝚝 𝚍𝚒𝚛𝚎𝚌𝚝𝚕𝚢 𝚝𝚘 𝚢𝚘𝚞𝚛 𝚒𝚗𝚋𝚘𝚡
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
            contextInfo: {
                mentionedJid: [nomAuteurMessage],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402325089913@newsletter',
                    newsletterName: '© 𝚂𝙸𝙻𝙰 𝙼𝙳',
                    serverMessageId: 143,
                }
            }
        }, { quoted: fkontak });
        
    } else if (action === 'off') {
        if (!settings.global.enabled) {
            return await repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙳𝙴𝙻𝙴𝚃𝙴 ━━━━━━━━━
┃ ⚠️ 𝙰𝚗𝚝𝚒𝚍𝚎𝚕𝚎𝚝𝚎 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 *𝙾𝙵𝙵*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }
        
        settings.global.enabled = false;
        saveSettings(settings);
        
        await zk.sendMessage(dest, {
            text: `┏━❑ 𝙰𝙽𝚃𝙸𝙳𝙴𝙻𝙴𝚃𝙴 ━━━━━━━━━
┃ ❌ *𝙰𝚗𝚝𝚒𝚍𝚎𝚕𝚎𝚝𝚎 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚝𝚞𝚛𝚗𝚎𝚍 𝙾𝙵𝙵*
┃ 
┃ 📋 *𝙵𝚎𝚊𝚝𝚞𝚛𝚎𝚜 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍:*
┃ • 🗑️ 𝙳𝚎𝚕𝚎𝚝𝚎𝚍 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜 𝚠𝚒𝚕𝚕 𝚗𝚘𝚝 𝚋𝚎 𝚌𝚊𝚙𝚝𝚞𝚛𝚎𝚍
┃ • 📭 𝙽𝚘 𝚏𝚘𝚛𝚠𝚊𝚛𝚍𝚒𝚗𝚐 𝚝𝚘 𝚘𝚠𝚗𝚎𝚛
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
            contextInfo: {
                mentionedJid: [nomAuteurMessage],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402325089913@newsletter',
                    newsletterName: '© 𝚂𝙸𝙻𝙰 𝙼𝙳',
                    serverMessageId: 143,
                }
            }
        }, { quoted: fkontak });
    }

} catch (e) {
    console.log("❌ Antidelete Command Error: " + e);
    await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝿸𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
}
});