const { silamd } = require("../silamd/sila");
const axios = require('axios');
const yts = require('yt-search');

// FakevCard sawa na index (bila jid)
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

// Random thumbnails for external ad reply
const thumbnails = [
    "https://files.catbox.moe/krnlo3.jpeg",
    "https://files.catbox.moe/36vahk.png",
    "https://files.catbox.moe/j7kue0.jpeg",
    "https://files.catbox.moe/edcfwx.jpeg",
    "https://files.catbox.moe/98k75b.jpeg"
];

const getRandomThumbnail = () => thumbnails[Math.floor(Math.random() * thumbnails.length)];

// Format duration
const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Format views
const formatViews = (views) => {
    if (!views) return 'N/A';
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString();
};

// ============================================
// SONG COMMAND - ILIYOBORESHWA KAMILI
// ============================================
sila({
    nomCom: 'song',
    alias: ['mp3', 'play', 'music', 'ytmp3', 'ytmp4', 'video', 'yt', 'ytaudio', 'ytvideo', 'download', 'dl', 'audio', 'mp4'],
    reaction: '🎵',
    desc: 'Download song/video with multiple format options',
    Categorie: 'download',
    fromMe: 'true'
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, arg, repondre, prefixe, nomAuteurMessage } = commandeOptions;
    const q = arg.join(" ");

    if (!q) return await repondre(`┏━❑ 𝙷𝙾𝚆 𝚃𝙾 𝚄𝚂𝙴 ━━━━━━━━━
┃ ✦ ${prefixe}song shape of you
┃ ✦ ${prefixe}song https://youtube.com/...
┃ ✦ ${prefixe}song -v shape of you (for video)
┃ 
┃ 💡 *Aliases:* mp3, play, music, video, ytmp4, ytmp3
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);

    // Check if user wants video
    let isVideo = false;
    let searchQuery = q;
    
    if (q.startsWith('-v ') || q.startsWith('-video ')) {
        isVideo = true;
        searchQuery = q.replace(/^-v\s+|-video\s+/, '');
    }

    // First, search for the song
    let videoData = null;
    let isDirectUrl = false;

    if (searchQuery.includes('youtube.com') || searchQuery.includes('youtu.be')) {
        // It's a direct URL
        isDirectUrl = true;
        const videoId = searchQuery.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];

        if (!videoId) {
            return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚈𝚘𝚞𝚃𝚞𝚋𝚎 𝚕𝚒𝚗𝚔
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        const search = await yts({ videoId: videoId });
        if (search) videoData = search;
    } else {
        // It's a search query
        await repondre(`┏━❑ 𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶 ━━━━━━━━━
┃ 🔍 *𝚂𝚎𝚊𝚛𝚌𝚑𝚒𝚗𝚐:* "${searchQuery}"
┃ ⏳ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);

        const search = await yts(searchQuery);
        if (!search || !search.all || search.all.length === 0) {
            return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙽𝚘 𝚛𝚎𝚜𝚞𝚕𝚝𝚜 𝚏𝚘𝚞𝚗𝚍 𝚏𝚘𝚛 "${searchQuery}"
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        videoData = search.all[0];
    }

    if (!videoData) {
        return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙲𝚘𝚞𝚕𝚍 𝚗𝚘𝚝 𝚐𝚎𝚝 𝚟𝚒𝚍𝚎𝚘 𝚒𝚗𝚏𝚘𝚛𝚖𝚊𝚝𝚒𝚘𝚗
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }

    const videoUrl = videoData.url;
    const title = videoData.title || 'Unknown Title';
    const thumbnail = videoData.thumbnail || videoData.image;
    const duration = videoData.seconds ? formatDuration(videoData.seconds) : (videoData.timestamp || 'N/A');
    const views = videoData.views ? formatViews(videoData.views) : 'N/A';
    const author = videoData.author?.name || 'Unknown Artist';
    const uploaded = videoData.ago || 'N/A';

    // Random thumbnail for external ad reply
    const randomThumb = getRandomThumbnail();

    // Send the cover art/thumbnail with song info
    await zk.sendMessage(dest, {
        image: { url: thumbnail },
        caption: `┏━❑ 𝚂𝙾𝙽𝙶 𝙸𝙽𝙵𝙾 ━━━━━━━━━
┃ 🎵 *𝚃𝚒𝚝𝚕𝚎:* ${title}
┃ 👤 *𝙰𝚛𝚝𝚒𝚜𝚝:* ${author}
┃ ⏱️ *𝙳𝚞𝚛𝚊𝚝𝚒𝚘𝚗:* ${duration}
┃ 👁️ *𝚅𝚒𝚎𝚠𝚜:* ${views}
┃ 📅 *𝚄𝚙𝚕𝚘𝚊𝚍𝚎𝚍:* ${uploaded}
┃ 🔗 *𝚄𝚁𝙻:* ${videoUrl}
┗━━━━━━━━━━━━━━━━━━━━
⏳ 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚒𝚗𝚐 ${isVideo ? '𝚅𝙸𝙳𝙴𝙾' : '𝙰𝚄𝙳𝙸𝙾'}...
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
        contextInfo: {
            mentionedJid: [nomAuteurMessage],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363402325089913@newsletter',
                newsletterName: '© 𝚂𝙸𝙻𝙰 𝙼𝙳',
                serverMessageId: 143,
            },
            externalAdReply: {
                title: `🎵 ${title.substring(0, 30)}${title.length > 30 ? '...' : ''}`,
                body: `👤 ${author} | ⏱️ ${duration}`,
                mediaType: 1,
                previewType: 0,
                thumbnailUrl: randomThumb,
                sourceUrl: videoUrl,
                renderLargerThumbnail: false,
            }
        }
    }, { quoted: fkontak });

    try {
        // Create buttons for different formats
        const buttons = [
            { 
                buttonId: `${prefixe}song audioonly ${videoUrl}`, 
                buttonText: { displayText: "🎵 𝙰𝚄𝙳𝙸𝙾 𝙾𝙽𝙻𝚈" }, 
                type: 1 
            },
            { 
                buttonId: `${prefixe}song audiodoc ${videoUrl}`, 
                buttonText: { displayText: "📄 𝙰𝚄𝙳𝙸𝙾 𝙳𝙾𝙲" }, 
                type: 1 
            },
            { 
                buttonId: `${prefixe}song videoonly ${videoUrl}`, 
                buttonText: { displayText: "🎬 𝚅𝙸𝙳𝙴𝙾 𝙾𝙽𝙻𝚈" }, 
                type: 1 
            },
            { 
                buttonId: `${prefixe}song videodoc ${videoUrl}`, 
                buttonText: { displayText: "📁 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝙲" }, 
                type: 1 
            }
        ];

        const buttonMessage = {
            text: `┏━❑ 𝙲𝙷𝙾𝙾𝚂𝙴 𝙵𝙾𝚁𝙼𝙰𝚃 ━━━━━━━━━
┃ 🎵 *${title}*
┃ 
┃ 📋 *𝙰𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚏𝚘𝚛𝚖𝚊𝚝𝚜:*
┃ 
┃ 🎵 𝙰𝚞𝚍𝚒𝚘 𝙾𝚗𝚕𝚢 - 𝙵𝚘𝚛 𝚕𝚒𝚜𝚝𝚎𝚗𝚒𝚗𝚐
┃ 📄 𝙰𝚞𝚍𝚒𝚘 𝙳𝚘𝚌 - 𝙵𝚘𝚛 𝚜𝚊𝚟𝚒𝚗𝚐
┃ 🎬 𝚅𝚒𝚍𝚎𝚘 𝙾𝚗𝚕𝚢 - 𝙵𝚘𝚛 𝚠𝚊𝚝𝚌𝚑𝚒𝚗𝚐
┃ 📁 𝚅𝚒𝚍𝚎𝚘 𝙳𝚘𝚌 - 𝙵𝚘𝚛 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍
┗━━━━━━━━━━━━━━━━━━━━

𝙲𝚕𝚒𝚌𝚔 𝚊 𝚋𝚞𝚝𝚝𝚘𝚗 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍:
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝙾𝚃 © 2026",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                mentionedJid: [nomAuteurMessage],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402325089913@newsletter',
                    newsletterName: '© 𝚂𝙸𝙻𝙰 𝙼𝙳',
                    serverMessageId: 143,
                },
                externalAdReply: {
                    title: `📋 𝙲𝚑𝚘𝚘𝚜𝚎 𝙵𝚘𝚛𝚖𝚊𝚝`,
                    body: title.substring(0, 40),
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: randomThumb,
                    sourceUrl: videoUrl,
                    renderLargerThumbnail: false,
                }
            }
        };

        await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });

        // Try to download based on format
        const fallbackApi = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
        const fallbackResponse = await axios.get(fallbackApi, { timeout: 30000 });
        const fallbackData = fallbackResponse.data;

        if (fallbackData?.status) {
            // Audio download
            if (fallbackData.audio) {
                // Audio Only (listening)
                await zk.sendMessage(dest, {
                    audio: { url: fallbackData.audio },
                    mimetype: "audio/mpeg",
                    fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`,
                    contextInfo: {
                        externalAdReply: {
                            title: `🎵 ${title.substring(0, 30)}`,
                            body: `👤 ${author}`,
                            mediaType: 1,
                            previewType: 0,
                            thumbnailUrl: thumbnail,
                            sourceUrl: videoUrl,
                            renderLargerThumbnail: false,
                        }
                    }
                }, { quoted: fkontak });

                // Audio Document (saving)
                await zk.sendMessage(dest, {
                    document: { url: fallbackData.audio },
                    mimetype: "audio/mpeg",
                    fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`,
                    contextInfo: {
                        externalAdReply: {
                            title: `📄 ${title.substring(0, 30)}`,
                            body: `👤 ${author}`,
                            mediaType: 1,
                            previewType: 0,
                            thumbnailUrl: thumbnail,
                            sourceUrl: videoUrl,
                            renderLargerThumbnail: false,
                        }
                    }
                }, { quoted: fkontak });
            }

            // Video download
            if (fallbackData.video) {
                // Video Only (watching)
                await zk.sendMessage(dest, {
                    video: { url: fallbackData.video },
                    mimetype: "video/mp4",
                    caption: `┏━❑ 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝙳 ━━━━━━━━━
┃ 🎬 *${title}*
┃ ⏱️ *𝙳𝚞𝚛𝚊𝚝𝚒𝚘𝚗:* ${duration}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
                    contextInfo: {
                        externalAdReply: {
                            title: `🎬 ${title.substring(0, 30)}`,
                            body: `👤 ${author} | ⏱️ ${duration}`,
                            mediaType: 1,
                            previewType: 0,
                            thumbnailUrl: thumbnail,
                            sourceUrl: videoUrl,
                            renderLargerThumbnail: false,
                        }
                    }
                }, { quoted: fkontak });

                // Video Document (downloading)
                await zk.sendMessage(dest, {
                    document: { url: fallbackData.video },
                    mimetype: "video/mp4",
                    fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp4`,
                    caption: `┏━❑ 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝙲𝚄𝙼𝙴𝙽𝚃 ━━━━━━━━━
┃ 📁 *${title}*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
                    contextInfo: {
                        externalAdReply: {
                            title: `📁 ${title.substring(0, 30)}`,
                            body: `👤 ${author}`,
                            mediaType: 1,
                            previewType: 0,
                            thumbnailUrl: thumbnail,
                            sourceUrl: videoUrl,
                            renderLargerThumbnail: false,
                        }
                    }
                }, { quoted: fkontak });
            }
        }

    } catch (error) {
        console.error('Download error:', error.message);
        await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍
┃ 📋 ${error.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }

} catch (e) {
    console.log("❌ Song Command Error: " + e);
    repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
}
});