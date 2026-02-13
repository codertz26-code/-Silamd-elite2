const { silamd } = require("../../silamd/sila");
const fs = require('fs');
const path = require('path');

const thumbnails = ["https://files.catbox.moe/krnlo3.jpeg", "https://files.catbox.moe/36vahk.png"];
const randomThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)];
const AUDIO_URL = "https://files.catbox.moe/7ydtb3.mp3";

sila({ nomCom: 'add',
    desc: 'Add member to group',
    Categorie: 'Group',
    reaction: '➕',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, isAdminMessage, isGroupMessage } = commandeOptions;
    try {
        if (!isGroupMessage) return repondre("❌ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚘𝚗𝚕𝚢 𝚠𝚘𝚛𝚔𝚜 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙𝚜");
        if (!isAdminMessage) return repondre("❌ 𝙰𝚍𝚖𝚒𝚗𝚜 𝚘𝚗𝚕𝚢");

        if (!arg || arg.length === 0) {
            return repondre(`𝙷𝚘𝚠 𝚝𝚘 𝚞𝚜𝚎: .add number\n𝙴𝚡𝚊𝚖𝚙𝚕𝚎: .add 255789661031`);
        }

        await zk.sendMessage(dest, {
            audio: { url: AUDIO_URL },
            mimetype: 'audio/mp4',
            ptt: true,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402325089913@newsletter',
                    newsletterName: "➤®𝐒𝐈𝐋𝐀-𝐌𝐃",
                    serverMessageId: 143,
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: `➕ 𝙰𝚍𝚍 𝙼𝚎𝚖𝚋𝚎𝚛`,
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: randomThumbnail,
                    renderLargerThumbnail: true,
                },
            },
        }, { quoted: ms });

        repondre(`✅ 𝙼𝚎𝚖𝚋𝚎𝚛 𝚊𝚍𝚍𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢`);

    } catch (e) {
        console.log("❌ Add Error: " + e);
        repondre("❌ 𝙰𝚕𝚕 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚊𝚙𝚒𝚜 𝚏𝚊𝚒𝚕𝚎𝚍\n𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚕𝚊𝚝𝚎𝚛 𝚘𝚛 𝚌𝚘𝚗𝚝𝚊𝚌𝚝 𝚊𝚍𝚖𝚒𝚗");
    }
});
