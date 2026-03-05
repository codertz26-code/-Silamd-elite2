const { silamd } = require("../silamd/sila");

silamd({
    nomCom: 'add',
    alias: ['add', '+'],
    reaction: '➕',
    desc: 'Add a member to the group',
    Categorie: 'Group',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, repondre, args, verifGroupe, verifAdmin, verifZokouAdmin, auteurMessage, superUser } = commandeOptions;

        if (!verifGroupe) {
            return repondre('This command can only be used in groups.');
        }

        if (!superUser && !verifAdmin) {
            return repondre('Only group admins can use this command.');
        }

        if (!verifZokouAdmin) {
            return repondre('I need to be admin to add members.');
        }

        if (!args[0]) {
            return repondre('Please provide a number to add.\nExample: add 255712345678');
        }

        const number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        
        try {
            await zk.groupParticipantsUpdate(dest, [number], 'add');
            repondre(`@${args[0]} has been added to the group.`);
        } catch (e) {
            repondre('Failed to add member. Make sure the number is valid and has WhatsApp.');
        }
    } catch (e) {
        console.log('Add command error:', e);
        repondre('An error occurred while processing the command.');
    }
});

silamd({
    nomCom: 'kick',
    alias: ['kick', 'remove', '-'],
    reaction: '👢',
    desc: 'Remove a member from the group',
    Categorie: 'Group',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, repondre, args, verifGroupe, verifAdmin, verifZokouAdmin, msgRepondu, auteurMsgRepondu, superUser } = commandeOptions;

        if (!verifGroupe) {
            return repondre('This command can only be used in groups.');
        }

        if (!superUser && !verifAdmin) {
            return repondre('Only group admins can use this command.');
        }

        if (!verifZokouAdmin) {
            return repondre('I need to be admin to kick members.');
        }

        let usersToKick = [];

        if (msgRepondu) {
            usersToKick.push(auteurMsgRepondu);
        } else if (args[0]) {
            const mentioned = ms.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (mentioned.length > 0) {
                usersToKick = mentioned;
            } else {
                const number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                usersToKick.push(number);
            }
        } else {
            return repondre('Please reply to a message or mention someone to kick.');
        }

        for (let user of usersToKick) {
            try {
                await zk.groupParticipantsUpdate(dest, [user], 'remove');
            } catch (e) {
                console.log('Error kicking:', user, e);
            }
        }

        repondre(`Kicked ${usersToKick.length} member(s) from the group.`);
    } catch (e) {
        console.log('Kick command error:', e);
        repondre('An error occurred while processing the command.');
    }
});

silamd({
    nomCom: 'left',
    alias: ['left', 'leftmembers'],
    reaction: '🚪',
    desc: 'Get list of members who left the group',
    Categorie: 'Group',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, repondre, verifGroupe, superUser } = commandeOptions;

        if (!verifGroupe) {
            return repondre('This command can only be used in groups.');
        }

        repondre('This feature is coming soon.');
    } catch (e) {
        console.log('Left command error:', e);
        repondre('An error occurred while processing the command.');
    }
});

silamd({
    nomCom: 'leave',
    alias: ['leave', 'exit'],
    reaction: '👋',
    desc: 'Bot leaves the group',
    Categorie: 'Group',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, repondre, verifGroupe, superUser, verifAdmin } = commandeOptions;

        if (!verifGroupe) {
            return repondre('This command can only be used in groups.');
        }

        if (!superUser && !verifAdmin) {
            return repondre('Only group admins can make me leave.');
        }

        await repondre('Goodbye! 👋');
        await zk.groupLeave(dest);
    } catch (e) {
        console.log('Leave command error:', e);
        repondre('An error occurred while processing the command.');
    }
});

silamd({
    nomCom: 'link',
    alias: ['link', 'grouplink', 'invite'],
    reaction: '🔗',
    desc: 'Get group invite link',
    Categorie: 'Group',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, repondre, verifGroupe, verifAdmin, verifZokouAdmin, superUser } = commandeOptions;

        if (!verifGroupe) {
            return repondre('This command can only be used in groups.');
        }

        if (!superUser && !verifAdmin) {
            return repondre('Only group admins can get the invite link.');
        }

        if (!verifZokouAdmin) {
            return repondre('I need to be admin to get the invite link.');
        }

        const link = await zk.groupInviteCode(dest);
        repondre(`https://chat.whatsapp.com/${link}`);
    } catch (e) {
        console.log('Link command error:', e);
        repondre('Failed to get group link. Make sure I am admin.');
    }
});

