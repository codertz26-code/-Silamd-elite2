const { sila } = require("../silamd/sila");
const gis = require("g-i-s");
const axios = require("axios");
const conf = require(__dirname + "/../set");

// FakeVCard kwa ajili ya reply
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

// ── Image search command with carousel cards ─────────────────────────────────
sila({
    nomCom: 'image2',
    alias: ['image2', 'images2', 'img', 'pic'],
    desc: 'Search for images (carousel view)',
    Categorie: 'Images',
    reaction: '🖼️',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre, ms, arg, prefixe } = commandeOptions;

    if (!arg[0]) {
        return repondre(`┏━❑ 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷 ━━━━━━━━━
┃ 🖼️ *Please provide an image name!*
┃ 📝 *Example:* *${prefixe}image2 beautiful nature*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }

    const searchTerm = arg.join(" ");
    const userName = dest.split('@')[0];
    
    // Send loading message
    const loadingMsg = await zk.sendMessage(dest, { 
        text: `sila is searching for: ${searchTerm}` 
    }, { quoted: fkontak });

    try {
        const results = await new Promise((resolve, reject) => {
            gis(searchTerm, (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });

        if (!results || results.length === 0) {
            return repondre(`┏━❑ 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷 ━━━━━━━━━
┃ ❌ *No images found for:* ${searchTerm}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        // Delete loading message
        await zk.sendMessage(dest, { delete: loadingMsg.key });

        // Create carousel cards for images
        const cards = [];
        const maxImages = Math.min(results.length, 10); // Maximum 10 images

        for (let i = 0; i < maxImages; i++) {
            const result = results[i];
            if (!result || !result.url) continue;

            // Get image dimensions
            const dimensions = (result.width && result.height) 
                ? `${result.width} x ${result.height}` 
                : "Unknown";

            // Create card for each image
            cards.push({
                body: {
                    text: `┏━❑ 🖼️ 𝙸𝙼𝙰𝙶𝙴 ${i + 1}/${maxImages} ━━━━━━━━━
┃ 📌 *Search:* ${searchTerm}
┃ 📏 *Size:* ${dimensions}
┃ 🔗 *URL:* ${result.url}
┗━━━━━━━━━━━━━━━━━━━━`
                },
                footer: {
                    text: "◀️ 𝚂𝚠𝚒𝚙𝚎 𝚏𝚘𝚛 𝚖𝚘𝚛𝚎 𝚒𝚖𝚊𝚐𝚎𝚜 ▶️"
                },
                header: {
                    title: `🖼️ 𝙸𝙼𝙰𝙶𝙴 ${i + 1}`,
                    hasMediaAttachment: true,
                    image: {
                        url: result.url
                    }
                },
                nativeFlowMessage: {
                    buttons: [
                        {
                            name: "cta_url",
                            buttonParamsJson: JSON.stringify({
                                display_text: "🔗 𝙾𝙿𝙴𝙽 𝙸𝙼𝙰𝙶𝙴",
                                url: result.url
                            })
                        },
                        {
                            name: "cta_copy",
                            buttonParamsJson: JSON.stringify({
                                display_text: "📋 𝙲𝙾𝙿𝚈 𝚄𝚁𝙻",
                                id: "copy_url",
                                copy_code: result.url
                            })
                        },
                        {
                            name: "quick_reply",
                            buttonParamsJson: JSON.stringify({
                                display_text: "🔄 𝙽𝙴𝚆 𝚂𝙴𝙰𝚁𝙲𝙷",
                                id: `${prefixe}image2`
                            })
                        }
                    ]
                }
            });
        }

        if (cards.length === 0) {
            return repondre(`┏━❑ 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷 ━━━━━━━━━
┃ ❌ *No valid images found!*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        // Create interactive carousel message
        const interactiveMessage = {
            body: {
                text: `┏━❑ 🖼️ 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷 ━━━━━━━━━
┃ 👋 Hello, *${userName}*!
┃ 
┃ 🔍 *Search term:* ${searchTerm}
┃ 📊 *Found:* ${results.length} images
┃ 🖼️ *Showing:* ${cards.length} images
┃ 
┃ 𝚂𝚠𝚒𝚙𝚎 𝚕𝚎𝚏𝚝/𝚛𝚒𝚐𝚑𝚝 𝚝𝚘 𝚟𝚒𝚎𝚠 𝚒𝚖𝚊𝚐𝚎𝚜
┗━━━━━━━━━━━━━━━━━━━━`
            },
            footer: {
                text: "◀️ 𝚂𝚕𝚒𝚍𝚎 𝚏𝚘𝚛 𝚖𝚘𝚛𝚎 𝚒𝚖𝚊𝚐𝚎𝚜 ▶️"
            },
            header: {
                title: "🖼️ 𝚂𝙸𝙻𝙰-𝙼𝙳 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷",
                hasMediaAttachment: false
            },
            carouselMessage: {
                cards: cards
            }
        };

        // Send the interactive carousel message
        await zk.sendMessage(dest, {
            interactiveMessage: interactiveMessage
        }, { quoted: fkontak });

        // Send completion message
        setTimeout(async () => {
            await zk.sendMessage(dest, {
                text: `┏━❑ 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴 ━━━━━━━━━
┃ ✅ Found *${results.length}* images total
┃ 🖼️ Displayed *${cards.length}* images in carousel
┃ 👆 Swipe left/right to scroll through images
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
    }
});
