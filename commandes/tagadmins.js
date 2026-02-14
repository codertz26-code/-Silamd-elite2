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
    nomCom: 'tagadmins',
    alias: ['tagadmin', 'admins', 'tagad'],
    reaction: '👑',
    desc: '𝚃𝚊𝚐 𝚊𝚕𝚕 𝚐𝚛𝚘𝚞𝚙 𝚊𝚍𝚖𝚒𝚗𝚜',
    Categorie: 'Group',
    fromMe: 'false' // Group members can use
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre, arg, verifGroupe, infosGroupe, nomAuteurMessage } = commandeOptions;
    
    // Check if it's a group
    if (!verifGroupe) {
        return await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚌𝚊𝚗 𝚘𝚗𝚕𝚢 𝚋𝚎 𝚞𝚜𝚎𝚍 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙𝚜
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }

    // Get message to send (if any)
    const messageText = arg.length > 0 ? arg.join(' ') : '';

    // Get all group participants
    const participants = infosGroupe.participants;
    
    // Filter admins only
    const admins = participants.filter(p => p.admin);
    const adminIds = admins.map(p => p.id);
    const totalAdmins = admins.length;

    // Prepare list of admins for display
    let adminsList = '';
    admins.forEach((p, index) => {
        const number = p.id.split('@')[0];
        adminsList += `${index + 1}. 👑 @${number}\n`;
    });

    // Create message
    const header = messageText ? `📢 *𝙼𝚎𝚜𝚜𝚊𝚐𝚎:* ${messageText}\n\n` : '';
    
    const fullMessage = `┏━❑ 𝙶𝚁𝙾𝚄𝙿 𝙰𝙳𝙼𝙸𝙽𝚂 ━━━━━━━━━
┃ 👥 *𝙶𝚛𝚘𝚞𝚙:* ${infosGroupe.subject}
┃ 📊 *𝚃𝚘𝚝𝚊𝚕 𝙰𝚍𝚖𝚒𝚗𝚜:* ${totalAdmins}
┃ 👤 *𝚃𝚊𝚐𝚐𝚎𝚍 𝚋𝚢:* @${nomAuteurMessage}
┗━━━━━━━━━━━━━━━━━━━━

${header}━━━━━━━━━━━━━━━━━━━━
${adminsList}
━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`;

    // Send message with admin mentions
    await zk.sendMessage(dest, {
        text: fullMessage,
        mentions: adminIds,
        contextInfo: {
            mentionedJid: adminIds,
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363402325089913@newsletter',
                newsletterName: '© 𝚂𝙸𝙻𝙰 𝙼𝙳',
                serverMessageId: 143,
            },
            externalAdReply: {
                title: `👑 𝚃𝚊𝚐𝚐𝚒𝚗𝚐 ${totalAdmins} 𝙰𝚍𝚖𝚒𝚗𝚜`,
                body: infosGroupe.subject,
                mediaType: 1,
                previewType: 0,
                thumbnailUrl: await zk.profilePictureUrl(dest, 'image').catch(() => 'https://files.catbox.moe/36vahk.png'),
                sourceUrl: 'https://github.com/',
                renderLargerThumbnail: false,
            }
        }
    }, { quoted: fkontak });

} catch (e) {
    console.log("❌ Tagadmins Command Error: " + e);
    await repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
}
});