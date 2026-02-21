const { sila } = require("../silamd/sila");
const getFBInfo = require("@xaviabot/fb-downloader");
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
    nomCom: 'fb',
    alias: ['fb', 'facebook', 'facebook1', 'fb1', 'fbdl', 'fbdown'],
    reaction: '📽️',
    desc: 'Download Facebook videos',
    Categorie: 'download',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, arg, repondre, prefixe, nomAuteurMessage } = commandeOptions;
        const fbUrl = arg.join(" ").trim();

        if (!fbUrl) {
            return await repondre(`┏━❑ 𝙷𝙾𝚆 𝚃𝙾 𝚄𝚂𝙴 ━━━━━━━━━
┃ ✦ ${prefixe}fb https://facebook.com/...
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        if (!fbUrl.includes("facebook.com") && !fbUrl.includes("fb.watch")) {
            return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝙵𝚊𝚌𝚎𝚋𝚘𝚘𝚔 𝚕𝚒𝚗𝚔
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        // Send reaction
        await zk.sendMessage(dest, {
            react: { text: "🔍", key: ms.key }
        });

        await repondre(`┏━❑ 𝙵𝙴𝚃𝙲𝙷𝙸𝙽𝙶 ━━━━━━━━━
┃ 📽️ 𝙶𝚎𝚝𝚝𝚒𝚗𝚐 𝚟𝚒𝚍𝚎𝚘 𝚒𝚗𝚏𝚘...
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);

        // Get video info
        const videoData = await getFBInfo(fbUrl);

        if (!videoData || !videoData.sd) {
            await zk.sendMessage(dest, {
                react: { text: "❌", key: ms.key }
            });
            return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚏𝚎𝚝𝚌𝚑 𝚟𝚒𝚍𝚎𝚘
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        const title = videoData.title || 'Facebook Video';
        const thumbnail = videoData.thumbnail || thumbImage;
        const sdUrl = videoData.sd;
        const hdUrl = videoData.hd || null;

        // Send video info with thumbnail
        await zk.sendMessage(dest, {
            image: { url: thumbnail },
            caption: `┏━❑ 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 𝙸𝙽𝙵𝙾 ━━━━━━━━━
┃ 📽️ *𝚃𝚒𝚝𝚕𝚎:* ${title.substring(0, 40)}${title.length > 40 ? '...' : ''}
┃ 
┃ 📋 *𝙾𝚙𝚝𝚒𝚘𝚗𝚜:*
┃ ➊ 𝚂𝙳 𝚀𝚞𝚊𝚕𝚒𝚝𝚢
┃ ➋ 𝙷𝙳 𝚀𝚞𝚊𝚕𝚒𝚝𝚢 (𝚒𝚏 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎)
┃ ➌ 𝙰𝚞𝚍𝚒𝚘 𝙾𝚗𝚕𝚢
┃ 
┃ *𝚁𝚎𝚙𝚕𝚢 𝚠𝚒𝚝𝚑 𝚗𝚞𝚖𝚋𝚎𝚛 (𝟷, 𝟸, 𝟹)*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
            contextInfo: {
                externalAdReply: {
                    title: `📽️ ${title.substring(0, 30)}${title.length > 30 ? '...' : ''}`,
                    body: `𝙵𝚊𝚌𝚎𝚋𝚘𝚘𝚔 𝚅𝚒𝚍𝚎𝚘`,
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: thumbImage,
                    sourceUrl: fbUrl,
                    renderLargerThumbnail: false,
                }
            }
        }, { quoted: fkontak });

        // Wait for user reply
        // Note: This requires a message collector in your main framework
        // For now, we'll just send the video directly

        // Download reaction
        await zk.sendMessage(dest, {
            react: { text: "⬇️", key: ms.key }
        });

        // Send SD video
        const videoRes = await axios.get(sdUrl, { 
            responseType: 'arraybuffer',
            timeout: 180000
        });

        const videoBuffer = Buffer.from(videoRes.data);
        const fileSize = (videoBuffer.length / (1024 * 1024)).toFixed(2);

        await zk.sendMessage(dest, {
            video: videoBuffer,
            caption: `┏━❑ 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝙳 ━━━━━━━━━
┃ 📽️ *${title.substring(0, 40)}${title.length > 40 ? '...' : ''}*
┃ 📊 𝚂𝚒𝚣𝚎: ${fileSize}MB
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
            contextInfo: {
                externalAdReply: {
                    title: `📽️ ${title.substring(0, 30)}${title.length > 30 ? '...' : ''}`,
                    body: `📊 ${fileSize}MB`,
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: thumbnail,
                    sourceUrl: fbUrl,
                    renderLargerThumbnail: false,
                }
            }
        }, { quoted: fkontak });

        // Success reaction
        await zk.sendMessage(dest, {
            react: { text: "✅", key: ms.key }
        });

    } catch (e) {
        console.log("❌ FB Command Error: " + e);
        await zk.sendMessage(dest, {
            react: { text: "❌", key: ms.key }
        });
        await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }
});