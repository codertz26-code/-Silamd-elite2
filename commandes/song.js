const { silamd } = require("../silamd/sila");
const axios = require('axios');
const yts = require('yt-search');

// Define combined fakevCard
const fakevCard = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "© 𝐒𝐈𝐋𝐀-𝐌𝐃",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:𝐒𝐈𝐋𝐀 𝐌𝐃 𝐁𝐎𝐓\nORG:𝐒𝐈𝐋𝐀-𝐌𝐃;\nTEL;type=CELL;type=VOICE;waid=255789661031:+255789661031\nEND:VCARD`
    }
  }
};

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
            serverMessageId: 143,
        },
    };
};

// ============================================
// SONG COMMAND - SILAMD VERSION
// ============================================
sila({
    nomCom: 'song',
    alias: ['mp3', 'play'],
    reaction: '🎵',
    desc: 'Download song with cover art',
    Categorie: 'download',
    fromMe: 'true'
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, arg, repondre, prefixe, nomAuteurMessage } = commandeOptions;
    const q = arg.join(" ");
    
    if (!q) return await repondre(`┏━❑ 𝐇𝐎𝐖 𝐓𝐎 𝐔𝐒𝐄 ━━━━━━━━━
┃ ✦ ${prefixe}song shape of you
┃ ✦ ${prefixe}song https://youtube.com/...
┗━━━━━━━━━━━━━━━━━━━━
> © Powered by Sila Tech`);
    
    // First, search for the song
    let videoData = null;
    let isDirectUrl = false;
    
    if (q.includes('youtube.com') || q.includes('youtu.be')) {
        // It's a direct URL
        isDirectUrl = true;
        const videoId = q.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
        
        if (!videoId) {
            return await repondre(`❌ 𝙸𝚗𝚟𝚊𝚕𝚒𝚍 𝚈𝚘𝚞𝚃𝚞𝚋𝚎 𝚕𝚒𝚗𝚔\n\n> © Powered by Sila Tech`);
        }
        
        // Search to get video info
        const search = await yts({ videoId: videoId });
        if (search) videoData = search;
    } else {
        // It's a search query
        await repondre(`🔍 𝚂𝚎𝚊𝚛𝚌𝚑𝚒𝚗𝚐 𝚈𝚘𝚞𝚃𝚞𝚋𝚎 𝚏𝚘𝚛 "${q}"...\n\n> © Powered by Sila Tech`);
        
        const search = await yts(q);
        if (!search || !search.all || search.all.length === 0) {
            return await repondre(`❌ 𝙽𝚘 𝚛𝚎𝚜𝚞𝚕𝚝𝚜 𝚏𝚘𝚞𝚗𝚍 𝚏𝚘𝚛 "${q}"\n\n> © Powered by Sila Tech`);
        }
        
        videoData = search.all[0];
    }
    
    if (!videoData) {
        return await repondre(`❌ 𝙲𝚘𝚞𝚕𝚍 𝚗𝚘𝚝 𝚐𝚎𝚝 𝚟𝚒𝚍𝚎𝚘 𝚒𝚗𝚏𝚘𝚛𝚖𝚊𝚝𝚒𝚘𝚗\n\n> © Powered by Sila Tech`);
    }
    
    const videoUrl = videoData.url;
    const title = videoData.title || 'Unknown Title';
    const thumbnail = videoData.thumbnail || videoData.image;
    const duration = videoData.timestamp || videoData.duration || 'N/A';
    const views = videoData.views ? videoData.views.toLocaleString() : 'N/A';
    
    // Send the cover art/thumbnail with song info
    await zk.sendMessage(dest, {
        image: { url: thumbnail },
        caption: `┏━❑ 𝐒𝐎𝐍𝐆 𝐈𝐍𝐅𝐎 ━━━━━━━━━
┃ 🎵 *𝚃𝚒𝚝𝚕𝚎:* ${title}
┃ ⏱️ *𝙳𝚞𝚛𝚊𝚝𝚒𝚘𝚗:* ${duration}
┃ 👁️ *𝚅𝚒𝚎𝚠𝚜:* ${views}
┃ 🔗 *𝚄𝚁𝙻:* ${videoUrl}
┗━━━━━━━━━━━━━━━━━━━━
⏳ 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍𝚒𝚗𝚐 𝙼𝙿𝟹...\n\n> © Powered by Sila Tech`,
        contextInfo: getContextInfo({ sender: nomAuteurMessage })
    }, { quoted: fakevCard });
    
    try {
        // Try using the alternative API first (since it works)
        const fallbackApi = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
        
        const fallbackResponse = await axios.get(fallbackApi, { timeout: 30000 });
        const fallbackData = fallbackResponse.data;
        
        if (fallbackData?.status && fallbackData.audio) {
            // Send as audio file
            await zk.sendMessage(dest, {
                audio: { url: fallbackData.audio },
                mimetype: "audio/mpeg",
                fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`
            }, { quoted: fakevCard });
            
            // Send as document file
            await zk.sendMessage(dest, {
                document: { url: fallbackData.audio },
                mimetype: "audio/mpeg",
                fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`
            }, { quoted: fakevCard });
            
        } else {
            // Fallback to other method if needed
            const apiUrl = `https://meta-api.zone.id/downloader/youtube?url=${encodeURIComponent(videoUrl)}`;
            const response = await axios.get(apiUrl, { timeout: 30000 });
            const data = response.data;
            
            let audioUrl = data?.result?.audio || data?.result?.url;
            
            if (audioUrl) {
                // Send as audio file
                await zk.sendMessage(dest, {
                    audio: { url: audioUrl },
                    mimetype: "audio/mpeg",
                    fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`
                }, { quoted: fakevCard });
                
                // Send as document file
                await zk.sendMessage(dest, {
                    document: { url: audioUrl },
                    mimetype: "audio/mpeg",
                    fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`
                }, { quoted: fakevCard });
                
            } else {
                throw new Error('No audio URL found');
            }
        }
        
    } catch (error) {
        console.error('Download error:', error.message);
        
        // Send error message
        await repondre(`❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚊𝚞𝚍𝚒𝚘\n\n𝚁𝚎𝚊𝚜𝚘𝚗: ${error.message}\n\n> © Powered by Sila Tech`);
    }
    
} catch (e) {
    console.log("❌ Song Command Error: " + e);
    repondre(`❌ 𝙲𝚘𝚖𝚖𝚊𝚗𝚍 𝚏𝚊𝚒𝚕𝚎𝚍: ${e.message}\n\n> © Powered by Sila Tech`);
}
});
