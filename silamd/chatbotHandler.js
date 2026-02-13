const axios = require('axios');
const fs = require('fs');
const path = require('path');

const thumbnails = [
    "https://files.catbox.moe/krnlo3.jpeg",
    "https://files.catbox.moe/36vahk.png"
];

const randomThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)];
const AUDIO_URL = "https://files.catbox.moe/7ydtb3.mp3";

// Get AI response using GPT5 API
const getAIResponse = async (message) => {
    try {
        const response = await axios.get(
            `https://api.yupra.my.id/api/ai/gpt5?text=${encodeURIComponent(message.trim())}`
        );
        return response.data?.result || response.data?.response || "I couldn't understand that, please try again.";
    } catch (error) {
        console.log("AI API Error:", error);
        return "Sorry, I'm having trouble thinking right now. Please try again later.";
    }
};

// Check if chatbot is enabled
const isChatbotEnabled = (dest) => {
    try {
        const file = path.join(__dirname, '../features.json');
        if (fs.existsSync(file)) {
            const features = JSON.parse(fs.readFileSync(file, 'utf8'));
            const key = `CHATBOT_${dest}`;
            return features[key] === 'yes' || features.CHATBOT === 'yes';
        }
    } catch (e) {
        console.log("Error checking chatbot:", e);
    }
    return false;
};

// Handle chatbot response with format
const respondWithChatbot = async (dest, zk, message, isGroup = false) => {
    try {
        if (!isChatbotEnabled(dest)) return false;

        const aiResponse = await getAIResponse(message);

        // Send audio message first
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
                    title: `🤖 SILA-MD AI Response`,
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: randomThumbnail,
                    renderLargerThumbnail: true,
                },
            },
        }, { quoted: {
            key: {
                fromMe: false,
                participant: `0@s.whatsapp.net`,
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: "𝐒𝐈𝐋𝐀-𝐌𝐃",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nN:𝐒𝐈𝐋𝐀-𝐌𝐃;BOT;;;\nFN:𝐒𝐈𝐋𝐀-𝐌𝐃\nitem1.TEL;waid=255789661031:+255789661031\nitem1.X-ABLabel:Bot\nEND:VCARD`
                }
            }
        } });

        // Then send the text response
        await zk.sendMessage(dest, {
            text: `🤖 *AI Response*\n\n${aiResponse}`,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402325089913@newsletter',
                    newsletterName: "➤®𝐒𝐈𝐋𝐀-𝐌𝐃",
                    serverMessageId: 143,
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: `🤖 SILA-MD AI`,
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: randomThumbnail,
                    renderLargerThumbnail: true,
                },
            },
        });

        return true;
    } catch (error) {
        console.log("Chatbot response error:", error);
        return false;
    }
};

module.exports = {
    getAIResponse,
    isChatbotEnabled,
    respondWithChatbot
};
