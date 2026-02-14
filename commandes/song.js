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

// Download function for audio
const downloadAudio = async (videoUrl, title, author, thumbnail) => {
    try {
        const fallbackApi = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(fallbackApi, { timeout: 30000 });
        const data = response.data;
        
        if (data?.status && data.audio) {
            return {
                success: true,
                audioUrl: data.audio,
                title,
                author,
                thumbnail
            };
        }
        return { success: false, error: 'No audio URL found' };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Download function for audio document
const downloadAudioDoc = async (videoUrl, title, author, thumbnail) => {
    try {
        const fallbackApi = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(fallbackApi, { timeout: 30000 });
        const data = response.data;
        
        if (data?.status && data.audio) {
            return {
                success: true,
                audioUrl: data.audio,
                title,
                author,
                thumbnail
            };
        }
        return { success: false, error: 'No audio URL found' };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Download function for video
const downloadVideo = async (videoUrl, title, author, thumbnail) => {
    try {
        const fallbackApi = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(fallbackApi, { timeout: 30000 });
        const data = response.data;
        
        if (data?.status && data.video) {
            return {
                success: true,
                videoUrl: data.video,
                title,
                author,
                thumbnail
            };
        }
        return { success: false, error: 'No video URL found' };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Download function for video document
const downloadVideoDoc = async (videoUrl, title, author, thumbnail) => {
    try {
        const fallbackApi = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
        const response = await axios.get(fallbackApi, { timeout: 30000 });
        const data = response.data;
        
        if (data?.status && data.video) {
            return {
                success: true,
                videoUrl: data.video,
                title,
                author,
                thumbnail
            };
        }
        return { success: false, error: 'No video URL found' };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// ============================================
// SONG COMMAND - ILIYOSAHIHISHWA
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
┃ 
┃ 💡 *Aliases:* mp3, play, music, video, ytmp4, ytmp3
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);

    // First, search for the song
    let videoData = null;
    let isDirectUrl = false;

    if (q.includes('youtube.com') || q.includes('youtu.be')) {
        // It's a direct URL
        isDirectUrl = true;
        const videoId = q.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];

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
┃ 🔍 *𝚂𝚎𝚊𝚛𝚌𝚑𝚒𝚗𝚐:* "${q}"
┃ ⏳ 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);

        const search = await yts(q);
        if (!search || !search.all || search.all.length === 0) {
            return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙽𝚘 𝚛𝚎𝚜𝚞𝚕𝚝𝚜 𝚏𝚘𝚞𝚗𝚍 𝚏𝚘𝚛 "${q}"
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

    // Create buttons for different formats (only buttonId na displayText)
    const buttons = [
        { 
            buttonId: `audioonly__${videoUrl}__${title}__${author}__${thumbnail}`, 
            buttonText: { displayText: "🎵 𝙰𝚄𝙳𝙸𝙾 𝙾𝙽𝙻𝚈" }, 
            type: 1 
        },
        { 
            buttonId: `audiodoc__${videoUrl}__${title}__${author}__${thumbnail}`, 
            buttonText: { displayText: "📄 𝙰𝚄𝙳𝙸𝙾 𝙳𝙾𝙲" }, 
            type: 1 
        },
        { 
            buttonId: `videoonly__${videoUrl}__${title}__${author}__${thumbnail}`, 
            buttonText: { displayText: "🎬 𝚅𝙸𝙳𝙴𝙾 𝙾𝙽𝙻𝚈" }, 
            type: 1 
        },
        { 
            buttonId: `videodoc__${videoUrl}__${title}__${author}__${thumbnail}`, 
            buttonText: { displayText: "📁 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝙲" }, 
            type: 1 
        }
    ];

    // Send ONE message with image, info, and buttons together
    const buttonMessage = {
        image: { url: thumbnail },
        caption: `┏━❑ 𝚂𝙾𝙽𝙶 𝙸𝙽𝙵𝙾 ━━━━━━━━━
┃ 🎵 *𝚃𝚒𝚝𝚕𝚎:* ${title}
┃ 👤 *𝙰𝚛𝚝𝚒𝚜𝚝:* ${author}
┃ ⏱️ *𝙳𝚞𝚛𝚊𝚝𝚒𝚘𝚗:* ${duration}
┃ 👁️ *𝚅𝚒𝚎𝚠𝚜:* ${views}
┃ 📅 *𝚄𝚙𝚕𝚘𝚊𝚍𝚎𝚍:* ${uploaded}
┃ 🔗 *𝚄𝚁𝙻:* ${videoUrl}
┗━━━━━━━━━━━━━━━━━━━━

📋 *𝙲𝚑𝚘𝚘𝚜𝚎 𝚏𝚘𝚛𝚖𝚊𝚝 𝚋𝚎𝚕𝚘𝚠:*
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
        footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝙾𝚃 © 2026",
        buttons: buttons,
        headerType: 4,
        contextInfo: {
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
    };

    await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });

} catch (e) {
    console.log("❌ Song Command Error: " + e);
    repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
}
});