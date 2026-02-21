const { silamd } = require("../silamd/sila");
const axios = require('axios');
const yts = require('yt-search');
const conf = require("../set");

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

// Context Info function
const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402325089913@newsletter',
            newsletterName: '© 𝚂𝙸𝙻𝙰 𝙼𝙳',
            serverMessageId: 143,
        },
    };
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

silamd({
    nomCom: 'song2',
    alias: ['song2', 'mp3', 'music2', 'play2', 'ytmp32', 'audio2'],
    reaction: '🎵',
    desc: 'Download song as MP3 from YouTube',
    Categorie: 'download',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, arg, repondre, prefixe, nomAuteurMessage } = commandeOptions;
        const q = arg.join(" ").trim();

        if (!q) {
            return await repondre(`┏━❑ 𝙷𝙾𝚆 𝚃𝙾 𝚄𝚂𝙴 ━━━━━━━━━
┃ ✦ ${prefixe}song2 shape of you
┃ ✦ ${prefixe}song2 https://youtube.com/...
┃ 
┃ 💡 *Aliases:* mp3, music2, play2, ytmp32
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        // Send reaction
        await zk.sendMessage(dest, {
            react: { text: "🔍", key: ms.key }
        });

        // Send searching message
        await repondre(`┏━❑ 𝚂𝙴𝙰𝚁𝙲𝙷𝙸𝙽𝙶 ━━━━━━━━━
┃ 🔍 *${q}*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);

        let videoData = null;

        // Check if it's a direct YouTube URL
        if (q.includes('youtube.com') || q.includes('youtu.be')) {
            const videoId = q.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];

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
            // Search for the song
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

        const videoUrl = videoData.url;
        const title = videoData.title || 'Unknown Title';
        const thumbnail = videoData.thumbnail || videoData.image;
        const duration = videoData.seconds ? formatDuration(videoData.seconds) : (videoData.timestamp || 'N/A');
        const views = videoData.views ? formatViews(videoData.views) : 'N/A';
        const author = videoData.author?.name || 'Unknown Artist';
        const uploaded = videoData.ago || 'N/A';

        // Random thumbnail for external ad reply
        const randomThumb = getRandomThumbnail();

        // Encode data for buttons (Base64)
        const encodedUrl = Buffer.from(videoUrl).toString('base64');
        const encodedTitle = Buffer.from(title).toString('base64');
        const encodedAuthor = Buffer.from(author).toString('base64');
        const encodedThumb = Buffer.from(thumbnail).toString('base64');

        // Create buttons for download options
        const buttons = [
            {
                buttonId: `${prefixe}audiostream ${encodedUrl} ${encodedTitle} ${encodedAuthor} ${encodedThumb}`,
                buttonText: { displayText: "🎵 𝙰𝚄𝙳𝙸𝙾 𝙼𝙿𝟹" },
                type: 1
            },
            {
                buttonId: `${prefixe}audiodoc ${encodedUrl} ${encodedTitle} ${encodedAuthor} ${encodedThumb}`,
                buttonText: { displayText: "📄 𝙰𝚄𝙳𝙸𝙾 𝙳𝙾𝙲" },
                type: 1
            }
        ];

        // Create caption with song info
        const caption = `┏━❑ 𝚂𝙾𝙽𝙶𝟸 𝙸𝙽𝙵𝙾 ━━━━━━━━━
┃ 🎵 *𝚃𝚒𝚝𝚕𝚎:* ${title.substring(0, 40)}${title.length > 40 ? '...' : ''}
┃ 👤 *𝙰𝚛𝚝𝚒𝚜𝚝:* ${author.substring(0, 30)}${author.length > 30 ? '...' : ''}
┃ ⏱️ *𝙳𝚞𝚛𝚊𝚝𝚒𝚘𝚗:* ${duration}
┃ 👁️ *𝚅𝚒𝚎𝚠𝚜:* ${views}
┃ 📅 *𝚄𝚙𝚕𝚘𝚊𝚍𝚎𝚍:* ${uploaded}
┃ 🔗 *𝚄𝚁𝙻:* ${videoUrl}
┗━━━━━━━━━━━━━━━━━━━━

📋 *𝙲𝚑𝚘𝚘𝚜𝚎 𝚏𝚘𝚛𝚖𝚊𝚝 𝚋𝚎𝚕𝚘𝚠:*
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`;

        // Send image with buttons
        const buttonMessage = {
            image: { url: thumbnail },
            caption: caption,
            footer: "𝚂𝙸𝙻𝙰-𝙼𝙳 𝙱𝙾𝚃 © 2026",
            buttons: buttons,
            headerType: 4,
            contextInfo: {
                mentionedJid: [nomAuteurMessage],
                externalAdReply: {
                    title: `🎵 ${title.substring(0, 30)}${title.length > 30 ? '...' : ''}`,
                    body: `👤 ${author.substring(0, 25)}${author.length > 25 ? '...' : ''} | ⏱️ ${duration}`,
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: randomThumb,
                    sourceUrl: videoUrl,
                    renderLargerThumbnail: false,
                }
            }
        };

        await zk.sendMessage(dest, buttonMessage, { quoted: fkontak });

        // Change reaction to success
        await zk.sendMessage(dest, {
            react: { text: "✅", key: ms.key }
        });

    } catch (e) {
        console.log("❌ Song2 Command Error: " + e);
        await zk.sendMessage(dest, {
            react: { text: "❌", key: ms.key }
        });
        await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message.substring(0, 50)}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }
});

