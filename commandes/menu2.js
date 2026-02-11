const { silamd } = require("../silamd/sila");

const menuImage = "https://files.catbox.moe/36vahk.png"; // Replace with your menu image URL

sila({
    nomCom: 'menu',
    reaction: '📋',
    desc: 'Show bot menu with buttons',
    Categorie: 'General',
    fromMe: 'true'
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre } = commandeOptions;
    
    const buttons = [
        { buttonId: "id1", buttonText: { displayText: "🎵 Song" }, type: 1 },
        { buttonId: "id2", buttonText: { displayText: "⏰ Alive" }, type: 1 },
        { buttonId: "id3", buttonText: { displayText: "📱 Owner" }, type: 1 },
        { buttonId: "id4", buttonText: { displayText: "📦 Repo" }, type: 1 },
        { buttonId: "id5", buttonText: { displayText: "📡 Ping" }, type: 1 },
        { buttonId: "id6", buttonText: { displayText: "ℹ️ Help" }, type: 1 }
    ];

    const buttonMessage = {
        image: { url: menuImage },
        caption: `╔════════════════════════════╗
║   🤖 𝐒𝐈𝐋𝐀-𝐌𝐃 𝐌𝐄𝐍𝐔 ║
╚════════════════════════════╝

👋 Welcome to SILA-MD Bot

Choose an option below:

🎵 Song - Download music from YouTube
⏰ Alive - Check bot status
📱 Owner - Contact the owner
📦 Repo - Get bot repository
📡 Ping - Check response time
ℹ️ Help - Get command help

> © Powered by Sila Tech`,
        footer: "SILA-MD Bot © 2026",
        buttons: buttons,
        headerType: 4
    };

    await zk.sendMessage(dest, buttonMessage);

} catch (e) {
    console.log("❌ Menu2 Command Error: " + e);
    repondre("❌ Error: " + e);
}
});
