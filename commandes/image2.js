const { silamd } = require("../silamd/sila");
const gis = require("g-i-s");
const axios = require("axios");
const conf = require(__dirname + "/../set");

// FakeVCard kwa ajili ya reply (kama ilivyo kwenye alive.js)
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

// ── Random image list for thumbnail ─────────────────────────────────────────────
const njabulox = [
  "https://files.catbox.moe/xjeyjh.jpg",
  "https://files.catbox.moe/mh36c7.jpg",
  "https://files.catbox.moe/u6v5ir.jpg",
  "https://files.catbox.moe/bnb3vx.jpg",
];
const randomNjabulourl = njabulox[Math.floor(Math.random() * njabulox.length)];

// ── Image search command with carousel cards ─────────────────────────────────
sila({
    nomCom: '𝚒𝚖𝚊𝚐𝚎2',
    alias: ['image2', 'images2', 'img', 'pic'],
    desc: 'Search for images (carousel view)',
    Categorie: 'Images',
    reaction: '🖼️',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre, ms, arg } = commandeOptions;

    if (!arg[0]) {
        return repondre(`┏━❑ 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷 ━━━━━━━━━
┃ 🖼️ *Please provide a search term!*
┃ 📝 Example: *${conf.prefix}𝚒𝚖𝚊𝚐𝚎 beautiful nature*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }

    const searchTerm = arg.join(" ");
    const loadingMsg = await repondre(`┏━❑ 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷 ━━━━━━━━━
┃ ⏳ *Searching for:* ${searchTerm}
┃ 🖼️ *Please wait...*
┗━━━━━━━━━━━━━━━━━━━━`);

    try {
        const results = await new Promise((resolve, reject) => {
            gis(searchTerm, (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });

        if (!results || results.length === 0) {
            await repondre(`┏━❑ 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷 ━━━━━━━━━
┃ ❌ *No images found for:* ${searchTerm}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
            return;
        }

        // Delete loading message
        try {
            await zk.deleteMessage(dest, loadingMsg.key);
        } catch (e) {}

        // Create carousel cards (maximum 10 images)
        const cards = [];
        const maxImages = Math.min(results.length, 10);

        for (let i = 0; i < maxImages; i++) {
            const result = results[i];
            if (!result || !result.url) continue;

            // Create a card for each image
            cards.push({
                header: `🖼️ *Image ${i + 1}/${maxImages}*`,
                body: {
                    text: `┏━❑ 𝙸𝙼𝙰𝙶𝙴 𝚁𝙴𝚂𝚄𝙻𝚃 ━━━━━━━━━
┃ 📌 *Title:* ${searchTerm}
┃ 📏 *Size:* ${result.width || 'Unknown'}x${result.height || 'Unknown'}
┃ 🎨 *Quality:* High HD
┃ 🔗 *URL:* ${result.url}
┗━━━━━━━━━━━━━━━━━━━━`
                },
                media: {
                    image: {
                        url: result.url
                    }
                },
                buttons: [
                    {
                        name: "cta_copy",
                        buttonParamsJson: JSON.stringify({
                            display_text: "📋 Copy URL",
                            id: "copy_url",
                            copy_code: result.url
                        })
                    },
                    {
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "🔗 Open Image",
                            url: result.url
                        })
                    }
                ]
            });
        }

        if (cards.length === 0) {
            return repondre(`┏━❑ 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷 ━━━━━━━━━
┃ ❌ *No valid images found!*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        // Send as interactive carousel
        await zk.sendMessage(dest, {
            interactiveMessage: {
                header: {
                    title: `┏━❑ 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷 𝚁𝙴𝚂𝚄𝙻𝚃𝚂 ━━━━━━━━━
┃ 🖼️ *Found ${cards.length} images for:* ${searchTerm}
┃ 👆 *Swipe left/right to view more*
┗━━━━━━━━━━━━━━━━━━━━`,
                    hasMediaAttachment: false
                },
                body: {
                    text: `📱 *Use the buttons below each image*`
                },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: "single_select",
                            buttonParamsJson: JSON.stringify({
                                title: "📱 More Options",
                                sections: [
                                    {
                                        title: "Image Options",
                                        rows: [
                                            {
                                                title: "Search New Image",
                                                description: "Search for different images",
                                                id: "new_search"
                                            },
                                            {
                                                title: "View in Browser",
                                                description: "Open all images in browser",
                                                id: "browser_view"
                                            }
                                        ]
                                    }
                                ]
                            })
                        }
                    ]
                },
                carouselMessage: {
                    cards: cards
                }
            }
        }, { quoted: fkontak });

        // Optional: Send a follow-up message with search summary
        setTimeout(async () => {
            await zk.sendMessage(dest, {
                text: `┏━❑ 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴 ━━━━━━━━━
┃ ✅ *Found ${cards.length} images*
┃ 🔍 *Search term:* ${searchTerm}
┃ 👆 *Swipe left/right to view all images*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`
            }, { quoted: fkontak });
        }, 1000);

    } catch (error) {
        console.error("Image search error:", error);
        await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ *Error searching images:*
┃ ${error.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        
        // Delete loading message if it exists
        try {
            await zk.deleteMessage(dest, loadingMsg.key);
        } catch (e) {}
    }
});