// ============================================
// AUDIO STREAM BUTTON HANDLER
// ============================================
silamd({
    nomCom: 'audiostream',
    alias: ['audiomp3'],
    reaction: '🎵',
    desc: 'Handle audio stream button',
    Categorie: 'download',
    fromMe: 'true',
    dontAddCommandList: true
},
async (dest, zk, commandeOptions) => {
    try {
        // TUMIA COMMANDOPTIONS KAMILI
        const { ms, arg, repondre, nomAuteurMessage } = commandeOptions;
        
        // CHECK KWENYE MSG OBJECT
        if (!ms) {
            console.log("❌ ms is undefined in audiostream");
            return;
        }

        if (!arg[0]) return;

        // Decode the data from button
        const [encodedUrl, encodedTitle, encodedAuthor, encodedThumb] = arg;
        const videoUrl = Buffer.from(encodedUrl, 'base64').toString('utf-8');
        const title = Buffer.from(encodedTitle, 'base64').toString('utf-8');
        const author = Buffer.from(encodedAuthor, 'base64').toString('utf-8');
        const thumbnail = Buffer.from(encodedThumb, 'base64').toString('utf-8');

        // SEND REACTION - TUMIA ms.key
        await zk.sendMessage(dest, {
            react: { text: "⬇️", key: ms.key }
        });

        await repondre(`┏━❑ 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙸𝙽𝙶 ━━━━━━━━━
┃ 🎵 *${title.substring(0, 30)}${title.length > 30 ? '...' : ''}*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);

        // Download and send as audio stream
        const fallbackApi = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
        const fallbackResponse = await axios.get(fallbackApi, { timeout: 30000 });
        const fallbackData = fallbackResponse.data;

        if (fallbackData?.status && fallbackData.audio) {
            await zk.sendMessage(dest, {
                audio: { url: fallbackData.audio },
                mimetype: "audio/mpeg",
                fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`,
                contextInfo: {
                    externalAdReply: {
                        title: `🎵 ${title.substring(0, 30)}${title.length > 30 ? '...' : ''}`,
                        body: `👤 ${author.substring(0, 25)}${author.length > 25 ? '...' : ''}`,
                        mediaType: 1,
                        previewType: 0,
                        thumbnailUrl: thumbnail,
                        sourceUrl: videoUrl,
                        renderLargerThumbnail: false,
                    }
                }
            }, { quoted: fkontak });

            // SEND SUCCESS REACTION
            await zk.sendMessage(dest, {
                react: { text: "✅", key: ms.key }
            });

        } else {
            throw new Error('No audio URL found');
        }

    } catch (e) {
        console.log("❌ Audio Stream Error: " + e);
        if (commandeOptions?.ms) {
            await zk.sendMessage(dest, {
                react: { text: "❌", key: commandeOptions.ms.key }
            });
        }
        if (commandeOptions?.repondre) {
            await commandeOptions.repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }
    }
});

// ============================================
// AUDIO DOC BUTTON HANDLER
// ============================================
silamd({
    nomCom: 'audiodoc',
    alias: ['audiodocument'],
    reaction: '📄',
    desc: 'Handle audio document button',
    Categorie: 'download',
    fromMe: 'true',
    dontAddCommandList: true
},
async (dest, zk, commandeOptions) => {
    try {
        // TUMIA COMMANDOPTIONS KAMILI
        const { ms, arg, repondre, nomAuteurMessage } = commandeOptions;
        
        // CHECK KWENYE MSG OBJECT
        if (!ms) {
            console.log("❌ ms is undefined in audiodoc");
            return;
        }

        if (!arg[0]) return;

        // Decode the data from button
        const [encodedUrl, encodedTitle, encodedAuthor, encodedThumb] = arg;
        const videoUrl = Buffer.from(encodedUrl, 'base64').toString('utf-8');
        const title = Buffer.from(encodedTitle, 'base64').toString('utf-8');
        const author = Buffer.from(encodedAuthor, 'base64').toString('utf-8');
        const thumbnail = Buffer.from(encodedThumb, 'base64').toString('utf-8');

        // SEND REACTION - TUMIA ms.key
        await zk.sendMessage(dest, {
            react: { text: "⬇️", key: ms.key }
        });

        await repondre(`┏━❑ 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙸𝙽𝙶 ━━━━━━━━━
┃ 📄 *${title.substring(0, 30)}${title.length > 30 ? '...' : ''}*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);

        // Download and send as document
        const fallbackApi = `https://yt-dl.officialhectormanuel.workers.dev/?url=${encodeURIComponent(videoUrl)}`;
        const fallbackResponse = await axios.get(fallbackApi, { timeout: 30000 });
        const fallbackData = fallbackResponse.data;

        if (fallbackData?.status && fallbackData.audio) {
            await zk.sendMessage(dest, {
                document: { url: fallbackData.audio },
                mimetype: "audio/mpeg",
                fileName: `${title.substring(0, 50).replace(/[^\w\s]/gi, '')}.mp3`,
                contextInfo: {
                    externalAdReply: {
                        title: `📄 ${title.substring(0, 30)}${title.length > 30 ? '...' : ''}`,
                        body: `👤 ${author.substring(0, 25)}${author.length > 25 ? '...' : ''}`,
                        mediaType: 1,
                        previewType: 0,
                        thumbnailUrl: thumbnail,
                        sourceUrl: videoUrl,
                        renderLargerThumbnail: false,
                    }
                }
            }, { quoted: fkontak });

            // SEND SUCCESS REACTION
            await zk.sendMessage(dest, {
                react: { text: "✅", key: ms.key }
            });

        } else {
            throw new Error('No audio URL found');
        }

    } catch (e) {
        console.log("❌ Audio Document Error: " + e);
        if (commandeOptions?.ms) {
            await zk.sendMessage(dest, {
                react: { text: "❌", key: commandeOptions.ms.key }
            });
        }
        if (commandeOptions?.repondre) {
            await commandeOptions.repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚍𝚘𝚠𝚗𝚕𝚘𝚊𝚍
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }
    }
});