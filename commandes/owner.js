const { silamd } = require("../silamd/sila");

const ownerImage = "https://files.catbox.moe/krnlo3.jpeg"; // Replace with owner image URL
const ownerNumber = "255789661031";

sila({
    nomCom: 'owner',
    alias: ['creator', 'admin'],
    reaction: '👨‍💼',
    desc: 'Contact bot owner',
    Categorie: 'General',
    fromMe: 'true'
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre } = commandeOptions;
    
    const buttons = [
        { 
            buttonId: "id_chat", 
            buttonText: { displayText: "💬 Chat with Owner" }, 
            type: 1 
        },
        { 
            buttonId: "id_call", 
            buttonText: { displayText: "📞 Call Owner" }, 
            type: 1 
        },
        { 
            buttonId: "id_close", 
            buttonText: { displayText: "❌ Close" }, 
            type: 1 
        }
    ];

    const buttonMessage = {
        image: { url: ownerImage },
        caption: `╔════════════════════════════╗
║   👨‍💼 𝐁𝐎𝐓 𝐎𝐖𝐍𝐄𝐑   ║
╚════════════════════════════╝

🎯 **Bot Owner Information:**

📱 Phone: +${ownerNumber}
💬 WhatsApp: wa.me/${ownerNumber}

👤 Name: Sila Tech
🏢 Organization: SILA-MD

✨ For questions, suggestions, or support, contact the owner directly.

> © Powered by Sila Tech`,
        footer: "SILA-MD Bot © 2026",
        buttons: buttons,
        headerType: 4
    };

    await zk.sendMessage(dest, buttonMessage);

} catch (e) {
    console.log("❌ Owner Command Error: " + e);
    repondre("❌ Error: " + e);
}
});
