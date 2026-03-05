const { silamd } = require("../silamd/sila");
const fs = require('fs-extra');
const path = require('path');

// Anti-features storage path
const antiFeaturesPath = path.join(__dirname, '../database/antifeatures.json');

// Load anti-features settings
const loadAntiFeatures = () => {
    try {
        if (fs.existsSync(antiFeaturesPath)) {
            return JSON.parse(fs.readFileSync(antiFeaturesPath, 'utf8'));
        }
    } catch (e) {
        console.log('Error loading antibug:', e);
    }
    return {};
};

// Save anti-features settings
const saveAntiFeatures = (data) => {
    try {
        fs.ensureDirSync(path.join(__dirname, '../database'));
        fs.writeFileSync(antiFeaturesPath, JSON.stringify(data, null, 2));
    } catch (e) {
        console.log('Error saving antibug:', e);
    }
};

silamd({
    nomCom: 'antibug',
    alias: ['antibug', 'anticrash'],
    reaction: '🐛',
    desc: 'Enable/disable anti-bug feature in group',
    Categorie: 'Group',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, repondre, args, verifGroupe, verifAdmin } = commandeOptions;

        // Check if in group
        if (!verifGroupe) {
            return repondre('┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━\n┃ ❌ This command can only be used in groups!\n┗━━━━━━━━━━━━━━━━━━━━');
        }

        // Check if user is admin
        if (!verifAdmin) {
            return repondre('┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━\n┃ ❌ Only group admins can use this command!\n┗━━━━━━━━━━━━━━━━━━━━');
        }

        const action = args[0] ? args[0].toLowerCase() : '';
        
        if (!action || (action !== 'on' && action !== 'off' && action !== 'status')) {
            return repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙱𝚄𝙶 𝙷𝙴𝙻𝙿 ━━━━━━━━━
┃ 📝 *Usage:*
┃ ${commandeOptions.prefixe}antibug on
┃ ${commandeOptions.prefixe}antibug off
┃ ${commandeOptions.prefixe}antibug status
┃ 
┃ 📋 *What it blocks:*
┃ • Protocol messages (delete/edit)
┃ • Reaction messages
┃ • Poll messages
┃ • Payment messages
┃ • Order messages
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        // Load current settings
        const allSettings = loadAntiFeatures();
        const groupId = dest;
        
        if (!allSettings[groupId]) {
            allSettings[groupId] = {};
        }

        // Handle status check
        if (action === 'status') {
            const status = allSettings[groupId].antibug ? '🟢 ENABLED' : '🔴 DISABLED';
            return repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙱𝚄𝙶 𝚂𝚃𝙰𝚃𝚄𝚂 ━━━━━━━━━
┃ 📊 *Status:* ${status}
┃ 📁 *Group:* ${groupId}
┃ 
┃ 📝 *Use ${commandeOptions.prefixe}antibug on/off to change*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        // Enable/disable
        allSettings[groupId].antibug = (action === 'on');
        saveAntiFeatures(allSettings);

        const statusEmoji = action === 'on' ? '🟢' : '🔴';
        const statusText = action === 'on' ? 'ENABLED' : 'DISABLED';

        repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙱𝚄𝙶 ━━━━━━━━━
┃ ${statusEmoji} *Anti-Bug ${statusText}!*
┃ 📁 *Group:* ${groupId}
┃ 
┃ ✅ Successfully turned ${action}!
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);

    } catch (e) {
        console.log('❌ Antibug Command Error:', e);
        repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }
});
