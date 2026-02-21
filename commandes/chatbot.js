const { silamd } = require("../silamd/sila");
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

// Thumbnail
const GETBOT_THUMB = "https://files.catbox.moe/98k75b.jpeg";

// Pairing API
const PAIRING_API = "https://sila-freeeebot.onrender.com";

silamd({
    nomCom: 'getbot',
    alias: ['getbot', 'pair', 'pairing', 'getpair', 'paircode', 'code', 'gencode', 'generate', 'session'],
    reaction: '🤖',
    desc: 'Get bot pairing code',
    Categorie: 'General',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, arg, repondre, prefixe, nomAuteurMessage } = commandeOptions;
        const phoneNumber = arg.join("").replace(/\D/g, '');

        // If no phone number, show button to start pairing
        if (!phoneNumber) {
            const interactiveButtons = [
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '🔗 𝙶𝙴𝚃 𝙿𝙰𝙸𝚁𝙸𝙽𝙶 𝙲𝙾𝙳𝙴',
                        url: PAIRING_API
                    })
                }
            ];

            const buttonMessage = {
                text: `┏━❑ 𝙶𝙴𝚃 𝙱𝙾𝚃 ━━━━━━━━━
┃ 🤖 *𝙲𝚕𝚒𝚌𝚔 𝚋𝚎𝚕𝚘𝚠 𝚝𝚘 𝚐𝚎𝚝 𝚢𝚘𝚞𝚛 𝚙𝚊𝚒𝚛𝚒𝚗𝚐 𝚌𝚘𝚍𝚎*
┃ 
┃ 📱 *𝙾𝚛 𝚞𝚜𝚎:* ${prefixe}getbot 255XXXXXXXXX
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
                footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝙾𝚃 © 2026",
                interactiveButtons: interactiveButtons,
                headerType: 1,
                contextInfo: {
                    mentionedJid: [dest],
                    externalAdReply: {
                        title: `🤖 𝙶𝚎𝚝 𝙱𝚘𝚝 𝙿𝚊𝚒𝚛𝚒𝚗𝚐`,
                        body: `🔗 𝙲𝚕𝚒𝚌𝚔 𝚝𝚘 𝚙𝚊𝚒𝚛`,
                        mediaType: 1,
                        previewType: 0,
                        thumbnailUrl: GETBOT_THUMB,
                        sourceUrl: PAIRING_API,
                        renderLargerThumbnail: false,
                    }
                }
            };

            return await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });
        }

        // Send reaction
        await zk.sendMessage(dest, {
            react: { text: "🔄", key: ms.key }
        });

        // Call pairing API
        try {
            const response = await axios.get(`${PAIRING_API}/pair?code=${phoneNumber}`, { timeout: 30000 });
            const data = response.data;

            if (data?.code) {
                const pairCode = data.code;

                // Interactive button with copy code
                const interactiveButtons = [
                    {
                        name: 'cta_copy',
                        buttonParamsJson: JSON.stringify({
                            display_text: '📋 𝙲𝙾𝙿𝚈 𝙲𝙾𝙳𝙴',
                            copy_code: pairCode
                        })
                    },
                    {
                        name: 'cta_url',
                        buttonParamsJson: JSON.stringify({
                            display_text: '🔗 𝙶𝙾 𝚃𝙾 𝙿𝙰𝙸𝚁 𝙿𝙰𝙶𝙴',
                            url: PAIRING_API
                        })
                    }
                ];

                const buttonMessage = {
                    text: `┏━❑ 𝙿𝙰𝙸𝚁𝙸𝙽𝙶 𝙲𝙾𝙳𝙴 ━━━━━━━━━
┃ ✅ *𝙲𝚘𝚍𝚎 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢*
┃ 
┃ 📱 *𝙽𝚞𝚖𝚋𝚎𝚛:* ${phoneNumber}
┃ 🔢 *𝙲𝚘𝚍𝚎:* ${pairCode}
┃ 
┃ 📋 *𝙲𝚕𝚒𝚌𝚔 𝚋𝚞𝚝𝚝𝚘𝚗 𝚋𝚎𝚕𝚘𝚠 𝚝𝚘 𝚌𝚘𝚙𝚢*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
                    footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝙾𝚃 © 2026",
                    interactiveButtons: interactiveButtons,
                    headerType: 1,
                    contextInfo: {
                        mentionedJid: [dest],
                        externalAdReply: {
                            title: `🤖 𝙿𝚊𝚒𝚛𝚒𝚗𝚐 𝙲𝚘𝚍𝚎`,
                            body: `📱 ${phoneNumber}`,
                            mediaType: 1,
                            previewType: 0,
                            thumbnailUrl: GETBOT_THUMB,
                            sourceUrl: PAIRING_API,
                            renderLargerThumbnail: false,
                        }
                    }
                };

                await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });

                // Success reaction
                await zk.sendMessage(dest, {
                    react: { text: "✅", key: ms.key }
                });

            } else {
                throw new Error('No code received');
            }

        } catch (apiError) {
            console.error("Pairing API Error:", apiError.message);

            // Error buttons
            const interactiveButtons = [
                {
                    name: 'cta_url',
                    buttonParamsJson: JSON.stringify({
                        display_text: '🔄 𝚃𝚁𝚈 𝙰𝙶𝙰𝙸𝙽',
                        url: PAIRING_API
                    })
                }
            ];

            await zk.sendMessage(dest, {
                text: `┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚐𝚎𝚗𝚎𝚛𝚊𝚝𝚎 𝚌𝚘𝚍𝚎
┃ 📋 ${apiError.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
                footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝙾𝚃 © 2026",
                interactiveButtons: interactiveButtons,
                headerType: 1
            }, { quoted: fkontak });

            // Error reaction
            await zk.sendMessage(dest, {
                react: { text: "❌", key: ms.key }
            });
        }

    } catch (e) {
        console.log("❌ Getbot Command Error: " + e);
        await zk.sendMessage(dest, {
            react: { text: "❌", key: ms.key }
        });
        await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }
});