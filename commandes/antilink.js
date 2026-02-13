const { silamd } = require("../silamd/sila");
const fs = require("fs-extra");
const path = require("path");

const thumbnails = [
    "https://files.catbox.moe/krnlo3.jpeg",
    "https://files.catbox.moe/36vahk.png"
];

const randomThumbnail = thumbnails[Math.floor(Math.random() * thumbnails.length)];
const AUDIO_URL = "https://files.catbox.moe/7ydtb3.mp3";

// Store antilink settings
const antilinkFile = path.join(__dirname, '../bdd/antilink.json');

const getAntilinkSettings = () => {
    try {
        if (fs.existsSync(antilinkFile)) {
            return JSON.parse(fs.readFileSync(antilinkFile, 'utf8'));
        }
    } catch (e) {
        console.log("Error reading antilink settings:", e);
    }
    return {};
};

const saveAntilinkSettings = (data) => {
    try {
        fs.ensureDirSync(path.dirname(antilinkFile));
        fs.writeFileSync(antilinkFile, JSON.stringify(data, null, 2));
    } catch (e) {
        console.log("Error saving antilink settings:", e);
    }
};

sila({ nomCom: 'antilink',
    desc: 'Delete links automatically from group',
    Categorie: 'Group',
    reaction: '🔗', 
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, prefixe, isAdminMessage, isGroupMessage } = commandeOptions;
    
    try {
        if (!isGroupMessage) {
            return await repondre("❌ This command is only for groups");
        }

        if (!isAdminMessage) {
            return await repondre("❌ Only admins can use this command");
        }

        const settings = getAntilinkSettings();
        const groupId = dest;
        const isEnabled = settings[groupId];

        const buttons = [
            { buttonId: `${prefixe}antilink on`, buttonText: { displayText: "✅ Turn ON" }, type: 1 },
            { buttonId: `${prefixe}antilink off`, buttonText: { displayText: "❌ Turn OFF" }, type: 1 }
        ];

        // Audio message
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
                    title: `🔗 Antilink System`,
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

        // Button message
        await zk.sendMessage(dest, {
            image: { url: randomThumbnail },
            caption: `╔════════════════════════════════╗
║  🔗 ANTILINK SETTINGS 🔗  ║
╚════════════════════════════════╝

*Current Status:* ${isEnabled ? '✅ ON' : '❌ OFF'}

This feature automatically deletes links posted in the group.

Choose an option:

✅ Turn ON - Delete all links
❌ Turn OFF - Allow links`,
            footer: "SILA-MD Antilink © 2026",
            buttons: buttons,
            headerType: 4
        });

        // Handle sub-commands
        if (arg && arg.length > 0) {
            const subCommand = arg[0].toLowerCase();
            
            if (subCommand === 'on') {
                settings[groupId] = true;
                saveAntilinkSettings(settings);
                await repondre("✅ Antilink activated! Links will be deleted automatically.");
            } else if (subCommand === 'off') {
                settings[groupId] = false;
                saveAntilinkSettings(settings);
                await repondre("❌ Antilink deactivated! Links are now allowed.");
            }
        }

    } catch (e) {
        console.log("❌ Antilink Command Error: " + e);
        repondre("❌ Error: " + e.message);
    }
});
