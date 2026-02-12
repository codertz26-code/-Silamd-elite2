const { silamd } = require("../silamd/sila");
const moment = require("moment-timezone");
const { getBuffer } = require("../silamd/dl/Function");
const { default: axios } = require('axios');
const fs = require('fs');
const path = require('path');

// ============= IMAGES FOR MENU =============
const menuImages = [
    "https://files.catbox.moe/krnlo3.jpeg",
    "https://files.catbox.moe/36vahk.png",
    "https://files.catbox.moe/j7kue0.jpeg",
    "https://files.catbox.moe/edcfwx.jpeg",
    "https://files.catbox.moe/98k75b.jpeg",
    "https://files.catbox.moe/7ydtb3.mp3" // Audio thumbnail
];

// ============= STYLISH FONTS =============
const fonts = {
    // Bold
    bold: (text) => text.split('').map(c => {
        if (c.match(/[A-Z]/)) return String.fromCodePoint(c.charCodeAt(0) + 120211);
        if (c.match(/[a-z]/)) return String.fromCodePoint(c.charCodeAt(0) + 120205);
        return c;
    }).join(''),
    
    // Script
    script: (text) => text.split('').map(c => {
        if (c.match(/[A-Z]/)) return String.fromCodePoint(c.charCodeAt(0) + 119951);
        if (c.match(/[a-z]/)) return String.fromCodePoint(c.charCodeAt(0) + 119945);
        return c;
    }).join(''),
    
    // Double-struck
    double: (text) => text.split('').map(c => {
        if (c.match(/[A-Z]/)) return String.fromCodePoint(c.charCodeAt(0) + 120159);
        if (c.match(/[a-z]/)) return String.fromCodePoint(c.charCodeAt(0) + 120153);
        return c;
    }).join(''),
    
    // Monospace
    mono: (text) => text.split('').map(c => {
        if (c.match(/[A-Z]/)) return String.fromCodePoint(c.charCodeAt(0) + 120367);
        if (c.match(/[a-z]/)) return String.fromCodePoint(c.charCodeAt(0) + 120361);
        return c;
    }).join(''),
    
    // Fraktur
    fraktur: (text) => text.split('').map(c => {
        if (c.match(/[A-Z]/)) return String.fromCodePoint(c.charCodeAt(0) + 120067);
        if (c.match(/[a-z]/)) return String.fromCodePoint(c.charCodeAt(0) + 120061);
        return c;
    }).join(''),
    
    // Sans-serif bold
    sansBold: (text) => text.split('').map(c => {
        if (c.match(/[A-Z]/)) return String.fromCodePoint(c.charCodeAt(0) + 120227);
        if (c.match(/[a-z]/)) return String.fromCodePoint(c.charCodeAt(0) + 120221);
        return c;
    }).join('')
};

// ============= RUNTIME FUNCTION =============
const runtime = function (seconds) { 
    seconds = Number(seconds); 
    var d = Math.floor(seconds / (3600 * 24)); 
    var h = Math.floor((seconds % (3600 * 24)) / 3600); 
    var m = Math.floor((seconds % 3600) / 60); 
    var s = Math.floor(seconds % 60); 
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " d, ") : ""; 
    var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " h, ") : ""; 
    var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " m, ") : ""; 
    var sDisplay = s > 0 ? s + (s == 1 ? " second" : " s") : ""; 
    return dDisplay + hDisplay + mDisplay + sDisplay; 
};

