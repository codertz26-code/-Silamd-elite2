const { sila } = require("../silamd/sila");
const moment = require("moment-timezone");
const os = require('os');

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

// Helper function to format runtime
function runtime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

sila({ 
    nomCom: 'alive2',
    alias: ['alive2', 'ping2', 'status2', 'runtime2', 'uptime2'],
    reaction: '🤖',
    desc: 'Show bot status with cards',
    Categorie: 'General',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, repondre, prefixe, nomAuteurMessage } = commandeOptions;

        // Get user name
        let userName = nomAuteurMessage || dest.split('@')[0];
        
        // Calculate ping
        const messageTimestamp = ms.messageTimestamp ? ms.messageTimestamp * 1000 : Date.now();
        const ping = Date.now() - messageTimestamp;

        // Uptime
        const uptime = runtime(process.uptime());

        // Memory
        const memory = process.memoryUsage();
        const memoryUsed = Math.round(memory.heapUsed / 1024 / 1024);

        // Create interactive carousel message
        const interactiveMessage = {
            body: {
                text: `┏━❑ 𝙰𝙻𝙸𝚅𝙴𝟸 𝙳𝙰𝚂𝙷𝙱𝙾𝙰𝚁𝙳 ━━━━━━━━━
┃ 👋 𝙷𝚎𝚕𝚕𝚘, *${userName}*!
┃ 
┃ 𝚂𝚠𝚒𝚙𝚎 𝚕𝚎𝚏𝚝/𝚛𝚒𝚐𝚑𝚝 𝚝𝚘 𝚟𝚒𝚎𝚠 𝚍𝚎𝚝𝚊𝚒𝚕𝚜
┗━━━━━━━━━━━━━━━━━━━━`
            },
            footer: {
                text: "◀️ 𝚂𝚕𝚒𝚍𝚎 𝚏𝚘𝚛 𝚖𝚘𝚛𝚎 𝚒𝚗𝚏𝚘 ▶️"
            },
            header: {
                title: "🤖 𝚂𝙸𝙻𝙰-𝙼𝙳",
                hasMediaAttachment: false
            },
            carouselMessage: {
                cards: [
                    // Card 1: PING
                    {
                        body: {
                            text: `┏━❑ 🏓 𝙿𝙸𝙽𝙶 ━━━━━━━━━
┃ 📶 *𝚁𝚎𝚜𝚙𝚘𝚗𝚜𝚎:* ${ping}ms
┃ 
┃ 🤖 𝙱𝚘𝚝 𝚒𝚜 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚒𝚟𝚎
┗━━━━━━━━━━━━━━━━━━━━`
                        },
                        footer: {
                            text: "© 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳"
                        },
                        header: {
                            title: "🏓 𝙿𝙸𝙽𝙶",
                            hasMediaAttachment: false
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "🔄 𝚁𝙴𝙵𝚁𝙴𝚂𝙷",
                                    id: `${prefixe}alive2`
                                })
                            }]
                        }
                    },
                    // Card 2: ALIVE
                    {
                        body: {
                            text: `┏━❑ 🤖 𝙰𝙻𝙸𝚅𝙴 ━━━━━━━━━
┃ ✨ *𝙱𝚘𝚝:* 𝚂𝙸𝙻𝙰-𝙼𝙳
┃ 👑 *𝙾𝚠𝚗𝚎𝚛:* 𝚂𝙸𝙻𝙰
┃ 📦 *𝚅𝚎𝚛:* 𝟸.𝟶.𝟶
┃ 
┃ ✅ 𝙸'𝚖 𝚊𝚕𝚒𝚟𝚎 𝚊𝚗𝚍 𝚛𝚎𝚊𝚍𝚢!
┗━━━━━━━━━━━━━━━━━━━━`
                        },
                        footer: {
                            text: "© 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳"
                        },
                        header: {
                            title: "🤖 𝙰𝙻𝙸𝚅𝙴",
                            hasMediaAttachment: false
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "🔄 𝚁𝙴𝙵𝚁𝙴𝚂𝙷",
                                    id: `${prefixe}alive2`
                                })
                            }]
                        }
                    },
                    // Card 3: RUNTIME
                    {
                        body: {
                            text: `┏━❑ ⏱️ 𝚁𝚄𝙽𝚃𝙸𝙼𝙴 ━━━━━━━━━
┃ 🕐 *𝚄𝚙𝚝𝚒𝚖𝚎:* ${uptime}
┃ 💾 *𝙼𝚎𝚖𝚘𝚛𝚢:* ${memoryUsed}𝙼𝙱
┃ 
┃ 𝙱𝚘𝚝 𝚑𝚊𝚜 𝚋𝚎𝚎𝚗 𝚛𝚞𝚗𝚗𝚒𝚗𝚐 𝚏𝚘𝚛 ${uptime}
┗━━━━━━━━━━━━━━━━━━━━`
                        },
                        footer: {
                            text: "© 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳"
                        },
                        header: {
                            title: "⏱️ 𝚁𝚄𝙽𝚃𝙸𝙼𝙴",
                            hasMediaAttachment: false
                        },
                        nativeFlowMessage: {
                            buttons: [{
                                name: "quick_reply",
                                buttonParamsJson: JSON.stringify({
                                    display_text: "🔄 𝚁𝙴𝙵𝚁𝙴𝚂𝙷",
                                    id: `${prefixe}alive2`
                                })
                            }]
                        }
                    }
                ]
            }
        };

        // Send interactive carousel message
        await zk.sendMessage(dest, {
            interactiveMessage: interactiveMessage
        }, { quoted: fkontak });

        // Send reaction
        await zk.sendMessage(dest, {
            react: { text: "✅", key: ms.key }
        });

    } catch (e) {
        console.log("❌ Alive2 Error: " + e);
        
        // Fallback plain text
        const uptime = runtime(process.uptime());
        const ping = Date.now() - (ms.messageTimestamp * 1000);
        
        await repondre(`┏━❑ 𝙰𝙻𝙸𝚅𝙴𝟸 ━━━━━━━━━
┃ 🏓 𝙿𝚒𝚗𝚐: ${ping}ms
┃ ⏱️ 𝚁𝚞𝚗𝚝𝚒𝚖𝚎: ${uptime}
┃ 🤖 𝙱𝚘𝚝: 𝚂𝙸𝙻𝙰-𝙼𝙳
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);

        await zk.sendMessage(dest, {
            react: { text: "❌", key: ms.key }
        });
    }
});