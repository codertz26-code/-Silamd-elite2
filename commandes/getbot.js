const { silamd } = require("../silamd/sila");

silamd({ 
    nomCom: 'getbot',
    desc: 'Get bot links and information',
    Categorie: 'General',
    reaction: '🤖', 
    fromMe: 'true',
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;

    // Send initial message with buttons
    await zk.sendMessage(dest, {
        text: `╭─❏ *🤖 GET BOT LINKS* ❏─╮
│
│  *Choose an option below:*
│  👇 *Click buttons to get links*
│
╰────────────────────╯

📌 *Available Resources:*
• GitHub Repository
• WhatsApp Channel
• Support Group`,
        footer: "SILA TECH BOT",
        buttons: [
            { 
                buttonId: 'github_link', 
                buttonText: { displayText: '📦 GITHUB' }, 
                type: 1 
            },
            { 
                buttonId: 'channel_link', 
                buttonText: { displayText: '📢 CHANNEL' }, 
                type: 1 
            },
            { 
                buttonId: 'group_link', 
                buttonText: { displayText: '👥 GROUP' }, 
                type: 1 
            }
        ],
        headerType: 1
    }, { quoted: ms });
});

// Button handlers for getbot links
silamd({ 
    nomCom: 'github_link',
    desc: 'GitHub repository link',
    Categorie: 'General',
    fromMe: 'true',
    isButton: true
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;
    
    // Send reaction
    await zk.sendMessage(dest, { react: { text: '📦', key: ms.key } });
    
    const githubMsg = `╭─❏ *📦 GITHUB REPO* ❏─╮
│
│  *SILA-MD Bot*
│  🔗 *Link*: 
│  https://github.com/Sila-Md/SILA-MD
│
│  ⭐ *Features*:
│  • Advanced WhatsApp Bot
│  • Multi-device support
│  • Regular updates
│  • Easy to deploy
│
│  📌 *Don't forget to ⭐ star the repo!*
│
╰────────────────────╯`;

    await zk.sendMessage(dest, { text: githubMsg }, { quoted: ms });
});

silamd({ 
    nomCom: 'channel_link',
    desc: 'WhatsApp channel link',
    Categorie: 'General', 
    fromMe: 'true',
    isButton: true
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;
    
    // Send reaction
    await zk.sendMessage(dest, { react: { text: '📢', key: ms.key } });
    
    const channelMsg = `╭─❏ *📢 OFFICIAL CHANNEL* ❏─╮
│
│  *SILA-MD Updates*
│  🔗 *Link*: 
│  https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02
│
│  📢 *What you'll get:*
│  • Latest updates
│  • New features
│  • Announcements
│  • Tips & tricks
│
╰────────────────────╯`;

    await zk.sendMessage(dest, { text: channelMsg }, { quoted: ms });
});

silamd({ 
    nomCom: 'group_link',
    desc: 'Support group link',
    Categorie: 'General',
    fromMe: 'true', 
    isButton: true
},
async (dest, zk, commandeOptions) => {
    const { ms, repondre } = commandeOptions;
    
    // Send reaction
    await zk.sendMessage(dest, { react: { text: '👥', key: ms.key } });
    
    const groupMsg = `╭─❏ *👥 SUPPORT GROUP* ❏─╮
│
│  *SILA-MD Community*
│  🔗 *Link*: 
│  https://chat.whatsapp.com/IdGNaKt80DEBqirc2ek4ks
│
│  🤝 *Join to:*
│  • Get help
│  • Share ideas
│  • Meet other users
│  • Report issues
│
╰────────────────────╯`;

    await zk.sendMessage(dest, { text: groupMsg }, { quoted: ms });
});