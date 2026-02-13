const { silamd } = require("../silamd/sila");
const { exec } = require('child_process');

// FakevCard kama ulivyotaka
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
    nomCom: 'restart',
    alias: ['reboot', 'refresh'],
    reaction: '🔄',
    desc: 'Restart bot',
    Categorie: 'Owner',
    fromMe: 'true'  // Only owner can use this command
},
async(dest, zk, commandeOptions) => {
try{
    const { ms, repondre, nomAuteurMessage } = commandeOptions;

    // Send restarting message
    await zk.sendMessage(dest, {
        text: `┏━❑ 𝐑𝐄𝐒𝐓𝐀𝐑𝐓 ━━━━━━━━━
┃ 🔄 *Restarting bot...*
┃ ⏱️ Please wait a moment
┃ 📢 Bot will be back online shortly
┗━━━━━━━━━━━━━━━━━━━━

> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐒𝐢𝐥𝐚 𝐓𝐞𝐜𝐡`,
        contextInfo: {
            mentionedJid: [dest],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363402325089913@newsletter',
                newsletterName: '© 𝐒𝐈𝐋𝐀 𝐌𝐃',
                serverMessageId: 143,
            }
        }
    }, { quoted: fkontak });

    // Check if running with pm2
    exec('pm2 pid index', (error, stdout, stderr) => {
        if (error || !stdout.trim()) {
            // Not running with pm2, use process.exit
            setTimeout(() => {
                process.exit(1);
            }, 2000);
        } else {
            // Running with pm2, restart all
            exec('pm2 restart all', (err, out, serr) => {
                if (err) {
                    // If pm2 restart fails, fallback to process.exit
                    setTimeout(() => {
                        process.exit(1);
                    }, 2000);
                }
            });
        }
    });

} catch (e) {
    console.log("❌ Restart Command Error: " + e);
    await repondre(`┏━❑ 𝐄𝐑𝐑𝐎𝐑 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐒𝐢𝐥𝐚 𝐓𝐞𝐜𝐡`);
}
});