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
    nomCom: 'tagall',
    alias: ['tagall', 'mentionall', 'everyone', 'all'],
    reaction: '📢',
    desc: '𝚃𝚊𝚐 𝚊𝚕𝚕 𝚐𝚛𝚘𝚞𝚙 𝚖𝚎𝚖𝚋𝚎𝚛𝚜',
    Categorie: 'Group',
    fromMe: 'false' // Group admins can use
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre, prefixe, arg, verifGroupe, verifAdmin, superUser, infosGroupe, nomAuteurMessage } = commandeOptions;
    
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

    // Get all group participants
    const participants = infosGroupe.participants;
    const totalMembers = participants.length;
    
    // Get message to send (if any)
    const messageText = arg.length > 0 ? arg.join(' ') : '';

    // Prepare mentions array (all participants)
    const mentions = participants.map(p => p.id);
    
    // Prepare list of numbers for display
    let numbersList = '';
    participants.forEach((p, index) => {
        const number = p.id.split('@')[0];
        const isAdmin = p.admin ? '👑' : '';
        numbersList += `${index + 1}. ${isAdmin} @${number}\n`;
    });

    // Count admins
    const admins = participants.filter(p => p.admin).length;

    // Create message
    const header = messageText ? `📢 *𝙼𝚎𝚜𝚜𝚊𝚐𝚎:* ${messageText}\n\n` : '';
    
    const fullMessage = `┏━❑ 𝙶𝚁𝙾𝚄𝙿 𝙼𝙴𝙼𝙱𝙴𝚁𝚂 ━━━━━━━━━
┃ 👥 *𝙶𝚛𝚘𝚞𝚙:* ${infosGroupe.subject}
┃ 📊 *𝚃𝚘𝚝𝚊𝚕:* ${totalMembers} members
┃ 👑 *𝙰𝚍𝚖𝚒𝚗𝚜:* ${admins}
┃ 👤 *𝚃𝚊𝚐𝚐𝚎𝚍 𝚋𝚢:* @${nomAuteurMessage}
┗━━━━━━━━━━━━━━━━━━━━

${header}━━━━━━━━━━━━━━━━━━━━
${numbersList}
━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`;

    // Send message with all mentions
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
                title: `📢 𝚃𝚊𝚐𝚐𝚒𝚗𝚐 ${totalMembers} 𝙼𝚎𝚖𝚋𝚎𝚛𝚜`,
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
    console.log(`✅ Tagall executed in ${infosGroupe.subject} by ${nomAuteurMessage}`);

} catch (e) {
    console.log("❌ Tagall Command Error: " + e);
    await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
}
});