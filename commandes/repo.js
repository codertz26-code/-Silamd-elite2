const { silamd } = require("../silamd/sila");

const repoUrl = "https://github.com/Sila-Md/SILA-MD";
const repoImage = "https://files.catbox.moe/j7kue0.jpeg"; // Replace with repo image URL

sila({
    nomCom: 'repo',
    alias: ['github', 'repository'],
    reaction: '📦',
    desc: 'Get bot repository link',
    Categorie: 'General',
    fromMe: 'true'
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre } = commandeOptions;
    
    const buttons = [
        { 
            buttonId: "id_copy", 
            buttonText: { displayText: "📋 Copy URL" }, 
            type: 1 
        },
        { 
            buttonId: "id_visit", 
            buttonText: { displayText: "🌐 Visit Repo" }, 
            type: 1 
        },
        { 
            buttonId: "id_fork", 
            buttonText: { displayText: "⭐ Star Repo" }, 
            type: 1 
        }
    ];

    const buttonMessage = {
        image: { url: repoImage },
        caption: `╔════════════════════════════╗
║   📦 𝐆𝐈𝐓𝐇𝐔𝐁 𝐑𝐄𝐏𝐎   ║
╚════════════════════════════╝

🚀 **SILA-MD Bot Repository**

📍 GitHub: Sila-Md/SILA-MD
🔗 URL: ${repoUrl}

✨ **Features:**
✅ WhatsApp Bot
✅ Advanced Commands
✅ Open Source
✅ Easy to Setup

📥 Installation:
Clone the repository and follow the README instructions.

👨‍💻 Contribute to the project!
⭐ Don't forget to star the repo!

> © Powered by Sila Tech`,
        footer: "SILA-MD Bot © 2026",
        buttons: buttons,
        headerType: 4
    };

    await zk.sendMessage(dest, buttonMessage);

} catch (e) {
    console.log("❌ Repo Command Error: " + e);
    repondre("❌ Error: " + e);
}
});
