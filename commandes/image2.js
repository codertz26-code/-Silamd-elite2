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

// ── Image search command with carousel ─────────────────────────────────
sila({
    nomCom: 'image2',
    alias: ['image2', 'images2', 'img', 'pic'],
    desc: 'Search for images (carousel view)',
    Categorie: 'Images',
    reaction: '🖼️',
    fromMe: 'false'
}, async (dest, zk, commandeOptions) => {
    const { repondre, ms, arg } = commandeOptions;

    if (!arg[0]) {
        return repondre(`┏━❑ 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷 ━━━━━━━━━
┃ 🖼️ *Please provide an image name!*
┃ 📝 *Example:* *${conf.prefix}image2 beautiful nature*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }

    const searchTerm = arg.join(" ");
    
    // Send loading message
    await zk.sendMessage(dest, {
        text: `
┃ ⏳ *sila is searching for:* ${searchTerm}
`
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

        // Create carousel cards (maximum 10 images)
        const cards = [];
        const maxImages = Math.min(results.length, 10);

        for (let i = 0; i < maxImages; i++) {
            const result = results[i];
            if (!result || !result.url) continue;

            // Get image dimensions
            let dimensions = "Unknown";
            if (result.width && result.height) {
                dimensions = `${result.width} x ${result.height}`;
            }

            cards.push({
                header: `🖼️ *Image ${i + 1}/${maxImages}*`,
                body: {
                    text: `┏━❑ 𝙸𝙼𝙰𝙶𝙴 𝙳𝙴𝚃𝙰𝙸𝙻𝚂 ━━━━━━━
┃ 📌 *Search:* ${searchTerm}
┃ 📏 *Size:* ${dimensions}
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
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                            display_text: "🔗 Open Image",
                            url: result.url
                        })
                    },
                    {
                        name: "cta_copy",
                        buttonParamsJson: JSON.stringify({
                            display_text: "📋 Copy URL",
                            id: "copy_url",
                            copy_code: result.url
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

        // Send as interactive carousel message
        await zk.sendMessage(dest, {
            interactiveMessage: {
                header: {
                    title: `┏━❑ 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷 𝚁𝙴𝚂𝚄𝙻𝚃𝚂 ━━━━━━━
┃ 🖼️ *${cards.length} images found for:* ${searchTerm}
┃ 👆 *Swipe left/right to view more*
┗━━━━━━━━━━━━━━━━━━━━`,
                    hasMediaAttachment: false
                },
                body: {
                    text: `📱 *Use buttons below each image*`
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
                                                title: "🔍 New Search",
                                                description: "Search for different images",
                                                id: `new_search_${Date.now()}`
                                            },
                                            {
                                                title: "📋 Get All URLs",
                                                description: "View all image URLs",
                                                id: `get_urls_${Date.now()}`
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

        // Send summary message after carousel
        setTimeout(async () => {
            await zk.sendMessage(dest, {
                text: `┏━❑ 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴 ━━━━━━━━━
┃ ✅ *Found ${results.length} images total*
┃ 🖼️ *Displayed ${cards.length} images in carousel*
┃ 👆 *Swipe left/right to scroll through images*
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
