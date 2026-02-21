const { sila } = require("../silamd/sila");
const axios = require('axios');
const yts = require('yt-search');

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

// Format duration
const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

sila({ 
    nomCom: 'video',
    alias: ['video', 'ytmp4', 'ytvideo', 'mp4', 'vid'],
    reaction: '🎬',
    desc: 'Download YouTube video (MP4)',
    Categorie: 'download',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, arg, repondre, prefixe, nomAuteurMessage } = commandeOptions;
        const q = arg.join(" ").trim();

        if (!q) {
            return await repondre(`┏━❑ 𝙷𝙾𝚆 𝚃𝙾 𝚄𝚂𝙴 ━━━━━━━━━
┃ ✦ ${prefixe}video shape of you
┃ ✦ ${prefixe}video https://youtube.com/...
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        // Send reaction
        await zk.sendMessage(dest, {
            react: { text: "🔍", key: ms.key }
        });

        // Simple search message
        await repondre(`𝚂𝙸𝙻𝙰 𝙸𝚂 𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶 🔎`);

        let videoData = null;
        let videoId = null;

        // Check if it's a direct YouTube URL
        if (q.includes('youtube.com') || q.includes('youtu.be')) {
            videoId = q.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];

            if (!videoId) {
                await zk.sendMessage(dest, {
                    react: { text: "❌", key: ms.key }
                });
                return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚈𝚘𝚞𝚃𝚞𝚋𝚎 𝚕𝚒𝚗𝚔
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
            }

            const search = await yts({ videoId: videoId });
            if (search) videoData = search;
        } else {
            const search = await yts(q);

            if (!search || !search.all || search.all.length === 0) {
                await zk.sendMessage(dest, {
                    react: { text: "❌", key: ms.key }
                });
                return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙽𝚘 𝚛𝚎𝚜𝚞𝚕𝚝𝚜 𝚏𝚘𝚞𝚗𝚍 𝚏𝚘𝚛 "${q}"
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
            }

            videoData = search.all[0];
            videoId = videoData.videoId;
        }

        if (!videoData) {
            await zk.sendMessage(dest, {
                react: { text: "❌", key: ms.key }
            });
            return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙲𝚘𝚞𝚕𝚍 𝚗𝚘𝚝 𝚐𝚎𝚝 𝚟𝚒𝚍𝚎𝚘 𝚒𝚗𝚏𝚘𝚛𝚖𝚊𝚝𝚒𝚘𝚗
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        const videoUrl = videoData.url || `https://www.youtube.com/watch?v=${videoId}`;
        const title = videoData.title || 'Unknown Title';
        const thumbnail = videoData.thumbnail || videoData.image;
        const duration = videoData.seconds ? formatDuration(videoData.seconds) : (videoData.timestamp || 'N/A');
        const views = videoData.views ? videoData.views.toLocaleString() : 'N/A';
        const author = videoData.author?.name || 'Unknown Artist';

        // Send video info with thumbnail
        await zk.sendMessage(dest, {
            image: { url: thumbnail },
            caption: `┏━❑ 𝚅𝙸𝙳𝙴𝙾 𝙸𝙽𝙵𝙾 ━━━━━━━━━
┃ 🎬 *𝚃𝚒𝚝𝚕𝚎:* ${title.substring(0, 40)}${title.length > 40 ? '...' : ''}
┃ 👤 *𝙰𝚛𝚝𝚒𝚜𝚝:* ${author.substring(0, 30)}${author.length > 30 ? '...' : ''}
┃ ⏱️ *𝙳𝚞𝚛𝚊𝚝𝚒𝚘𝚗:* ${duration}
┃ 👁️ *𝚅𝚒𝚎𝚠𝚜:* ${views}
┃ 🔗 *𝚄𝚁𝙻:* ${videoUrl}
┗━━━━━━━━━━━━━━━━━━━━
⏳ 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚒𝚗𝚐 𝙼𝙿𝟺...
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
            contextInfo: {
                externalAdReply: {
                    title: `🎬 ${title.substring(0, 30)}${title.length > 30 ? '...' : ''}`,
                    body: `👤 ${author.substring(0, 25)}${author.length > 25 ? '...' : ''}`,
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: thumbImage,
                    sourceUrl: videoUrl,
                    renderLargerThumbnail: false,
                }
            }
        }, { quoted: fkontak });

        // Download reaction
        await zk.sendMessage(dest, {
            react: { text: "⬇️", key: ms.key }
        });

        // Download video using API
        try {
            // First try: yt-dl API
            const fallbackApi = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
            const response = await axios.get(fallbackApi, { timeout: 60000 });
            const data = response.data;

            let videoDlUrl = null;

            if (data?.status && data.video) {
                videoDlUrl = data.video;
            } else if (data?.video) {
                videoDlUrl = data.video;
            } else if (data?.mp4) {
                videoDlUrl = data.mp4;
            }

            if (!videoDlUrl) {
                // Second try: Alternative API
                const altApi = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(videoUrl)}`;
                const altResponse = await axios.get(altApi, { timeout: 60000 });
                const altData = altResponse.data;

                if (altData?.result?.video) {
                    videoDlUrl = altData.result.video;
                } else if (altData?.video) {
                    videoDlUrl = altData.video;
                }
            }

            if (!videoDlUrl) {
                throw new Error('No video URL found from any API');
            }

            // Download video file
            const videoRes = await axios.get(videoDlUrl, { 
                responseType: 'arraybuffer',
                timeout: 180000 // 3 minutes
            });

            const videoBuffer = Buffer.from(videoRes.data);
            const fileSize = (videoBuffer.length / (1024 * 1024)).toFixed(2);

            if (fileSize > 50) {
                return await repondre(`┏━❑ 𝚆𝙰𝚁𝙽𝙸𝙽𝙶 ━━━━━━━━━
┃ ⚠️ 𝙵𝚒𝚕𝚎 𝚝𝚘𝚘 𝚕𝚊𝚛𝚐𝚎: ${fileSize}MB
┃ 📋 𝙼𝚊𝚡: 50MB
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
            }

            // Send video
            await zk.sendMessage(dest, {
                video: videoBuffer,
                caption: `┏━❑ 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝙳 ━━━━━━━━━
┃ 🎬 *${title.substring(0, 40)}${title.length > 40 ? '...' : ''}*
┃ 📊 𝚂𝚒𝚣𝚎: ${fileSize}MB
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
                contextInfo: {
                    externalAdReply: {
                        title: `🎬 ${title.substring(0, 30)}${title.length > 30 ? '...' : ''}`,
                        body: `📊 ${fileSize}MB`,
                        mediaType: 1,
                        previewType: 0,
                        thumbnailUrl: thumbnail,
                        sourceUrl: videoUrl,
                        renderLargerThumbnail: false,
                    }
                }
            }, { quoted: fkontak });

            // Success reaction
            await zk.sendMessage(dest, {
                react: { text: "✅", key: ms.key }
            });

        } catch (dlError) {
            console.error("Video download error:", dlError.message);
            
            await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚟𝚒𝚍𝚎𝚘
┃ 📋 ${dlError.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);

            await zk.sendMessage(dest, {
                react: { text: "❌", key: ms.key }
            });
        }

    } catch (e) {
        console.log("❌ Video Command Error: " + e);
        await zk.sendMessage(dest, {
            react: { text: "❌", key: ms.key }
        });
        await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message.substring(0, 50)}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }
});