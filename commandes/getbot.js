const { sila } = require("../silamd/sila");
const axios = require('axios');

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

const thumbImage = "https://files.catbox.moe/98k75b.jpeg";

sila({ 
    nomCom: 'getbot',
    alias: ['getbot', 'pair', 'pairing', 'getpair', 'paircode', 'code', 'gencode', 'generate', 'session', 'getsession', 'bot'],
    reaction: '🤖',
    desc: 'Get bot pairing code',
    Categorie: 'General',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, arg, repondre, prefixe, nomAuteurMessage } = commandeOptions;
        
        // Get sender number
        const senderNumber = nomAuteurMessage.split('@')[0];
        let targetNumber = senderNumber;
        
        // If user provided a number, use that instead
        if (arg[0]) {
            targetNumber = arg.join("").replace(/\D/g, '');
            if (targetNumber.length < 10) {
                return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚗𝚞𝚖𝚋𝚎𝚛
┃ 📱 𝚄𝚜𝚎: ${prefixe}getbot 255XXXXXXXXX
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
            }
        }

        // Send reaction
        await zk.sendMessage(dest, {
            react: { text: "🔄", key: ms.key }
        });

        // Send processing message (SILENT - no reply)
        await zk.sendMessage(dest, {
            text: `┏━❑ 𝙶𝙴𝙽𝙴𝚁𝙰𝚃𝙸𝙽𝙶 ━━━━━━━━━
┃ 🤖 𝙶𝚎𝚝𝚝𝚒𝚗𝚐 𝚢𝚘𝚞𝚛 𝚙𝚊𝚒𝚛𝚒𝚗𝚐 𝚌𝚘𝚍𝚎...
┃ 📱 𝙽𝚞𝚖𝚋𝚎𝚛: ${targetNumber}
┗━━━━━━━━━━━━━━━━━━━━`,
            contextInfo: {
                externalAdReply: {
                    title: `🤖 𝙿𝚊𝚒𝚛𝚒𝚗𝚐 𝙲𝚘𝚍𝚎`,
                    body: `📱 ${targetNumber}`,
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: thumbImage,
                    renderLargerThumbnail: false,
                }
            }
        }, { quoted: fkontak });

        // Call pairing API
        try {
            const apiUrl = `https://simba2.onrender.com/code?number=${targetNumber}`;
            const response = await axios.get(apiUrl, { timeout: 30000 });

            if (!response.data || !response.data.code) {
                throw new Error('No pairing code received');
            }

            const pairCode = response.data.code;

            // BUTTON YA KOPI CODE
            const interactiveButtons = [
                {
                    name: 'cta_copy',
                    buttonParamsJson: JSON.stringify({
                        display_text: '📋 𝙲𝙾𝙿𝚈 𝙲𝙾𝙳𝙴',
                        copy_code: pairCode
                    })
                }
            ];

            // Send code with copy button (NO INSTRUCTIONS)
            await zk.sendMessage(dest, {
                text: `┏━❑ 𝙿𝙰𝙸𝚁𝙸𝙽𝙶 𝙲𝙾𝙳𝙴 ━━━━━━━━━
┃ ✅ *𝙲𝚘𝚍𝚎 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚎𝚍*
┃ 
┃ 📋 *${pairCode}*
┗━━━━━━━━━━━━━━━━━━━━`,
                footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝙾𝚃 © 2026",
                interactiveButtons: interactiveButtons,
                headerType: 1,
                contextInfo: {
                    externalAdReply: {
                        title: `📋 𝙲𝚕𝚒𝚌𝚔 𝚝𝚘 𝙲𝚘𝚙𝚢`,
                        body: pairCode,
                        mediaType: 1,
                        previewType: 0,
                        thumbnailUrl: thumbImage,
                        renderLargerThumbnail: false,
                    }
                }
            }, { quoted: fkontak });

            // Also send as plain text for manual copying
            await zk.sendMessage(dest, {
                text: `📋 ${pairCode}`,
                contextInfo: {
                    externalAdReply: {
                        title: `📋 𝙲𝚘𝚍𝚎`,
                        body: pairCode,
                        mediaType: 1,
                        previewType: 0,
                        thumbnailUrl: thumbImage,
                        renderLargerThumbnail: false,
                    }
                }
            }, { quoted: fkontak });

            // Success reaction
            await zk.sendMessage(dest, {
                react: { text: "✅", key: ms.key }
            });

        } catch (apiError) {
            console.error("Pairing API Error:", apiError.message);
            
            await zk.sendMessage(dest, {
                text: `┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚐𝚎𝚝 𝚌𝚘𝚍𝚎
┃ 📋 ${apiError.message}
┗━━━━━━━━━━━━━━━━━━━━`,
                contextInfo: {
                    externalAdReply: {
                        title: `❌ 𝙴𝚛𝚛𝚘𝚛`,
                        body: apiError.message,
                        mediaType: 1,
                        previewType: 0,
                        thumbnailUrl: thumbImage,
                        renderLargerThumbnail: false,
                    }
                }
            }, { quoted: fkontak });

            await zk.sendMessage(dest, {
                react: { text: "❌", key: ms.key }
            });
        }

    } catch (e) {
        console.log("❌ Getbot Error: " + e);
        await zk.sendMessage(dest, {
            react: { text: "❌", key: ms.key }
        });
        await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }
});