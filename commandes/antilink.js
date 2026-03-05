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
        console.log('Error loading antiall:', e);
    }
    return {};
};

// Save anti-features settings
const saveAntiFeatures = (data) => {
    try {
        fs.ensureDirSync(path.join(__dirname, '../database'));
        fs.writeFileSync(antiFeaturesPath, JSON.stringify(data, null, 2));
    } catch (e) {
        console.log('Error saving antiall:', e);
    }
};

sila({
    nomCom: 'antiall',
    alias: ['antiall', 'anti-all', 'antitotal'],
    reaction: '🛡️',
    desc: 'Enable/disable all anti-features at once',
    Categorie: 'Group',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, repondre, args, verifGroupe, verifAdmin, superUser, prefixe } = commandeOptions;

        // Check if in group
        if (!verifGroupe) {
            return repondre('┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━\n┃ ❌ This command can only be used in groups!\n┗━━━━━━━━━━━━━━━━━━━━');
        }

        // Allow if superUser OR admin
        if (!superUser && !verifAdmin) {
            return repondre('┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━\n┃ ❌ Only group admins and owners can use this command!\n┗━━━━━━━━━━━━━━━━━━━━');
        }

        const action = args[0] ? args[0].toLowerCase() : '';
        
        if (!action || (action !== 'on' && action !== 'off' && action !== 'status')) {
            return repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙰𝙻𝙻 𝙷𝙴𝙻𝙿 ━━━━━━━━━
┃ 📝 *Usage:*
┃ ${prefixe}antiall on  (Turn on ALL)
┃ ${prefixe}antiall off (Turn off ALL)
┃ ${prefixe}antiall status
┃ 
┃ 📋 *Features included:*
┃ • Anti-Tag
┃ • Anti-Media
┃ • Anti-Spam
┃ • Anti-Bug
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
            let features = '';
            features += `\n┃ • Anti-Tag: ${allSettings[groupId].antitag ? '✅' : '❌'}`;
            features += `\n┃ • Anti-Media: ${allSettings[groupId].antimedia ? '✅' : '❌'}`;
            features += `\n┃ • Anti-Spam: ${allSettings[groupId].antispam ? '✅' : '❌'}`;
            features += `\n┃ • Anti-Bug: ${allSettings[groupId].antibug ? '✅' : '❌'}`;
            
            return repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙰𝙻𝙻 𝚂𝚃𝙰𝚃𝚄𝚂 ━━━━━━━━━
┃ 📁 *Group:* ${groupId}
┃ 📋 *Features:${features}
┃ 
┃ 📝 *Use ${prefixe}antiall on/off to toggle all*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        // Enable/disable ALL features
        const newStatus = (action === 'on');
        
        // Set all anti-features
        allSettings[groupId].antitag = newStatus;
        allSettings[groupId].antimedia = newStatus;
        allSettings[groupId].antispam = newStatus;
        allSettings[groupId].antibug = newStatus;
        
        saveAntiFeatures(allSettings);

        const statusEmoji = newStatus ? '🟢' : '🔴';
        const statusText = newStatus ? 'ENABLED' : 'DISABLED';

        repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙰𝙻𝙻 ━━━━━━━━━
┃ ${statusEmoji} *All Anti-Features ${statusText}!*
┃ 📁 *Group:* ${groupId}
┃ 
┃ ✅ Successfully turned ${action}:
┃ • Anti-Tag: ${newStatus ? '✅' : '❌'}
┃ • Anti-Media: ${newStatus ? '✅' : '❌'}
┃ • Anti-Spam: ${newStatus ? '✅' : '❌'}
┃ • Anti-Bug: ${newStatus ? '✅' : '❌'}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);

    } catch (e) {
        console.log('❌ Antiall Command Error:', e);
        repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }
});
