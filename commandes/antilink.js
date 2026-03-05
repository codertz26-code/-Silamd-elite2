const { silamd } = require("../silamd/sila");
const fs = require('fs-extra');
const path = require('path');

// Antilink storage path
const antilinkPath = path.join(__dirname, '../database/antilink.json');

// Load antilink settings
const loadAntilink = () => {
    try {
        if (fs.existsSync(antilinkPath)) {
            return JSON.parse(fs.readFileSync(antilinkPath, 'utf8'));
        }
    } catch (e) {
        console.log('Error loading antilink:', e);
    }
    return {};
};

// Save antilink settings
const saveAntilink = (data) => {
    try {
        fs.ensureDirSync(path.join(__dirname, '../database'));
        fs.writeFileSync(antilinkPath, JSON.stringify(data, null, 2));
    } catch (e) {
        console.log('Error saving antilink:', e);
    }
};

silamd({
    nomCom: 'antilink',
    alias: ['antilink', 'antilien', 'antilinks'],
    reaction: '🔗',
    desc: 'Enable/disable anti-link feature in group',
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
        const option = args[1] ? args[1].toLowerCase() : '';
        
        if (!action || (action !== 'on' && action !== 'off' && action !== 'status' && action !== 'action')) {
            return repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 𝙷𝙴𝙻𝙿 ━━━━━━━━━
┃ 📝 *Usage:*
┃ ${prefixe}antilink on
┃ ${prefixe}antilink off
┃ ${prefixe}antilink status
┃ ${prefixe}antilink action delete
┃ ${prefixe}antilink action warn
┃ 
┃ 📋 *Actions:*
┃ • delete - Delete link only
┃ • warn - Delete + warn (removes after 3 warns)
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        // Load current settings
        const allSettings = loadAntilink();
        const groupId = dest;
        
        if (!allSettings[groupId]) {
            allSettings[groupId] = {
                enabled: false,
                action: 'delete',
                warnedUsers: {}
            };
        }

        // Handle action change
        if (action === 'action') {
            if (option !== 'delete' && option !== 'warn') {
                return repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ Invalid action! Use: delete or warn
┗━━━━━━━━━━━━━━━━━━━━`);
            }
            
            allSettings[groupId].action = option;
            saveAntilink(allSettings);
            
            return repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 ━━━━━━━━━
┃ ✅ Anti-link action set to: *${option.toUpperCase()}*
┃ 📁 *Group:* ${groupId}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        // Handle status check
        if (action === 'status') {
            const status = allSettings[groupId].enabled ? '🟢 ENABLED' : '🔴 DISABLED';
            const currentAction = allSettings[groupId].action || 'delete';
            
            return repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 𝚂𝚃𝙰𝚃𝚄𝚂 ━━━━━━━━━
┃ 📊 *Status:* ${status}
┃ ⚙️ *Action:* ${currentAction.toUpperCase()}
┃ 📁 *Group:* ${groupId}
┃ 
┃ 📝 *Use ${prefixe}antilink on/off to change*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
        }

        // Enable/disable
        allSettings[groupId].enabled = (action === 'on');
        saveAntilink(allSettings);

        const statusEmoji = action === 'on' ? '🟢' : '🔴';
        const statusText = action === 'on' ? 'ENABLED' : 'DISABLED';

        repondre(`┏━❑ 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 ━━━━━━━━━
┃ ${statusEmoji} *Anti-Link ${statusText}!*
┃ ⚙️ *Action:* ${allSettings[groupId].action?.toUpperCase() || 'DELETE'}
┃ 📁 *Group:* ${groupId}
┃ 
┃ ✅ Successfully turned ${action}!
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);

    } catch (e) {
        console.log('❌ Antilink Command Error:', e);
        repondre(`┏━❑ 𝙴𝚁𝚁𝙾𝚁 ━━━━━━━━━
┃ ❌ ${e.message}
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`);
    }
});