// ============= SCAN COMMANDS FOLDER =============
function scanCommands() {
    const commandsPath = path.join(__dirname, '../commandes');
    const categories = {};
    
    // Emoji mapping for categories
    const categoryEmojis = {
        'General': '📁',
        'Owner': '👑',
        'Downloader': '📥',
        'Group': '👥',
        'Fun': '🎮',
        'Educative': '📚',
        'Search': '🔍',
        'Game': '🎯',
        'Economy': '💰',
        'Tools': '🔧',
        'Stalker': '🕵️',
        'AI': '🤖',
        'Convert': '🔄',
        'PhotoOxy': '🖼️',
        'Wallpaper': '🖼️',
        'Islamic': '🕌',
        '18+': '🔞',
        'System': '⚙️',
        'default': '📌'
    };
    
    try {
        if (fs.existsSync(commandsPath)) {
            const files = fs.readdirSync(commandsPath);
            
            files.forEach(file => {
                if (file.endsWith('.js') && !file.includes('menu')) {
                    const filePath = path.join(commandsPath, file);
                    try {
                        const content = fs.readFileSync(filePath, 'utf8');
                        
                        // Extract command name
                        const nomComMatch = content.match(/nomCom:\s*['"`]([^'"`]+)['"`]/);
                        const commandName = nomComMatch ? nomComMatch[1] : file.replace('.js', '');
                        
                        // Extract category
                        const categoryMatch = content.match(/Categorie:\s*['"`]([^'"`]+)['"`]/);
                        let category = categoryMatch ? categoryMatch[1] : 'Uncategorized';
                        
                        // Extract description
                        const descMatch = content.match(/desc:\s*['"`]([^'"`]+)['"`]/);
                        const description = descMatch ? descMatch[1] : 'No description';
                        
                        // Skip commands with dontAddCommandList
                        if (content.includes('dontAddCommandList:') && 
                            content.includes('true')) {
                            return;
                        }
                        
                        // Initialize category if not exists
                        if (!categories[category]) {
                            categories[category] = [];
                        }
                        
                        categories[category].push({
                            name: commandName,
                            desc: description,
                            file: file
                        });
                        
                    } catch (err) {
                        console.log(`Error reading ${file}:`, err.message);
                    }
                }
            });
            
            // Sort commands alphabetically in each category
            for (let cat in categories) {
                categories[cat].sort((a, b) => a.name.localeCompare(b.name));
            }
            
        } else {
            console.log('Commandes folder not found!');
        }
    } catch (err) {
        console.log('Error scanning commands:', err);
    }
    
    return { categories, categoryEmojis };
}

// ============= GENERATE MENU TEXT =============
function generateMenuText(categories, categoryEmojis) {
    const time = moment.tz('Africa/Dar_es_Salaam').format('HH:mm:ss');
    const date = moment.tz('Africa/Dar_es_Salaam').format('DD/MM/YYYY');
    const totalCommands = Object.values(categories).reduce((acc, cmds) => acc + cmds.length, 0);
    
    let menuText = `╭━━━〔 *✦ 𝐒𝐈𝐋𝐀-𝐌𝐃 ✦* 〕━━━┈⊷
┃
┃ *${fonts.sansBold('🤖 BOT INFORMATION')}*
┃ ╭───────────────⟢
┃ │ •⏰ *Time* : ${fonts.mono(time)}
┃ │ •📅 *Date* : ${fonts.mono(date)}
┃ │ •⚡ *Runtime* : ${fonts.mono(runtime(process.uptime()))}
┃ │ •📊 *Commands* : ${fonts.double(totalCommands.toString())}
┃ │ •🔰 *Prefix* : [ ${fonts.bold('sila')} ]
┃ ╰───────────────⟢
┃
┃ *${fonts.script('📋 COMMANDS MENU')}*
┃\n`;

    // Sort categories
    const sortedCategories = Object.keys(categories).sort();
    
    // Build menu by category
    sortedCategories.forEach((category, index) => {
        const cmds = categories[category];
        const emoji = categoryEmojis[category] || '📌';
        
        // Category header with stylish design
        menuText += `┃ ${emoji} *${fonts.bold(category)}* 〘 ${cmds.length} 〙\n`;
        menuText += `┃ ╭─────────────────⟢\n`;
        
        // Commands in this category with stylish formatting
        cmds.forEach((cmd, i) => {
            const prefix = i === cmds.length - 1 ? '┃ │ └─' : '┃ │ ├─';
            menuText += `┃ │ ${prefix} *${fonts.mono(cmd.name)}* ─ ${cmd.desc}\n`;
        });
        
        menuText += `┃ ╰─────────────────⟢\n`;
        if (index < sortedCategories.length - 1) menuText += `┃\n`;
    });
    
    // Footer
    menuText += `┃
┃ *${fonts.fraktur('✨ THANK YOU FOR USING SILA-MD')}*
┃
╰━━━━━━━━━━━━━━━━━━┈⊷
> © 2024-2025 𝐒𝐈𝐋𝐀-𝐌𝐃
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴊᴏʜɴ ᴅᴇᴠᴇʟᴏᴘᴇʀ*`;
    
    return menuText;
}

// ============= MAIN MENU COMMAND =============
sila({ 
    nomCom: 'menu2',
    desc: 'Display full bot menu with all commands',
    Categorie: 'General',
    reaction: '📋', 
    fromMe: 'true',
},
async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;
    
    try {
        // Scan all commands
        const { categories, categoryEmojis } = scanCommands();
        
        // Generate menu text
        const menuText = generateMenuText(categories, categoryEmojis);
        
        // Select random image
        const randomMenuImage = menuImages[Math.floor(Math.random() * menuImages.length)];
        
        // Create buttons
        const buttons = [
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "👑 OWNER",
                    id: "owner"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "📊 PING",
                    id: "ping"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "✨ ALIVE",
                    id: "alive"
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "🔄 REFRESH",
                    id: "refresh_menu"
                })
            }
        ];

        // Send menu with image
        await zk.sendMessage(dest, {
            image: { url: randomMenuImage },
            caption: menuText,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402325089913@newsletter',
                    newsletterName: "➤®𝐒𝐈𝐋𝐀-𝐌𝐃",
                    serverMessageId: 143,
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: `📋 SILA-MD MENU • ${categories ? Object.values(categories).reduce((a, b) => a + b.length, 0) : 0} CMD`,
                    body: `Runtime: ${runtime(process.uptime())}`,
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: randomMenuImage,
                    renderLargerThumbnail: true,
                    sourceUrl: 'https://github.com/yourrepo/sila-md'
                },
            },
            buttons: buttons,
            viewOnce: false,
            headerType: 4
        }, {
            quoted: {
                key: {
                    fromMe: false,
                    participant: `0@s.whatsapp.net`,
                    remoteJid: "status@broadcast"
                },
                message: {
                    contactMessage: {
                        displayName: "𝐒𝐈𝐋𝐀-𝐌𝐃",
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:𝐒𝐈𝐋𝐀-𝐌𝐃;BOT;;;\nFN:𝐒𝐈𝐋𝐀-𝐌𝐃\nitem1.TEL;waid=255789661031:+255789661031\nitem1.X-ABLabel:Bot\nEND:VCARD`
                    }
                }
            }
        });

    } catch (e) {
        console.log("❌ menu2 Command Error: " + e);
        repondre("❌ Error: " + e);
    }
});

// ============= SIMPLE MENU VERSION (TEXT ONLY) =============
sila({ 
    nomCom: 'menu',
    desc: 'Display simple menu',
    Categorie: 'General',
    reaction: '📋', 
    fromMe: 'true',
},
async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;
    
    try {
        const { categories } = scanCommands();
        const time = moment.tz('Africa/Dar_es_Salaam').format('HH:mm:ss');
        const totalCmds = Object.values(categories).reduce((a, b) => a + b.length, 0);
        
        let simpleMenu = `╭═══『 *𝐒𝐈𝐋𝐀-𝐌𝐃* 』═══╮
┃
┃ ⏰ Time: ${time}
┃ ⚡ CMD: ${totalCmds}
┃
`;
        
        Object.keys(categories).sort().forEach(cat => {
            simpleMenu += `┃ 📁 ${cat} (${categories[cat].length})\n`;
        });
        
        simpleMenu += `┃
╰════════════════╯
> Use *menu2* for full menu`;
        
        await repondre(simpleMenu);
        
    } catch (e) {
        repondre("❌ Error: " + e);
    }
});

// ============= BUTTON RESPONSE HANDLER =============
sila({ 
    nomCom: 'menu_button_handler',
    desc: 'Handle menu button responses',
    Categorie: 'System',
    fromMe: 'true',
    dontAddCommandList: true
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;
    
    try {
        if (ms.message?.buttonsResponseMessage) {
            const buttonId = ms.message.buttonsResponseMessage.selectedButtonId;
            
            // React to button
            await zk.sendMessage(dest, {
                react: {
                    text: "⚡",
                    key: ms.key
                }
            });
            
            switch(buttonId) {
                case "owner":
                    await zk.sendMessage(dest, {
                        text: `👑 *OWNER INFORMATION*\n\n*Name*: 𝐒𝐈𝐋𝐀\n*Number*: wa.me/255789661031\n*Role*: Developer & Creator\n*Version*: 2.0.0\n\n> Thank you for using SILA-MD`,
                        contextInfo: {
                            externalAdReply: {
                                title: `👑 Bot Owner`,
                                body: 'Contact for support',
                                thumbnailUrl: menuImages[0],
                                mediaType: 1
                            }
                        }
                    }, { quoted: ms });
                    break;
                    
                case "ping":
                    const start = Date.now();
                    await zk.sendMessage(dest, { 
                        text: `📊 *PING TEST*\n\n*Response*: ${Date.now() - start}ms\n*Status*: Online ✅\n*Runtime*: ${runtime(process.uptime())}`,
                        contextInfo: {
                            externalAdReply: {
                                title: `📊 ${Date.now() - start}ms`,
                                body: 'Pong! 🏓',
                                thumbnailUrl: menuImages[1],
                                mediaType: 1
                            }
                        }
                    }, { quoted: ms });
                    break;
                    
                case "alive":
                    await zk.sendMessage(dest, { 
                        audio: { url: "https://files.catbox.moe/7ydtb3.mp3" }, 
                        mimetype: 'audio/mp4', 
                        ptt: true,
                        contextInfo: {
                            externalAdReply: {
                                title: `✨ I'M ALIVE!`,
                                body: runtime(process.uptime()),
                                thumbnailUrl: menuImages[2],
                                mediaType: 1
                            }
                        }
                    }, { quoted: ms });
                    break;
                    
                case "refresh_menu":
                    // Rescan and resend menu
                    const { categories, categoryEmojis } = scanCommands();
                    const freshMenu = generateMenuText(categories, categoryEmojis);
                    const freshImage = menuImages[Math.floor(Math.random() * menuImages.length)];
                    
                    await zk.sendMessage(dest, {
                        image: { url: freshImage },
                        caption: freshMenu,
                        contextInfo: {
                            externalAdReply: {
                                title: `📋 Menu Refreshed!`,
                                thumbnailUrl: freshImage
                            }
                        }
                    }, { quoted: ms });
                    break;
            }
        }
    } catch (e) {
        console.log("❌ Button Handler Error: " + e);
    }
});
