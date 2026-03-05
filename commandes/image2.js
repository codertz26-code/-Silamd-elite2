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

// ── Image search command ─────────────────────────────────
sila({
    nomCom: 'image2',
    alias: ['image2', 'images2', 'img', 'pic'],
    desc: 'Search for images',
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
        text: `┏━❑ 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷 ━━━━━━━━━
┃ ⏳ *sila is searching for:* ${searchTerm}
┃ 🖼️ *Please wait...*
┗━━━━━━━━━━━━━━━━━━━━`
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

        // Create vCard contacts for scrolling
        const contacts = [];
        const maxImages = Math.min(results.length, 10); // Maximum 10 images
        
        for (let i = 0; i < maxImages; i++) {
            const result = results[i];
            if (!result || !result.url) continue;
            
            // Create vCard for each image
            const vcard = 'BEGIN:VCARD\n'
                + 'VERSION:3.0\n'
                + `FN:Image ${i + 1} - ${searchTerm}\n`
                + `ORG:SILA-MD Image Search;\n`
                + `TEL;type=CELL;type=VOICE;waid=255123456789:+255 123 456 789\n`
                + 'END:VCARD';
            
            contacts.push({
                displayName: `🖼️ Image ${i + 1}`,
                vcard: vcard
            });
        }

        // Send images with contacts for scrolling
        await zk.sendMessage(dest, {
            contacts: {
                displayName: `${maxImages} Images Found`,
                contacts: contacts
            }
        }, { quoted: fkontak });

        // Send a summary message
        await zk.sendMessage(dest, {
            text: `┏━❑ 𝙸𝙼𝙰𝙶𝙴 𝚂𝙴𝙰𝚁𝙲𝙷 𝚁𝙴𝚂𝚄𝙻𝚃𝚂 ━━━━━━━━━
┃ ✅ *Found ${results.length} images for:* ${searchTerm}
┃ 🖼️ *Displayed ${maxImages} images*
┃ 👆 *Scroll through contacts to view images*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`
        }, { quoted: fkontak });

    } catch (error) {
        console.error("Image search error:", error);
        await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ *Error searching images:*
┃ ${error.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }
});
