const { silamd } = require("../silamd/sila");
const conf = require("../set");
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

// Random thumbnails
const thumbnails = [
    "https://files.catbox.moe/krnlo3.jpeg",
    "https://files.catbox.moe/36vahk.png"
];

const getRandomThumbnail = () => thumbnails[Math.floor(Math.random() * thumbnails.length)];

// Settings configuration
const settings = [
    {
        name: 'anticall',
        alias: ['anticall', 'rejectcall'],
        var: 'ANTICALL',
        desc: '𝙱𝚕𝚘𝚌𝚔 𝚒𝚗𝚌𝚘𝚖𝚒𝚗𝚐 𝚌𝚊𝚕𝚕𝚜',
        options: ['yes', 'no']
    },
    {
        name: 'areact',
        alias: ['areact', 'autoreact'],
        var: 'AUTO_REACT',
        desc: '𝙰𝚞𝚝𝚘 𝚛𝚎𝚊𝚌𝚝 𝚝𝚘 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜',
        options: ['yes', 'no']
    },
    {
        name: 'readstatus',
        alias: ['readstatus', 'autoreadstatus'],
        var: 'AUTO_READ_STATUS',
        desc: '𝙰𝚞𝚝𝚘 𝚛𝚎𝚊𝚍 𝚜𝚝𝚊𝚝𝚞𝚜𝚎𝚜',
        options: ['yes', 'no']
    },
    {
        name: 'antidelete',
        alias: ['antidelete', 'antidel'],
        var: 'ADM',
        desc: '𝙳𝚎𝚝𝚎𝚌𝚝 𝚍𝚎𝚕𝚎𝚝𝚎𝚍 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜',
        options: ['yes', 'no']
    },
    {
        name: 'downloadstatus',
        alias: ['downloadstatus', 'savestatus'],
        var: 'AUTO_DOWNLOAD_STATUS',
        desc: '𝙰𝚞𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚜𝚝𝚊𝚝𝚞𝚜𝚎𝚜',
        options: ['yes', 'no']
    },
    {
        name: 'startmessage',
        alias: ['startmessage', 'startmsg'],
        var: 'DP',
        desc: '𝚂𝚑𝚘𝚠 𝚜𝚝𝚊𝚛𝚝 𝚖𝚎𝚜𝚜𝚊𝚐𝚎',
        options: ['yes', 'no']
    },
    {
        name: 'readmessage',
        alias: ['readmessage', 'autoread'],
        var: 'AUTO_READ_MESSAGES',
        desc: '𝙰𝚞𝚝𝚘 𝚛𝚎𝚊𝚍 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜',
        options: ['yes', 'no']
    },
    {
        name: 'pmpermit',
        alias: ['pmpermit', 'pm'],
        var: 'PM_PERMIT',
        desc: '𝙿𝚎𝚛𝚖𝚒𝚝 𝙿𝙼 𝚖𝚎𝚜𝚜𝚊𝚐𝚎𝚜',
        options: ['yes', 'no']
    },
    {
        name: 'chatbot',
        alias: ['chatbot', 'ai'],
        var: 'CHATBOT',
        desc: '𝙰𝙸 𝚌𝚑𝚊𝚝𝚋𝚘𝚝',
        options: ['yes', 'no']
    },
    {
        name: 'greet',
        alias: ['greet', 'autoreply'],
        var: 'AUTO_REPLY',
        desc: '𝙰𝚞𝚝𝚘 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚐𝚛𝚎𝚎𝚝𝚒𝚗𝚐𝚜',
        options: ['yes', 'no']
    },
    {
        name: 'antivv',
        alias: ['antivv', 'antiviewonce'],
        var: 'ANTI_VV',
        desc: '𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚟𝚒𝚎𝚠-𝚘𝚗𝚌𝚎',
        options: ['yes', 'no']
    },
    {
        name: 'publicmode',
        alias: ['publicmode', 'public'],
        var: 'MODE',
        desc: '𝙿𝚞𝚋𝚕𝚒𝚌 𝚖𝚘𝚍𝚎',
        options: ['yes', 'no']
    },
    {
        name: 'privatemode',
        alias: ['privatemode', 'private'],
        var: 'MODE',
        desc: '𝙿𝚛𝚒𝚟𝚊𝚝𝚎 𝚖𝚘𝚍𝚎',
        options: ['no', 'yes']
    },
    {
        name: 'autorecord',
        alias: ['autorecord', 'record'],
        var: 'ETAT',
        desc: '𝙰𝚞𝚝𝚘 𝚛𝚎𝚌𝚘𝚛𝚍𝚒𝚗𝚐',
        options: ['3', 'no']
    },
    {
        name: 'autotyping',
        alias: ['autotyping', 'type'],
        var: 'ETAT',
        desc: '𝙰𝚞𝚝𝚘 𝚝𝚢𝚙𝚒𝚗𝚐',
        options: ['2', 'no']
    },
    {
        name: 'alwaysonline',
        alias: ['alwaysonline', 'online'],
        var: 'ETAT',
        desc: '𝙰𝚕𝚠𝚊𝚢𝚜 𝚘𝚗𝚕𝚒𝚗𝚎',
        options: ['1', 'no']
    },
    {
        name: 'autolikestatus',
        alias: ['autolikestatus', 'likestatus'],
        var: 'AUTO_LIKE_STATUS',
        desc: '𝙰𝚞𝚝𝚘 𝚕𝚒𝚔𝚎 𝚜𝚝𝚊𝚝𝚞𝚜𝚎𝚜',
        options: ['yes', 'no']
    }
];

