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
const ANTILINK_FILE = path.join(__dirname, '../database/antilink.json');

// Ensure database exists
const ensureDatabase = () => {
    const dbDir = path.join(__dirname, '../database');
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
    if (!fs.existsSync(ANTILINK_FILE)) {
        fs.writeFileSync(ANTILINK_FILE, JSON.stringify({}));
    }
};

// Load settings
const loadSettings = () => {
    try {
        ensureDatabase();
        const data = fs.readFileSync(ANTILINK_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.log('❌ Error loading antilink settings:', e);
        return {};
    }
};

// Save settings
const saveSettings = (settings) => {
    try {
        ensureDatabase();
        fs.writeFileSync(ANTILINK_FILE, JSON.stringify(settings, null, 2));
    } catch (e) {
        console.log('❌ Error saving antilink settings:', e);
    }
};

sila({
    nomCom: 'antilink',
    alias: ['antilink', 'antilinkon', 'antilinkoff'],
    reaction: '🔗',
    desc: '𝚃𝚞𝚛𝚗 𝙾𝚗/𝙾𝚏𝚏 𝙰𝚗𝚝𝚒𝚕𝚒𝚗𝚔 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙',
    Categorie: 'Group',
    fromMe: 'false' // Group admins can use
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre, prefixe, nomAuteurMessage, arg, verifGroupe, verifAdmin, superUser } = commandeOptions;
    
    // Check if it's a group
    if (!verifGroupe) {
        return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚌𝚊𝚗 𝚘𝚗𝚕𝚢 𝚋𝚎 𝚞𝚜𝚎𝚍 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙𝚜
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }

    // Check if user is admin or owner
    if (!verifAdmin && !superUser) {
        return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚗𝚕𝚢 𝚐𝚛𝚘𝚞𝚙 𝚊𝚍𝚖𝚒𝚗𝚜 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }

    // Load current settings
    let settings = loadSettings();
    if (!settings[dest]) {
        settings[dest] = { 
            enabled: false,
            action: 'delete', // delete, remove, warn
            warnedUsers: {} 
        };
    }

    const currentStatus = settings[dest].enabled ? '𝙾𝙽' : '𝙾𝙵𝙵';
    const currentAction = settings[dest].action || 'delete';
    
    // Format action for display
    let actionDisplay = '';
    if (currentAction === 'delete') actionDisplay = '❌ 𝙳𝚎𝚕𝚎𝚝𝚎 𝙾𝚗𝚕𝚢';
    else if (currentAction === 'remove') actionDisplay = '🚫 𝚁𝚎𝚖𝚘𝚟𝚎 𝙼𝚎𝚖𝚋𝚎𝚛';
    else if (currentAction === 'warn') actionDisplay = '⚠️ 𝚆𝚊𝚛𝚗 𝚂𝚢𝚜𝚝𝚎𝚖';

    const action = arg[0] ? arg[0].toLowerCase() : null;

    // ============================================
    // SHOW MENU WITH BUTTONS (No argument)
    // ============================================
    if (!action || (action !== 'on' && action !== 'off' && action !== 'action')) {
        const buttons = [
            { 
                buttonId: `${prefixe}antilink on`, 
                buttonText: { displayText: currentStatus === '𝙾𝙽' ? "✅ 𝙾𝙽 (𝙰𝚌𝚝𝚒𝚟𝚎)" : "🔴 𝚃𝚄𝚁𝙽 𝙾𝙽" }, 
                type: 1 
            },
            { 
                buttonId: `${prefixe}antilink off`, 
                buttonText: { displayText: currentStatus === '𝙾𝙵𝙵' ? "⚫ 𝙾𝙵𝙵 (𝙸𝚗𝚊𝚌𝚝𝚒𝚟𝚎)" : "⚫ 𝚃𝚄𝚁𝙽 𝙾𝙵𝙵" }, 
                type: 1 
            },
            { 
                buttonId: `${prefixe}antilink action`, 
                buttonText: { displayText: "⚙️ 𝚂𝙴𝚃 𝙰𝙲𝚃𝙸𝙾𝙽" }, 
                type: 1 
            }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 𝙲𝙾𝙽𝙵𝙸𝙶 ━━━━━━━━━
┃ 📊 *𝚂𝚝𝚊𝚝𝚞𝚜:* ${currentStatus}
┃ ⚙️ *𝙰𝚌𝚝𝚒𝚘𝚗:* ${actionDisplay}
┃ 👥 *𝙶𝚛𝚘𝚞𝚙:* ${infosGroupe?.subject || 'Unknown'}
┃ 
┃ 🔗 *𝙵𝚎𝚊𝚝𝚞𝚛𝚎𝚜:* 
┃    • 𝙳𝚎𝚝𝚎𝚌𝚝𝚜 𝙰𝚕𝚕 𝙻𝚒𝚗𝚔𝚜
┃    • 𝙰𝚞𝚝𝚘 𝙳𝚎𝚕𝚎𝚝𝚎 𝙼𝚎𝚜𝚜𝚊𝚐𝚎𝚜
┃    • 𝚆𝚊𝚛𝚗/𝚁𝚎𝚖𝚘𝚟𝚎 𝚂𝚢𝚜𝚝𝚎𝚖
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
    // HANDLE ACTION SETTINGS
    // ============================================
    if (action === 'action') {
        const actionButtons = [
            { 
                buttonId: `${prefixe}antilink setaction delete`, 
                buttonText: { displayText: "❌ 𝙳𝙴𝙻𝙴𝚃𝙴 𝙾𝙽𝙻𝚈" }, 
                type: 1 
            },
            { 
                buttonId: `${prefixe}antilink setaction remove`, 
                buttonText: { displayText: "🚫 𝚁𝙴𝙼𝙾𝚅𝙴 𝙼𝙴𝙼𝙱𝙴𝚁" }, 
                type: 1 
            },
            { 
                buttonId: `${prefixe}antilink setaction warn`, 
                buttonText: { displayText: "⚠️ 𝚆𝙰𝚁𝙽 𝚂𝚈𝚂𝚃𝙴𝙼" }, 
                type: 1 
            }
        ];

        const actionMessage = {
            text: `┏━❑ 𝚂𝙴𝙻𝙴𝙲𝚃 𝙰𝙲𝚃𝙸𝙾𝙽 ━━━━━━━━━
┃ 📋 *𝙲𝚑𝚘𝚘𝚜𝚎 𝚠𝚑𝚊𝚝 𝚑𝚊𝚙𝚙𝚎𝚗𝚜 𝚠𝚑𝚎𝚗 𝚊 𝚕𝚒𝚗𝚔 𝚒𝚜 𝚍𝚎𝚝𝚎𝚌𝚝𝚎𝚍:*
┃ 
┃ ❌ *𝙳𝚎𝚕𝚎𝚝𝚎 𝙾𝚗𝚕𝚢* - 𝙼𝚎𝚜𝚜𝚊𝚐𝚎 𝚒𝚜 𝚍𝚎𝚕𝚎𝚝𝚎𝚍
┃ 🚫 *𝚁𝚎𝚖𝚘𝚟𝚎 𝙼𝚎𝚖𝚋𝚎𝚛* - 𝙼𝚎𝚜𝚜𝚊𝚐𝚎 𝚍𝚎𝚕𝚎𝚝𝚎𝚍 & 𝚞𝚜𝚎𝚛 𝚛𝚎𝚖𝚘𝚟𝚎𝚍
┃ ⚠️ *𝚆𝚊𝚛𝚗 𝚂𝚢𝚜𝚝𝚎𝚖* - 𝟹 𝚠𝚊𝚛𝚗𝚒𝚗𝚐𝚜 𝚝𝚑𝚎𝚗 𝚛𝚎𝚖𝚘𝚟𝚎
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝙾𝚃 © 2026",
            buttons: actionButtons,
            headerType: 1
        };

        return await zk.sendMessage(dest, actionMessage, { quoted: fkontak });
    }

    // ============================================
    // HANDLE SETACTION
    // ============================================
    if (action === 'setaction' && arg[1]) {
        const newAction = arg[1].toLowerCase();
        if (['delete', 'remove', 'warn'].includes(newAction)) {
            settings[dest].action = newAction;
            saveSettings(settings);
            
            let actionMsg = '';
            if (newAction === 'delete') actionMsg = '❌ 𝙼𝚎𝚜𝚜𝚊𝚐𝚎𝚜 𝚠𝚒𝚕𝚕 𝚋𝚎 𝚍𝚎𝚕𝚎𝚝𝚎𝚍 𝚘𝚗𝚕𝚢';
            else if (newAction === 'remove') actionMsg = '🚫 𝚄𝚜𝚎𝚛𝚜 𝚠𝚒𝚕𝚕 𝚋𝚎 𝚛𝚎𝚖𝚘𝚟𝚎𝚍 𝚒𝚖𝚖𝚎𝚍𝚒𝚊𝚝𝚎𝚕𝚢';
            else if (newAction === 'warn') actionMsg = '⚠️ 𝚄𝚜𝚎𝚛𝚜 𝚠𝚒𝚕𝚕 𝚋𝚎 𝚠𝚊𝚛𝚗𝚎𝚍 (𝟹 𝚠𝚊𝚛𝚗𝚒𝚗𝚐𝚜 𝚝𝚑𝚎𝚗 𝚛𝚎𝚖𝚘𝚟𝚎)';
            
            return await repondre(`┏━❑ 𝙰𝙲𝚃𝙸𝙾𝙽 𝚄𝙿𝙳𝙰𝚃𝙴𝙳 ━━━━━━━━━
┃ ✅ *𝙰𝚗𝚝𝚒𝚕𝚒𝚗𝚔 𝚊𝚌𝚝𝚒𝚘𝚗 𝚌𝚑𝚊𝚗𝚐𝚎𝚍 𝚝𝚘:*
┃ 
┃ ${actionMsg}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }
    }

    // ============================================
    // HANDLE ON/OFF
    // ============================================
    if (action === 'on') {
        if (settings[dest].enabled) {
            return await repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 ━━━━━━━━━
┃ ⚠️ 𝙰𝚗𝚝𝚒𝚕𝚒𝚗𝚔 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 *𝙾𝙽*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }
        
        settings[dest].enabled = true;
        settings[dest].warnedUsers = {}; // Reset warnings
        saveSettings(settings);
        
        await zk.sendMessage(dest, {
            text: `┏━❑ 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 ━━━━━━━━━
┃ ✅ *𝙰𝚗𝚝𝚒𝚕𝚒𝚗𝚔 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚝𝚞𝚛𝚗𝚎𝚍 𝙾𝙽*
┃ 
┃ 📋 *𝙵𝚎𝚊𝚝𝚞𝚛𝚎𝚜 𝙴𝚗𝚊𝚋𝚕𝚎𝚍:*
┃ • 🔗 𝙰𝚕𝚕 𝚕𝚒𝚗𝚔𝚜 𝚠𝚒𝚕𝚕 𝚋𝚎 𝚍𝚎𝚝𝚎𝚌𝚝𝚎𝚍
┃ • ${actionDisplay}
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
        if (!settings[dest].enabled) {
            return await repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 ━━━━━━━━━
┃ ⚠️ 𝙰𝚗𝚝𝚒𝚕𝚒𝚗𝚔 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 *𝙾𝙵𝙵*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }
        
        settings[dest].enabled = false;
        saveSettings(settings);
        
        await zk.sendMessage(dest, {
            text: `┏━❑ 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 ━━━━━━━━━
┃ ❌ *𝙰𝚗𝚝𝚒𝚕𝚒𝚗𝚔 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚝𝚞𝚛𝚗𝚎𝚍 𝙾𝙵𝙵*
┃ 
┃ 📋 *𝙵𝚎𝚊𝚝𝚞𝚛𝚎𝚜 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍:*
┃ • 🔗 𝙻𝚒𝚗𝚔𝚜 𝚠𝚒𝚕𝚕 𝚋𝚎 𝚊𝚕𝚕𝚘𝚠𝚎𝚍
┃ • ⚠️ 𝙽𝚘 𝚊𝚌𝚝𝚒𝚘𝚗 𝚠𝚒𝚕𝚕 𝚋𝚎 𝚝𝚊𝚔𝚎𝚗
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
    console.log("❌ Antilink Command Error: " + e);
    await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
}
});