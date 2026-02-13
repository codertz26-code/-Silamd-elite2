const { silamd } = require("../silamd/sila");

sila({ nomCom: 'gstatus',
    alias: ['status', 'gbstatus'],
    reaction: '📢',
    desc: 'Post a status message into the group',
    Categorie: 'Group',
    fromMe: 'false'
},
async(dest, zk, commandeOptions) => {
    try {
        const { ms, arg, repondre, nomAuteurMessage, quoted } = commandeOptions;

        if (!ms.isGroup) return await repondre('❌ 𝚃𝚑𝚒𝚜 𝚌𝚘𝚖𝚖𝚊𝚗𝚍 𝚠𝚘𝚛𝚔𝚜 𝚘𝚗𝚕𝚢 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙𝚜');

        const text = arg.join(' ').trim();
        if (!text && !(quoted && (quoted.text || quoted.image || quoted.video))) {
            return await repondre(`┏━❑ 𝐇𝐎𝐖 𝐓𝐎 𝐔𝐒𝐄 ━━━━━━━━━\n┃ ✦ ${commandeOptions.prefixe}gstatus Your status message here\n┃ ✦ Reply to a message with ${commandeOptions.prefixe}gstatus to post it\n┗━━━━━━━━━━━━━━━━\n> © Powered by Sila Tech`);
        }

        // Build message to post in group
        const payload = text ? { text: `📢 𝐆𝐫𝐨𝐮𝐩 𝐒𝐭𝐚𝐭𝐮𝐬:\n\n${text}\n\n— ${nomAuteurMessage}` } : { text: `📢 𝐆𝐫𝐨𝐮𝐩 𝐒𝐭𝐚𝐭𝐮𝐬 (forwarded):\n\n— ${nomAuteurMessage}` };

        await zk.sendMessage(dest, payload, { quoted: ms });

        await repondre('✅ 𝚂𝚝𝚊𝚝𝚞𝚜 𝚑𝚊𝚟𝚎 𝚋𝚎𝚎𝚗 𝚙𝚘𝚜𝚝𝚎𝚍 𝚒𝚗 𝚝𝚑𝚒𝚜 𝚐𝚛𝚘𝚞𝚙');

    } catch (error) {
        console.error('gstatus error:', error.message);
        repondre(`❌ 𝙴𝚛𝚛𝚘𝚛: ${error.message}`);
    }
});