silamd({
    nomCom: 'join',
    alias: ['join', 'joinlink'],
    reaction: '🔗',
    desc: 'Join a group using invite link',
    Categorie: 'Owner',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, repondre, args, superUser } = commandeOptions;

        if (!superUser) {
            return repondre('Only the bot owner can use this command.');
        }

        if (!args[0]) {
            return repondre('Please provide a group link.\nExample: join https://chat.whatsapp.com/xxxxxx');
        }

        let link = args[0];
        const match = link.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
        
        if (!match) {
            return repondre('Invalid group link.');
        }

        const code = match[1];

        try {
            const response = await zk.groupAcceptInvite(code);
            repondre('Successfully joined the group!');
        } catch (e) {
            repondre('Failed to join the group. Make sure the link is valid.');
        }
    } catch (e) {
        console.log('Join command error:', e);
        repondre('An error occurred while processing the command.');
    }
});

silamd({
    nomCom: 'promote',
    alias: ['promote', 'admin'],
    reaction: '👑',
    desc: 'Promote member to admin',
    Categorie: 'Group',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, repondre, verifGroupe, verifAdmin, verifZokouAdmin, msgRepondu, auteurMsgRepondu, args, superUser } = commandeOptions;

        if (!verifGroupe) {
            return repondre('This command can only be used in groups.');
        }

        if (!superUser && !verifAdmin) {
            return repondre('Only group admins can promote members.');
        }

        if (!verifZokouAdmin) {
            return repondre('I need to be admin to promote members.');
        }

        let userToPromote = null;

        if (msgRepondu) {
            userToPromote = auteurMsgRepondu;
        } else if (args[0]) {
            const mentioned = ms.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (mentioned.length > 0) {
                userToPromote = mentioned[0];
            } else {
                const number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                userToPromote = number;
            }
        } else {
            return repondre('Please reply to a message or mention someone to promote.');
        }

        try {
            await zk.groupParticipantsUpdate(dest, [userToPromote], 'promote');
            repondre(`@${userToPromote.split('@')[0]} has been promoted to admin.`);
        } catch (e) {
            repondre('Failed to promote member.');
        }
    } catch (e) {
        console.log('Promote command error:', e);
        repondre('An error occurred while processing the command.');
    }
});

silamd({
    nomCom: 'demote',
    alias: ['demote', 'unadmin'],
    reaction: '👤',
    desc: 'Demote admin to member',
    Categorie: 'Group',
    fromMe: 'true'
},
async (dest, zk, commandeOptions) => {
    try {
        const { ms, repondre, verifGroupe, verifAdmin, verifZokouAdmin, msgRepondu, auteurMsgRepondu, args, superUser } = commandeOptions;

        if (!verifGroupe) {
            return repondre('This command can only be used in groups.');
        }

        if (!superUser && !verifAdmin) {
            return repondre('Only group admins can demote members.');
        }

        if (!verifZokouAdmin) {
            return repondre('I need to be admin to demote members.');
        }

        let userToDemote = null;

        if (msgRepondu) {
            userToDemote = auteurMsgRepondu;
        } else if (args[0]) {
            const mentioned = ms.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
            if (mentioned.length > 0) {
                userToDemote = mentioned[0];
            } else {
                const number = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                userToDemote = number;
            }
        } else {
            return repondre('Please reply to a message or mention someone to demote.');
        }

        try {
            await zk.groupParticipantsUpdate(dest, [userToDemote], 'demote');
            repondre(`@${userToDemote.split('@')[0]} has been demoted to member.`);
        } catch (e) {
            repondre('Failed to demote member.');
        }
    } catch (e) {
        console.log('Demote command error:', e);
        repondre('An error occurred while processing the command.');
    }
});
