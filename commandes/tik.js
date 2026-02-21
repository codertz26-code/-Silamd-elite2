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

// Thumbnail
const thumbImage = "https://files.catbox.moe/98k75b.jpeg";

sila({ 
    nomCom: 'tiktoksearch',
    alias: ['tiktoksearch', 'tiktoks', 'tiks', 'ttsearch', 'tts', 'tiktokfind'],
    reaction: '🎵',
    desc: 'Search TikTok videos',
    Categorie: 'downloader',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, arg, repondre, prefixe, nomAuteurMessage } = commandeOptions;
        const q = arg.join(" ").trim();

        if (!q) {
            return await repondre(`┏━❑ 𝚃𝙸𝙺𝚃𝙾𝙺 𝚂𝙴𝙰𝚁𝙲𝙷 ━━━━━━━━━
┃ 📌 *𝚄𝚜𝚊𝚐𝚎:* ${prefixe}tiktoksearch <𝚚𝚞𝚎𝚛𝚢>
┃ ✦ 𝙴𝚡𝚊𝚖𝚙𝚕𝚎: ${prefixe}tiktoksearch comedy
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        // Send reaction
        await zk.sendMessage(dest, {
            react: { text: "🔍", key: ms.key }
        });

        await repondre(`┏━❑ 𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶 ━━━━━━━━━
┃ 🔎 *${q}*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);

        // Call API
        const api = `https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(q)}`;
        const response = await axios.get(api, { timeout: 30000 });
        const data = response.data;

        if (!data.data || data.data.length === 0) {
            await zk.sendMessage(dest, {
                react: { text: "❌", key: ms.key }
            });
            return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙽𝚘 𝚛𝚎𝚜𝚞𝚕𝚝𝚜 𝚏𝚘𝚞𝚗𝚍
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        // Get up to 5 random results
        const results = data.data
            .filter(v => v.nowm) // Only those with video URL
            .slice(0, 7)
            .sort(() => Math.random() - 0.5);

        if (results.length === 0) {
            await zk.sendMessage(dest, {
                react: { text: "❌", key: ms.key }
            });
            return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙽𝚘 𝚟𝚒𝚍𝚎𝚘𝚜 𝚏𝚘𝚞𝚗𝚍
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        // Send results count
        await repondre(`┏━❑ 𝙵𝙾𝚄𝙽𝙳 ━━━━━━━━━
┃ 📊 ${results.length} 𝚟𝚒𝚍𝚎𝚘𝚜 𝚏𝚘𝚞𝚗𝚍
┃ ⏳ 𝚂𝚎𝚗𝚍𝚒𝚗𝚐 ${results.length} 𝚟𝚒𝚍𝚎𝚘𝚜...
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);

        // Send each video
        for (let i = 0; i < results.length; i++) {
            const video = results[i];
            
            const caption = `┏━❑ 𝚃𝙸𝙺𝚃𝙾𝙺 𝚂𝙴𝙰𝚁𝙲𝙷 ━━━━━━━━━
┃ 🎵 *𝚃𝚒𝚝𝚕𝚎:* ${video.title || 'No title'}
┃ 👤 *𝙰𝚞𝚝𝚑𝚘𝚛:* ${video.author || 'Unknown'}
┃ ⏱️ *𝙳𝚞𝚛𝚊𝚝𝚒𝚘𝚗:* ${video.duration || 'N/A'}
┃ 🔗 *𝙻𝚒𝚗𝚔:* ${video.link || 'N/A'}
┃ 📊 *𝚁𝚎𝚜𝚞𝚕𝚝:* ${i+1}/${results.length}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`;

            // Send video
            await zk.sendMessage(dest, {
                video: { url: video.nowm },
                caption: caption,
                contextInfo: {
                    externalAdReply: {
                        title: `🎵 ${(video.title || 'TikTok Video').substring(0, 30)}`,
                        body: `👤 ${video.author || 'Unknown'}`,
                        mediaType: 1,
                        previewType: 0,
                        thumbnailUrl: thumbImage,
                        sourceUrl: video.link || '',
                        renderLargerThumbnail: false,
                    }
                }
            }, { quoted: fkontak });

            // Small delay between videos
            if (i < results.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }

        // Success reaction
        await zk.sendMessage(dest, {
            react: { text: "✅", key: ms.key }
        });

    } catch (e) {
        console.log("❌ TikTokSearch Error: " + e);
        await zk.sendMessage(dest, {
            react: { text: "❌", key: ms.key }
        });
        await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝚂𝚎𝚊𝚛𝚌𝚑 𝚏𝚊𝚒𝚕𝚎𝚍
┃ 📋 ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }
});