// Create all setting commands
settings.forEach(setting => {
    silamd({
        nomCom: setting.name,
        alias: setting.alias,
        reaction: '⚙️',
        categorie: 'Settings',
        desc: setting.desc
    },
    async (dest, zk, commandeOptions) => {
        const { ms, repondre, superUser, arg, prefixe, nomAuteurMessage } = commandeOptions;

        if (!superUser) {
            return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
        }

        const currentValue = conf[setting.var];
        const option = arg[0] ? arg[0].toLowerCase() : null;

        // Show menu with buttons if no option
        if (!option || (option !== setting.options[0] && option !== setting.options[1])) {
            const buttons = [
                { 
                    buttonId: `${prefixe}${setting.name} ${setting.options[0]}`, 
                    buttonText: { displayText: currentValue === setting.options[0] ? "✅ 𝙾𝙽" : "🔴 𝙾𝙽" }, 
                    type: 1 
                },
                { 
                    buttonId: `${prefixe}${setting.name} ${setting.options[1]}`, 
                    buttonText: { displayText: currentValue === setting.options[1] ? "✅ 𝙾𝙵𝙵" : "⚫ 𝙾𝙵𝙵" }, 
                    type: 1 
                }
            ];

            const buttonMessage = {
                text: `┏━❑ ${setting.name.toUpperCase()} ━━━━━━━━━
┃ 📊 𝙲𝚞𝚛𝚛𝚎𝚗𝚝: ${currentValue === setting.options[0] ? '✅ 𝙾𝙽' : '⚫ 𝙾𝙵𝙵'}
┃ 📝 ${setting.desc}
┗━━━━━━━━━━━━━━━━━━━━`,
                footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
                buttons: buttons,
                headerType: 1,
                contextInfo: {
                    externalAdReply: {
                        title: `⚙️ ${setting.name}`,
                        body: setting.desc,
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

        // Handle on/off
        if (option === setting.options[0]) {
            if (currentValue === setting.options[0]) {
                return repondre(`┏━❑ ${setting.name.toUpperCase()} ━━━━━━━━━
┃ ⚠️ 𝙰𝚕𝚛𝚎𝚊𝚍𝚢 𝙾𝙽
┗━━━━━━━━━━━━━━━━━━━━`);
            }
            conf[setting.var] = setting.options[0];
            
            await zk.sendMessage(dest, {
                text: `┏━❑ ${setting.name.toUpperCase()} ━━━━━━━━━
┃ ✅ 𝚃𝚞𝚛𝚗𝚎𝚍 𝙾𝙽
┃ 👤 @${nomAuteurMessage.split('@')[0]}
┗━━━━━━━━━━━━━━━━━━━━`,
                mentions: [nomAuteurMessage],
                contextInfo: {
                    externalAdReply: {
                        title: `✅ ${setting.name} 𝙾𝙽`,
                        body: setting.desc,
                        mediaType: 1,
                        previewType: 0,
                        thumbnailUrl: getRandomThumbnail(),
                        renderLargerThumbnail: false,
                    }
                }
            }, { quoted: fkontak });

        } else if (option === setting.options[1]) {
            if (currentValue === setting.options[1]) {
                return repondre(`┏━❑ ${setting.name.toUpperCase()} ━━━━━━━━━
┃ ⚠️ 𝙰𝚕𝚛𝚎𝚊𝚍𝚢 𝙾𝙵𝙵
┗━━━━━━━━━━━━━━━━━━━━`);
            }
            conf[setting.var] = setting.options[1];
            
            await zk.sendMessage(dest, {
                text: `┏━❑ ${setting.name.toUpperCase()} ━━━━━━━━━
┃ ❌ 𝚃𝚞𝚛𝚗𝚎𝚍 𝙾𝙵𝙵
┃ 👤 @${nomAuteurMessage.split('@')[0]}
┗━━━━━━━━━━━━━━━━━━━━`,
                mentions: [nomAuteurMessage],
                contextInfo: {
                    externalAdReply: {
                        title: `❌ ${setting.name} 𝙾𝙵𝙵`,
                        body: setting.desc,
                        mediaType: 1,
                        previewType: 0,
                        thumbnailUrl: getRandomThumbnail(),
                        renderLargerThumbnail: false,
                    }
                }
            }, { quoted: fkontak });
        }
    });
});

// ============================================
// 📌 MASTER SETTINGS COMMAND (Menu ya settings zote)
// ============================================
silamd({
    nomCom: 'settings',
    alias: ['settings', 'allsettings', 'config'],
    reaction: '⚙️',
    categorie: 'Settings',
    desc: '𝚂𝚑𝚘𝚠 𝚊𝚕𝚕 𝚜𝚎𝚝𝚝𝚒𝚗𝚐𝚜'
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre, superUser, prefixe, nomAuteurMessage } = commandeOptions;

    if (!superUser) {
        return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚠𝚗𝚎𝚛 𝚘𝚗𝚕𝚢
┗━━━━━━━━━━━━━━━━━━━━`);
    }

    let settingsText = `┏━❑ 𝙰𝙻𝙻 𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂 ━━━━━━━━━\n`;
    
    settings.forEach(s => {
        const value = conf[s.var];
        const status = value === s.options[0] ? '✅' : '⚫';
        settingsText += `┃ ${status} ${s.name}: ${value}\n`;
    });
    
    settingsText += `┗━━━━━━━━━━━━━━━━━━━━\n> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`;

    const buttons = [
        { buttonId: `${prefixe}anticall`, buttonText: { displayText: "📞 𝙰𝙽𝚃𝙸𝙲𝙰𝙻𝙻" }, type: 1 },
        { buttonId: `${prefixe}chatbot`, buttonText: { displayText: "🤖 𝙲𝙷𝙰𝚃𝙱𝙾𝚃" }, type: 1 },
        { buttonId: `${prefixe}publicmode`, buttonText: { displayText: "🌐 𝙿𝚄𝙱𝙻𝙸𝙲" }, type: 1 },
        { buttonId: `${prefixe}privatemode`, buttonText: { displayText: "🔒 𝙿𝚁𝙸𝚅𝙰𝚃𝙴" }, type: 1 }
    ];

    const buttonMessage = {
        text: settingsText,
        footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 © 2026",
        buttons: buttons,
        headerType: 1,
        contextInfo: {
            externalAdReply: {
                title: `⚙️ 𝙱𝚘𝚝 𝚂𝚎𝚝𝚝𝚒𝚗𝚐𝚜`,
                body: `${settings.length} 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎`,
                mediaType: 1,
                previewType: 0,
                thumbnailUrl: getRandomThumbnail(),
                sourceUrl: 'https://github.com/',
                renderLargerThumbnail: false,
            }
        }
    };

    await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
});