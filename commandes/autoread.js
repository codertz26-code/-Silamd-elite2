const { silamd } = require("../silamd/sila");
const fs = require('fs');
const path = require('path');

sila({ nomCom: 'autoread',
    desc: 'Toggle Auto Read (on/off)',
    Categorie: 'Config',
    reaction: '🔁',
    fromMe: 'true',

}, async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre, prefixe } = commandeOptions;
    const file = path.join(__dirname, '..', 'features.json');
    let features = {};
    if (fs.existsSync(file)) features = JSON.parse(fs.readFileSync(file));
    const key = 'AUTO_READ_STATUS';
    const current = features[key] || 'yes';
    // If no arg provided, send interactive buttons
    if (!arg || arg.length === 0) {
        const buttons = [
            { buttonId: `${prefixe}autoread on`, buttonText: { displayText: '✅ On' }, type: 1 },
            { buttonId: `${prefixe}autoread off`, buttonText: { displayText: '❌ Off' }, type: 1 }
        ];
        const caption = `AUTO_READ_STATUS is currently: ${current}\nChoose an option:`;
        await zk.sendMessage(dest, { text: caption, footer: 'Toggle Auto Read', buttons: buttons, headerType: 1 }, { quoted: ms });
        return;
    }

    let next = current === 'yes' ? 'no' : 'yes';
    if (arg) {
        const a = arg.toString().toLowerCase();
        if (a === 'on' || a === 'yes') next = 'yes';
        if (a === 'off' || a === 'no') next = 'no';
    }
    features[key] = next;
    fs.writeFileSync(file, JSON.stringify(features, null, 2));
    repondre(`AUTO_READ_STATUS set to ${next}`);
});
