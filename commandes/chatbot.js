const { silamd } = require("../silamd/sila");
const fs = require('fs');
const path = require('path');
const axios = require('axios');

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
const CHATBOT_FILE = path.join(__dirname, '../database/chatbot.json');

// Ensure database exists
const ensureDatabase = () => {
    const dbDir = path.join(__dirname, '../database');
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
    if (!fs.existsSync(CHATBOT_FILE)) {
        fs.writeFileSync(CHATBOT_FILE, JSON.stringify({}));
    }
};

// Load settings
const loadSettings = () => {
    try {
        ensureDatabase();
        const data = fs.readFileSync(CHATBOT_FILE, 'utf8');
        return JSON.parse(data);
    } catch (e) {
        console.log('❌ Error loading chatbot settings:', e);
        return {};
    }
};

// Save settings
const saveSettings = (settings) => {
    try {
        ensureDatabase();
        fs.writeFileSync(CHATBOT_FILE, JSON.stringify(settings, null, 2));
    } catch (e) {
        console.log('❌ Error saving chatbot settings:', e);
    }
};

// AI Response function using the API
const getAIResponse = async (message) => {
    try {
        // Using the API you provided
        const apiUrl = `https://api.yupra.my.id/api/ai/gpt5?text=${encodeURIComponent(message.trim())}`;
        
        const response = await axios.get(apiUrl, {
            timeout: 30000, // 30 seconds timeout
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        // Check different possible response formats
        if (response.data) {
            // If response is directly a string
            if (typeof response.data === 'string') {
                return response.data;
            }
            // If response has a 'result' or 'message' field
            else if (response.data.result) {
                return response.data.result;
            }
            else if (response.data.message) {
                return response.data.message;
            }
            else if (response.data.response) {
                return response.data.response;
            }
            else if (response.data.data) {
                return response.data.data;
            }
            // If response is an object but we don't know the structure
            else {
                return JSON.stringify(response.data);
            }
        }
        
        return "𝙼𝚊𝚊𝚏𝚊, 𝚜𝚒𝚔𝚞𝚙𝚊𝚝𝚒𝚔𝚊 𝚓𝚒𝚋𝚞 𝚔𝚠𝚊 𝚜𝚊𝚜𝚊 𝚑𝚒𝚟𝚒.";
    } catch (error) {
        console.error('AI API Error:', error.message);
        
        // Fallback responses if API fails
        const fallbackResponses = [
            "𝚂𝚊𝚖𝚊𝚑𝚊𝚗𝚒, 𝚗𝚊𝚝𝚊𝚝𝚒𝚣𝚊 𝚔𝚞𝚙𝚊𝚝𝚊 𝚓𝚒𝚋𝚞. 𝙹𝚊𝚛𝚒𝚋𝚞 𝚝𝚎𝚗𝚊 𝚋𝚊𝚊𝚍𝚊𝚎.",
            "𝙽𝚒 𝚜𝚊𝚖𝚊𝚑𝚊𝚗𝚒, 𝚜𝚎𝚛𝚟𝚎𝚛 𝚣𝚊𝚒𝚍𝚒 𝚔𝚞𝚠𝚊 𝚗𝚊 𝚜𝚑𝚒𝚍𝚊. 𝚃𝚊𝚛𝚝𝚊𝚛𝚒𝚊 𝚝𝚞𝚗𝚐𝚘𝚓𝚎 𝚔𝚒𝚍𝚊𝚐𝚘.",
            "𝙰𝚙𝚒 𝚑𝚊𝚒𝚏𝚊𝚗𝚢𝚒 𝚔𝚊𝚣𝚒 𝚔𝚠𝚊 𝚜𝚊𝚜𝚊. 𝚃𝚞𝚖𝚒𝚊 𝚌𝚑𝚊𝚝𝚋𝚘𝚝 𝚋𝚊𝚊𝚍𝚊𝚎.",
            "𝙺𝚞𝚖𝚎𝚠𝚎𝚣𝚎𝚔𝚊𝚗𝚊 𝚔𝚘𝚜𝚊 𝚔𝚝𝚊𝚔𝚊𝚝𝚒𝚔𝚊 𝚌𝚑𝚊𝚝𝚋𝚘𝚝. 𝙹𝚊𝚛𝚒𝚋𝚞 𝚝𝚎𝚗𝚊."
        ];
        
        return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
};

sila({
    nomCom: 'chatbot',
    alias: ['chatbot', 'botai', 'ai', 'chat'],
    reaction: '🤖',
    desc: '𝚃𝚞𝚛𝚗 𝙾𝚗/𝙾𝚏𝚏 𝙰𝙸 𝙲𝚑𝚊𝚝𝚋𝚘𝚝 (𝙰𝚞𝚝𝚘 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜)',
    Categorie: 'AI',
    ownerOnly: true // Only owner can turn on/off
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
            enabled: false // Default is OFF
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
                buttonId: `${prefixe}chatbot on`, 
                buttonText: { displayText: currentStatus === '𝙾𝙽' ? "✅ 𝙾𝙽 (𝙰𝚌𝚝𝚒𝚟𝚎)" : "🔴 𝚃𝚄𝚁𝙽 𝙾𝙽" }, 
                type: 1 
            },
            { 
                buttonId: `${prefixe}chatbot off`, 
                buttonText: { displayText: currentStatus === '𝙾𝙵𝙵' ? "⚫ 𝙾𝙵𝙵 (𝙸𝚗𝚊𝚌𝚝𝚒𝚟𝚎)" : "⚫ 𝚃𝚄𝚁𝙽 𝙾𝙵𝙵" }, 
                type: 1 
            },
            { 
                buttonId: `${prefixe}chatbot test`, 
                buttonText: { displayText: "🧪 𝚃𝙴𝚂𝚃 𝙰𝙸" }, 
                type: 1 
            }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 𝙲𝙾𝙽𝙵𝙸𝙶 ━━━━━━━━━
┃ 🤖 *𝙲𝚑𝚊𝚝𝚋𝚘𝚝 𝚂𝚝𝚊𝚝𝚞𝚜:* ${currentStatus}
┃ 
┃ 📋 *𝙵𝚎𝚊𝚝𝚞𝚛𝚎𝚜:* 
┃    • 𝙰𝙸-𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚎𝚜
┃    • 𝙰𝚞𝚝𝚘𝚖𝚊𝚝𝚒𝚌 𝚛𝚎𝚙𝚕𝚢 𝚒𝚗 𝙿𝙼
┃    • 𝚄𝚜𝚎𝚜 𝙶𝙿𝚃-𝟻 𝙰𝙿𝙸
┃ 
┃ ⚙️ *𝙷𝚘𝚠 𝚝𝚘 𝚞𝚜𝚎:*
┃    • 𝚃𝚞𝚛𝚗 𝙾𝙽 → 𝚋𝚘𝚝 𝚊𝚗𝚜𝚠𝚎𝚛𝚜 𝚊𝚕𝚕 𝙿𝙼
┃    • 𝚃𝚞𝚛𝚗 𝙾𝙵𝙵 → 𝚍𝚒𝚜𝚊𝚋𝚕𝚎 𝚊𝚞𝚝𝚘-𝚛𝚎𝚙𝚕𝚢
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
    // HANDLE TEST COMMAND
    // ============================================
    if (action === 'test') {
        const testMessage = arg.slice(1).join(' ') || '𝙷𝚎𝚕𝚕𝚘, 𝚑𝚘𝚠 𝚊𝚛𝚎 𝚢𝚘𝚞?';
        
        await repondre(`┏━❑ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 𝚃𝙴𝚂𝚃 ━━━━━━━━━
┃ 🤔 *𝚃𝚎𝚜𝚝𝚒𝚗𝚐 𝙰𝙿𝙸...*
┃ 📝 *𝙼𝚎𝚜𝚜𝚊𝚐𝚎:* ${testMessage}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);

        const aiResponse = await getAIResponse(testMessage);
        
        return await repondre(`┏━❑ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 𝚁𝙴𝚂𝙿𝙾𝙽𝚂𝙴 ━━━━━━━━━
┃ 🤖 *𝙰𝙸 𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎:*
┃ 
┃ ${aiResponse}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }

    // ============================================
    // HANDLE ON/OFF
    // ============================================
    if (action === 'on') {
        if (settings.global.enabled) {
            return await repondre(`┏━❑ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 ━━━━━━━━━
┃ ⚠️ 𝙲𝚑𝚊𝚝𝚋𝚘𝚝 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 *𝙾𝙽*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }
        
        settings.global.enabled = true;
        saveSettings(settings);
        
        await zk.sendMessage(dest, {
            text: `┏━❑ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 ━━━━━━━━━
┃ ✅ *𝙲𝚑𝚊𝚝𝚋𝚘𝚝 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚝𝚞𝚛𝚗𝚎𝚍 𝙾𝙽*
┃ 
┃ 📋 *𝙵𝚎𝚊𝚝𝚞𝚛𝚎𝚜 𝙴𝚗𝚊𝚋𝚕𝚎𝚍:*
┃ • 🤖 𝙰𝙸 𝚠𝚒𝚕𝚕 𝚊𝚗𝚜𝚠𝚎𝚛 𝚊𝚕𝚕 𝙿𝙼 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜
┃ • 🧠 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝙶𝙿𝚃-𝟻 𝙰𝙿𝙸
┃ • ⚡ 𝚁𝚎𝚊𝚕-𝚝𝚒𝚖𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚎𝚜
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
            return await repondre(`┏━❑ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 ━━━━━━━━━
┃ ⚠️ 𝙲𝚑𝚊𝚝𝚋𝚘𝚝 𝚒𝚜 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 *𝙾𝙵𝙵*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }
        
        settings.global.enabled = false;
        saveSettings(settings);
        
        await zk.sendMessage(dest, {
            text: `┏━❑ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 ━━━━━━━━━
┃ ❌ *𝙲𝚑𝚊𝚝𝚋𝚘𝚝 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚝𝚞𝚛𝚗𝚎𝚍 𝙾𝙵𝙵*
┃ 
┃ 📋 *𝙵𝚎𝚊𝚝𝚞𝚛𝚎𝚜 𝙳𝚒𝚜𝚊𝚋𝚕𝚎𝚍:*
┃ • 🤖 𝙰𝙸 𝚠𝚒𝚕𝚕 𝚗𝚘𝚝 𝚊𝚗𝚜𝚠𝚎𝚛 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜
┃ • 💬 𝙽𝚘𝚛𝚖𝚊𝚕 𝚌𝚑𝚊𝚝 𝚘𝚗𝚕𝚢
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
    console.log("❌ Chatbot Command Error: " + e);
    await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
}
});