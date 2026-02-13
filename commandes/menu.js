const { silamd } = require("../silamd/sila");
const fs = require('fs');
const path = require('path');
const moment = require("moment-timezone");

const menuImage = "https://files.catbox.moe/36vahk.png";
const CHANNEL_LINK = "https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02";

// Define fakevCard iliyorahisishwa - without vcard na contactmessage
const fakevCard = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    // empty message - just for quoting
  }
};

// Get all commands from folder automatically
const getCommands = () => {
    try {
        const commandsDir = path.join(__dirname);
        const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));

        const commandList = [];
        files.forEach(file => {
            const name = file.replace('.js', '');
            // Exclude menu2 and other special files if needed
            if (name !== 'menu2' && name !== 'menu') {
                commandList.push(name);
            }
        });

        return commandList;
    } catch (e) {
        console.log("Error reading commands:", e);
        return [];
    }
};

// Group commands by category (optional - if you want categories)
const getCommandsByCategory = () => {
    try {
        const commandsDir = path.join(__dirname);
        const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));
        
        const categories = {};
        
        files.forEach(file => {
            const name = file.replace('.js', '');
            if (name === 'menu2' || name === 'menu') return;
            
            // Try to get category from command file
            let category = 'General';
            try {
                const commandPath = path.join(commandsDir, file);
                const commandContent = fs.readFileSync(commandPath, 'utf8');
                const categoryMatch = commandContent.match(/Categorie:\s*['"]([^'"]+)['"]/);
                if (categoryMatch && categoryMatch[1]) {
                    category = categoryMatch[1];
                }
            } catch (e) {
                // Ignore errors
            }
            
            if (!categories[category]) {
                categories[category] = [];
            }
            categories[category].push(name);
        });
        
        return categories;
    } catch (e) {
        console.log("Error reading commands by category:", e);
        return {};
    }
};

sila({
    nomCom: 'menu',
    reaction: '📋',
    desc: 'Show bot menu with all commands',
    Categorie: 'General',
    fromMe: 'true'
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre, prefixe, nomAuteurMessage } = commandeOptions;

    // Get all commands
    const allCommands = getCommands();
    const categories = getCommandsByCategory();
    const categoryNames = Object.keys(categories);

    // Create buttons (tatu: Get Bot, Owner, na Channel)
    const commandButtons = [
        { buttonId: `${prefixe}getbot`, buttonText: { displayText: "🤖 Get Bot" }, type: 1 },
        { buttonId: `${prefixe}owner`, buttonText: { displayText: "👨‍💼 Owner" }, type: 1 },
        { buttonId: CHANNEL_LINK, buttonText: { displayText: "📢 Channel" }, type: 1 }
    ];

    // Generate commands list with nice formatting
    let commandsText = '';
    
    if (categoryNames.length > 1) {
        // Show by categories
        for (const category of categoryNames.sort()) {
            commandsText += `┏━❑ *${category.toUpperCase()}* ━━━━━━━━━\n`;
            categories[category].sort().forEach((cmd, index) => {
                commandsText += `┃ ${index + 1}. ${prefixe}${cmd}\n`;
            });
            commandsText += `┗━━━━━━━━━━━━━━━━━━━━\n\n`;
        }
    } else {
        // Simple list if no categories
        commandsText += `┏━❑ 𝐀𝐋𝐋 𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐒 ━━━━━━━━━\n`;
        allCommands.sort().forEach((cmd, index) => {
            commandsText += `┃ ${index + 1}. ${prefixe}${cmd}\n`;
        });
        commandsText += `┗━━━━━━━━━━━━━━━━━━━━\n`;
    }

    const buttonMessage = {
        image: { url: menuImage },
        caption: `┏━❑ 𝐒𝐈𝐋𝐀-𝐌𝐃 𝐌𝐄𝐍𝐔 ━━━━━━━━━
┃ 🤖 *Bot Name:* 𝐒𝐈𝐋𝐀-𝐌𝐃
┃ ⏰ *Time:* ${moment().tz("Africa/Nairobi").format("DD/MM/YYYY HH:mm")}
┃ 📊 *Total Cmds:* ${allCommands.length}
┃ 👤 *User:* @${dest.split('@')[0]}
┗━━━━━━━━━━━━━━━━━━━━

${commandsText}

━━━━━━━━━━━━━━━━━━━━
> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐒𝐢𝐥𝐚 𝐓𝐞𝐜𝐡`,
        footer: "𝐒𝐈𝐋𝐀-𝐌𝐃 𝐁𝐎𝐓 © 2026",
        buttons: commandButtons,
        headerType: 4,
        contextInfo: {
            mentionedJid: [dest],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363402325089913@newsletter',
                newsletterName: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
                serverMessageId: 143,
            }
        }
    };

    // Send menu
    await zk.sendMessage(dest, buttonMessage, { quoted: fakevCard });

} catch (e) {
    console.log("❌ Menu Command Error: " + e);
    repondre(`┏━❑ 𝐄𝐑𝐑𝐎𝐑 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐒𝐢𝐥𝐚 𝐓𝐞𝐜𝐡`);
}
});