const { silamd } = require("../silamd/sila");

// Store anti-media settings for groups
const antiMediaSettings = new Map(); // { groupId: { status: boolean, allowedTypes: [] } }

// Media types to check
const mediaTypes = [
    'imageMessage',
    'videoMessage',
    'audioMessage',
    'stickerMessage',
    'documentMessage'
];

silamd({
    nomCom: 'antimedia',
    alias: ['antimedia', 'antivideo', 'antiimg', 'antiaudio', 'antisticker', 'antidoc'],
    reaction: '🛡️',
    desc: 'Delete all media in group (ON/OFF)',
    Categorie: 'Group',
    fromMe: 'true'
},
async(dest, zk, commandeOptions) => {
    try {
        const { ms, repondre, args, prefixe, verifGroupe } = commandeOptions;

        // Check if in group
        if (!verifGroupe) {
            return repondre('┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━\n┃ ❌ This command can only be used in groups!\n┗━━━━━━━━━━━━━━━━━━━━');
        }

        const groupId = dest;
        const action = args[0] ? args[0].toLowerCase() : '';
        const mediaType = args[1] ? args[1].toLowerCase() : 'all';

        // Initialize settings for group if not exists
        if (!antiMediaSettings.has(groupId)) {
            antiMediaSettings.set(groupId, {
                status: false,
                allowedTypes: [], // Empty means block all types
                notified: false
            });
        }

        const settings = antiMediaSettings.get(groupId);

        // Show current status
        if (action === 'status' || !action) {
            const statusText = settings.status ? '🟢 ENABLED' : '🔴 DISABLED';
            let typesText = '';
            
            if (settings.status) {
                if (settings.allowedTypes.length === 0) {
                    typesText = '🚫 All media types are blocked';
                } else {
                    typesText = `✅ Only blocking: ${settings.allowedTypes.join(', ')}`;
                }
            }

            return repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙼𝙴𝙳𝙸𝙰 𝚂𝚃𝙰𝚃𝚄𝚂 ━━━
┃ 📊 *Status:* ${statusText}
┃ 📁 *Group:* ${groupId}
┃ ${typesText}
┃ 
┃ 📝 *Usage:*
┃ ${prefixe}antimedia on
┃ ${prefixe}antimedia off
┃ ${prefixe}antimedia on all
┃ ${prefixe}antimedia on image
┃ ${prefixe}antimedia on video
┃ ${prefixe}antimedia on audio
┃ ${prefixe}antimedia on sticker
┃ ${prefixe}antimedia on document
┃ ${prefixe}antimedia status
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        // Handle ON/OFF
        if (action === 'on' || action === 'off') {
            const newStatus = action === 'on';
            
            // Check for specific media type
            if (newStatus && mediaType !== 'all') {
                // Validate media type
                const validTypes = ['image', 'video', 'audio', 'sticker', 'document'];
                if (validTypes.includes(mediaType)) {
                    settings.allowedTypes = [mediaType];
                } else {
                    return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ Invalid media type!
┃ ✅ Use: image, video, audio, sticker, document
┗━━━━━━━━━━━━━━━━━━━━`);
                }
            } else if (newStatus && mediaType === 'all') {
                settings.allowedTypes = []; // Block all
            } else if (!newStatus) {
                settings.allowedTypes = []; // Reset when off
            }

            settings.status = newStatus;
            settings.notified = false; // Reset notification flag
            antiMediaSettings.set(groupId, settings);

            const statusEmoji = newStatus ? '🟢' : '🔴';
            const typeText = newStatus ? 
                (mediaType === 'all' ? 'ALL media' : `${mediaType} media`) : 
                'media protection';

            return repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙼𝙴𝙳𝙸𝙰 ━━━━━━━━━
┃ ${statusEmoji} *Status:* ${newStatus ? 'ON' : 'OFF'}
┃ 📁 *Type:* ${typeText}
┃ 
┃ ✅ Successfully ${newStatus ? 'activated' : 'deactivated'}!
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

    } catch (e) {
        console.log("❌ Antimedia Error:", e);
        repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }
});

// Anti-media detection and deletion
silamd({
    nomCom: '_antimediaHandler',
    fromMe: 'false',
    Categorie: 'Système',
    dontAddCommandList: true // Hide from menu
},
async(dest, zk, commandeOptions) => {
    try {
        const { ms, verifGroupe, isBotAdmin } = commandeOptions;
        
        // Only process in groups
        if (!verifGroupe) return;
        
        const groupId = dest;
        
        // Check if anti-media is enabled for this group
        if (!antiMediaSettings.has(groupId)) return;
        
        const settings = antiMediaSettings.get(groupId);
        if (!settings.status) return;
        
        // Check if bot is admin (required to delete messages)
        if (!isBotAdmin) {
            // Notify once when bot is not admin
            if (!settings.notified) {
                await zk.sendMessage(groupId, { 
                    text: '⚠️ *Anti-Media Warning:*\nI need to be admin to delete media messages!' 
                });
                settings.notified = true;
                antiMediaSettings.set(groupId, settings);
            }
            return;
        }

        // Check if message has media
        const message = ms.message || ms;
        let hasMedia = false;
        let mediaType = '';
        let mediaMessage = null;

        for (const type of mediaTypes) {
            if (message[type]) {
                hasMedia = true;
                mediaType = type.replace('Message', '');
                mediaMessage = message[type];
                break;
            }
        }

        // Check for quoted media
        if (!hasMedia && message.extendedTextMessage?.contextInfo?.quotedMessage) {
            const quoted = message.extendedTextMessage.contextInfo.quotedMessage;
            for (const type of mediaTypes) {
                if (quoted[type]) {
                    hasMedia = true;
                    mediaType = type.replace('Message', '');
                    mediaMessage = quoted[type];
                    break;
                }
            }
        }

        // If has media, check if it should be deleted
        if (hasMedia) {
            // Check if this media type is allowed
            const shouldDelete = settings.allowedTypes.length === 0 || // Block all
                                settings.allowedTypes.includes(mediaType); // Block specific type
            
            if (shouldDelete) {
                // Get message info for deletion
                const messageId = ms.key.id;
                const participant = ms.key.participant || ms.key.remoteJid;
                
                // Delete the message
                await zk.sendMessage(groupId, { 
                    delete: { 
                        remoteJid: groupId, 
                        fromMe: false, 
                        id: messageId,
                        participant: participant
                    } 
                });

                // Send warning to user (with small delay to avoid rate limiting)
                setTimeout(async () => {
                    try {
                        const sender = ms.pushName || participant.split('@')[0];
                        await zk.sendMessage(groupId, { 
                            text: `⚠️ @${participant.split('@')[0]} *${mediaType.toUpperCase()}* is not allowed in this group!`,
                            mentions: [participant]
                        });
                    } catch (e) {
                        console.log("Warning send error:", e);
                    }
                }, 500);
            }
        }

    } catch (e) {
        console.log("❌ Anti-media Handler Error:", e);
    }
});
