const { silamd } = require("../silamd/sila");

// FakevCard sawa na index
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

sila({
    nomCom: 'hidetag',
    alias: ['hidetag', 'htag'],
    reaction: '👥',
    desc: '𝚃𝚊𝚐 𝚊𝚕𝚕 𝚖𝚎𝚖𝚋𝚎𝚛𝚜 𝚠𝚒𝚝𝚑𝚘𝚞𝚝 𝚍𝚒𝚜𝚙𝚕𝚊𝚢𝚒𝚗𝚐 𝚕𝚒𝚜𝚝',
    Categorie: 'Group',
    fromMe: 'false' // Group admins can use
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre, arg, verifGroupe, verifAdmin, superUser, infosGroupe, nomAuteurMessage } = commandeOptions;
    
    // Check if it's a group
    if (!verifGroupe) {
        return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚌𝚊𝚗 𝚘𝚗𝚕𝚢 𝚋𝚎 𝚞𝚜𝚎𝚍 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙𝚜
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }

    // Check if user is admin or owner
    if (!verifAdmin && !superUser) {
        return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝙾𝚗𝚕𝚢 𝚐𝚛𝚘𝚞𝚙 𝚊𝚍𝚖𝚒𝚗𝚜 𝚌𝚊𝚗 𝚞𝚜𝚎 𝚝𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }

    // Get message to send
    const messageText = arg.length > 0 ? arg.join(' ') : '';

    if (!messageText) {
        return await repondre(`┏━❑ 𝚄𝚂𝙰𝙶𝙴 ━━━━━━━━━
┃ 📝 𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚘 𝚝𝚊𝚐 𝚠𝚒𝚝𝚑
┃ 
┃ 𝙴𝚡𝚊𝚖𝚙𝚕𝚎:
┃ ${prefixe}hidetag 𝙷𝚎𝚕𝚕𝚘 𝚎𝚟𝚎𝚛𝚢𝚘𝚗𝚎!
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }

    // Get all group participants
    const participants = infosGroupe.participants;
    const totalMembers = participants.length;
    
    // Prepare mentions array (all participants)
    const mentions = participants.map(p => p.id);

    // Count admins
    const admins = participants.filter(p => p.admin).length;

    // Create message
    const fullMessage = `┏━❑ 𝙷𝙸𝙳𝙴 𝚃𝙰𝙶 ━━━━━━━━━
┃ 📢 *𝙼𝚎𝚜𝚜𝚊𝚐𝚎:* ${messageText}
┃ 
┃ 👥 *𝙶𝚛𝚘𝚞𝚙:* ${infosGroupe.subject}
┃ 📊 *𝚃𝚘𝚝𝚊𝚕:* ${totalMembers} members
┃ 👑 *𝙰𝚍𝚖𝚒𝚗𝚜:* ${admins}
┃ 👤 *𝚂𝚎𝚗𝚝 𝚋𝚢:* @${nomAuteurMessage}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`;

    // Send message with all mentions (without listing numbers)
    await zk.sendMessage(dest, {
        text: fullMessage,
        mentions: mentions,
        contextInfo: {
            mentionedJid: mentions,
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363402325089913@newsletter',
                newsletterName: '© 𝚂𝙸𝙻𝙰 𝙼𝙳',
                serverMessageId: 143,
            },
            externalAdReply: {
                title: `👥 𝙷𝚒𝚍𝚎 𝚃𝚊𝚐 - ${totalMembers} 𝙼𝚎𝚖𝚋𝚎𝚛𝚜`,
                body: infosGroupe.subject,
                mediaType: 1,
                previewType: 0,
                thumbnailUrl: await zk.profilePictureUrl(dest, 'image').catch(() => 'https://files.catbox.moe/36vahk.png'),
                sourceUrl: 'https://github.com/',
                renderLargerThumbnail: false,
            }
        }
    }, { quoted: fkontak });

    // Log action
    console.log(`✅ Hidetag executed in ${infosGroupe.subject} by ${nomAuteurMessage}`);

} catch (e) {
    console.log("❌ Hidetag Command Error: " + e);
    await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
}
});