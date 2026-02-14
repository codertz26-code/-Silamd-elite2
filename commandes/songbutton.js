const { silamd } = require("../silamd/sila");
const axios = require('axios');

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

// Random thumbnails
const thumbnails = [
    "https://files.catbox.moe/krnlo3.jpeg",
    "https://files.catbox.moe/36vahk.png",
    "https://files.catbox.moe/j7kue0.jpeg",
    "https://files.catbox.moe/edcfwx.jpeg",
    "https://files.catbox.moe/98k75b.jpeg"
];

const getRandomThumbnail = () => thumbnails[Math.floor(Math.random() * thumbnails.length)];

// Download function
const downloadFromUrl = async (url) => {
    try {
        const fallbackApi = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(url)}`;
        const response = await axios.get(fallbackApi, { timeout: 30000 });
        return response.data;
    } catch (error) {
        return { success: false, error: error.message };
    }
};

sila({
    nomCom: 'songbutton',
    alias: ['audioonly', 'audiodoc', 'videoonly', 'videodoc'],
    reaction: '🎵',
    desc: 'Handle song format buttons',
    Categorie: 'download',
    fromMe: 'true'
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, arg, repondre, nomCom } = commandeOptions;
    
    // Parse the button data
    // Format: format__videoUrl__title__author__thumbnail
    const buttonData = nomCom; // This will be like "audioonly__https://...__title__author__thumbnail"
    
    if (!buttonData.includes('__')) return;
    
    const parts = buttonData.split('__');
    const format = parts[0];
    const videoUrl = parts[1];
    const title = parts[2] || 'Unknown Title';
    const author = parts[3] || 'Unknown Artist';
    const thumbnail = parts[4] || getRandomThumbnail();
    
    if (!videoUrl || !videoUrl.includes('youtube.com')) {
        return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚟𝚒𝚍𝚎𝚘 𝚄𝚁𝙻
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }

    // Send processing message
    await repondre(`┏━❑ 𝙿𝚁𝙾𝙲𝙴𝚂𝚂𝙸𝙽𝙶 ━━━━━━━━━
┃ ⏳ 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚒𝚗𝚐 ${format === 'audioonly' ? '𝙰𝚄𝙳𝙸𝙾' : format === 'audiodoc' ? '𝙰𝚄𝙳𝙸𝙾 𝙳𝙾𝙲' : format === 'videoonly' ? '𝚅𝙸𝙳𝙴𝙾' : '𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝙲'}...
┃ 🎵 *${title}*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);

    // Download based on format
    const result = await downloadFromUrl(videoUrl);
    
    if (!result?.status) {
        return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍
┃ 📋 ${result.error || 'Unknown error'}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }

    const randomThumb = getRandomThumbnail();

    // Handle different formats
    if (format === 'audioonly') {
        // Audio Only - for listening
        if (result.audio) {
            await zk.sendMessage(dest, {
                audio: { url: result.audio },
                mimetype: "audio/mpeg",
                fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`,
                contextInfo: {
                    externalAdReply: {
                        title: `🎵 ${title.substring(0, 30)}${title.length > 30 ? '...' : ''}`,
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
    else if (format === 'audiodoc') {
        // Audio Document - for saving
        if (result.audio) {
            await zk.sendMessage(dest, {
                document: { url: result.audio },
                mimetype: "audio/mpeg",
                fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`,
                contextInfo: {
                    externalAdReply: {
                        title: `📄 ${title.substring(0, 30)}${title.length > 30 ? '...' : ''}`,
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
    else if (format === 'videoonly') {
        // Video Only - for watching
        if (result.video) {
            await zk.sendMessage(dest, {
                video: { url: result.video },
                mimetype: "video/mp4",
                caption: `┏━❑ 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝙳 ━━━━━━━━━
┃ 🎬 *${title}*
┃ 👤 *${author}*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
                contextInfo: {
                    externalAdReply: {
                        title: `🎬 ${title.substring(0, 30)}${title.length > 30 ? '...' : ''}`,
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
    else if (format === 'videodoc') {
        // Video Document - for downloading
        if (result.video) {
            await zk.sendMessage(dest, {
                document: { url: result.video },
                mimetype: "video/mp4",
                fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp4`,
                caption: `┏━❑ 𝚅𝙸𝙳𝙴𝙾 𝙳𝙾𝙲𝚄𝙼𝙴𝙽𝚃 ━━━━━━━━━
┃ 📁 *${title}*
┃ 👤 *${author}*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
                contextInfo: {
                    externalAdReply: {
                        title: `📁 ${title.substring(0, 30)}${title.length > 30 ? '...' : ''}`,
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

} catch (e) {
    console.log("❌ Song Button Error: " + e);
    await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
}
});