"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const logger_1 = __importDefault(require("@whiskeysockets/baileys/lib/Utils/logger"));
const logger = logger_1.default.child({});
logger.level = 'silent';
const pino = require("pino");
const boom_1 = require("@hapi/boom");
const conf = require("./set");
const axios = require("axios");
let fs = require("fs-extra");
let path = require("path");
const FileType = require('file-type');
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const { verifierEtatJid , recupererActionJid } = require("./bdd/antilien");
const { atbverifierEtatJid , atbrecupererActionJid } = require("./bdd/antibot");
let evt = require(__dirname + "/silamd/sila");
const {isUserBanned , addUserToBanList , removeUserFromBanList} = require("./bdd/banUser");
const  {addGroupToBanList,isGroupBanned,removeGroupFromBanList} = require("./bdd/banGroup");
const {isGroupOnlyAdmin,addGroupToOnlyAdminList,removeGroupFromOnlyAdminList} = require("./bdd/onlyAdmin");
let { reagir } = require(__dirname + "/silamd/app");
var session = conf.session.replace(/Zokou-MD-WHATSAPP-BOT;;;=>/g,"");
const prefixe = conf.PREFIXE;
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

// ============================================
// 📌 ANTI-FEATURES STORAGE
// ============================================
const antiFeatures = {
    groups: new Map(), // Store settings per group
    spamTracker: new Map(), // For anti-spam
    warnTracker: new Map() // For warning counts
};

// ============================================
// 📌 FAKEVCARD MPYA
// ============================================
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

async function authentification() {
    try {
        if (!fs.existsSync(__dirname + "/auth/creds.json")) {
            console.log("connexion en cour ...");
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
        }
        else if (fs.existsSync(__dirname + "/auth/creds.json") && session != "zokk") {
            await fs.writeFileSync(__dirname + "/auth/creds.json", atob(session), "utf8");
        }
    }
    catch (e) {
        console.log("Session Invalid " + e);
        return;
    }
}
authentification();

const store = (0, baileys_1.makeInMemoryStore)({
    logger: pino().child({ level: "silent", stream: "store" }),
});

setTimeout(() => {
    async function main() {
        const { version, isLatest } = await (0, baileys_1.fetchLatestBaileysVersion)();
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(__dirname + "/auth");
        const sockOptions = {
            version,
            logger: pino({ level: "silent" }),
            browser: ['Sila-Md', "safari", "1.0.0"],
            printQRInTerminal: true,
            fireInitQueries: false,
            shouldSyncHistoryMessage: true,
            downloadHistory: true,
            syncFullHistory: true,
            generateHighQualityLinkPreview: true,
            markOnlineOnConnect: false,
            keepAliveIntervalMs: 30_000,
            auth: {
                creds: state.creds,
                keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
            },
            getMessage: async (key) => {
                if (store) {
                    const msg = await store.loadMessage(key.remoteJid, key.id, undefined);
                    return msg.message || undefined;
                }
                return {
                    conversation: 'An Error Occurred, Repeat Command!'
                };
            }
        };
        const zk = (0, baileys_1.default)(sockOptions);
        store.bind(zk.ev);

        const buttons = [
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: "View Channel",
                    id: "backup channel",
                    url: conf.GURL,
                }),
            },
        ];

        // List of image URLs
        const njabulox = [
            "https://files.catbox.moe/krnlo3.jpeg",
            "https://files.catbox.moe/36vahk.png",
            "https://files.catbox.moe/j7kue0.jpeg",
            "https://files.catbox.moe/edcfwx.jpeg",
            "https://files.catbox.moe/98k75b.jpeg"
        ];

        // Select a random image file
        const randomNjabulourl = njabulox[Math.floor(Math.random() * njabulox.length)];

        // ============================================
        // 📌 CHATBOT SYSTEM (Auto-reply without prefix)
        // ============================================
        const chatbotResponses = {
            "hello": "𝙷𝚎𝚕𝚕𝚘! 𝙷𝚘𝚠 𝚌𝚊𝚗 𝙸 𝚑𝚎𝚕𝚙 𝚢𝚘𝚞 𝚝𝚘𝚍𝚊𝚢?",
            "hi": "𝙷𝚒 𝚝𝚑𝚎𝚛𝚎! 𝙶𝚛𝚎𝚊𝚝 𝚝𝚘 𝚜𝚎𝚎 𝚢𝚘𝚞!",
            "hey": "𝙷𝚎𝚢! 𝚆𝚑𝚊𝚝'𝚜 𝚞𝚙?",
            "good morning": "𝙶𝚘𝚘𝚍 𝚖𝚘𝚛𝚗𝚒𝚗𝚐! 𝙷𝚘𝚙𝚎 𝚢𝚘𝚞 𝚑𝚊𝚟𝚎 𝚊 𝚠𝚘𝚗𝚍𝚎𝚛𝚏𝚞𝚕 𝚍𝚊𝚢!",
            "good afternoon": "𝙶𝚘𝚘𝚍 𝚊𝚏𝚝𝚎𝚛𝚗𝚘𝚘𝚗! 𝙷𝚘𝚠 𝚒𝚜 𝚢𝚘𝚞𝚛 𝚍𝚊𝚢 𝚐𝚘𝚒𝚗𝚐?",
            "good evening": "𝙶𝚘𝚘𝚍 𝚎𝚟𝚎𝚗𝚒𝚗𝚐! 𝙷𝚘𝚙𝚎 𝚢𝚘𝚞 𝚑𝚊𝚍 𝚊 𝚐𝚛𝚎𝚊𝚝 𝚍𝚊𝚢!",
            "good night": "𝙶𝚘𝚘𝚍 𝚗𝚒𝚐𝚑𝚝! 𝚂𝚕𝚎𝚎𝚙 𝚝𝚒𝚐𝚑𝚝!",
            "how are you": "𝙸'𝚖 𝚍𝚘𝚒𝚗𝚐 𝚐𝚛𝚎𝚊𝚝, 𝚝𝚑𝚊𝚗𝚔𝚜 𝚏𝚘𝚛 𝚊𝚜𝚔𝚒𝚗𝚐!",
            "what's up": "𝙽𝚘𝚝 𝚖𝚞𝚌𝚑, 𝚓𝚞𝚜𝚝 𝚌𝚑𝚒𝚕𝚕𝚒𝚗𝚐 𝚊𝚗𝚍 𝚛𝚎𝚊𝚍𝚢 𝚝𝚘 𝚑𝚎𝚕𝚙!",
            "thanks": "𝚈𝚘𝚞'𝚛𝚎 𝚠𝚎𝚕𝚌𝚘𝚖𝚎! 𝙷𝚊𝚙𝚙𝚢 𝚝𝚘 𝚑𝚎𝚕𝚙!",
            "thank you": "𝙼𝚢 𝚙𝚕𝚎𝚊𝚜𝚞𝚛𝚎! 𝙰𝚗𝚢𝚝𝚑𝚒𝚗𝚐 𝚎𝚕𝚜𝚎?",
            "bye": "𝙶𝚘𝚘𝚍𝚋𝚢𝚎! 𝙷𝚊𝚟𝚎 𝚊 𝚐𝚛𝚎𝚊𝚝 𝚍𝚊𝚢!",
            "goodbye": "𝚂𝚎𝚎 𝚢𝚘𝚞 𝚕𝚊𝚝𝚎𝚛! 𝚃𝚊𝚔𝚎 𝚌𝚊𝚛𝚎!",
            "who are you": "𝙸'𝚖 *𝚂𝙸𝙻𝙰-𝙼𝙳*, 𝚊 𝚙𝚘𝚠𝚎𝚛𝚏𝚞𝚕 𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝚋𝚘𝚝 𝚌𝚛𝚎𝚊𝚝𝚎𝚍 𝚝𝚘 𝚊𝚜𝚜𝚒𝚜𝚝 𝚢𝚘𝚞!",
            "what can you do": "𝙸 𝚌𝚊𝚗 𝚍𝚘 𝚖𝚊𝚗𝚢 𝚝𝚑𝚒𝚗𝚐𝚜! 𝙳𝚘𝚠𝚗𝚕𝚘𝚊𝚍 𝚜𝚘𝚗𝚐𝚜, 𝚖𝚊𝚗𝚊𝚐𝚎 𝚐𝚛𝚘𝚞𝚙𝚜, 𝚊𝚗𝚜𝚠𝚎𝚛 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗𝚜, 𝚊𝚗𝚍 𝚖𝚞𝚌𝚑 𝚖𝚘𝚛𝚎!",
            "love you": "𝙰𝚠𝚠, 𝙸 𝚕𝚘𝚟𝚎 𝚢𝚘𝚞 𝚝𝚘𝚘! 💕",
            "sila": "𝚈𝚎𝚜, 𝚝𝚑𝚊𝚝'𝚜 𝚖𝚎! *𝚂𝙸𝙻𝙰-𝙼𝙳* 𝚊𝚝 𝚢𝚘𝚞𝚛 𝚜𝚎𝚛𝚟𝚒𝚌𝚎!",
            "bot": "𝙸'𝚖 𝚑𝚎𝚛𝚎! 𝙷𝚘𝚠 𝚌𝚊𝚗 𝙸 𝚊𝚜𝚜𝚒𝚜𝚝 𝚢𝚘𝚞?",
            "help": "𝚃𝚢𝚙𝚎 *${prefixe}menu* 𝚝𝚘 𝚜𝚎𝚎 𝚊𝚕𝚕 𝚖𝚢 𝚌𝚘𝚖𝚖𝚊𝚗𝚍𝚜!"
        };

        // ============================================
        // 📁 LOAD ANTI-FEATURES SETTINGS
        // ============================================
        function loadAntiFeatures() {
            try {
                if (fs.existsSync('./database/antifeatures.json')) {
                    const data = JSON.parse(fs.readFileSync('./database/antifeatures.json', 'utf8'));
                    for (const [groupId, settings] of Object.entries(data)) {
                        antiFeatures.groups.set(groupId, settings);
                    }
                }
            } catch (e) {
                console.log('Error loading anti-features:', e);
            }
        }

        function saveAntiFeatures() {
            try {
                const data = {};
                for (const [groupId, settings] of antiFeatures.groups) {
                    data[groupId] = settings;
                }
                fs.ensureDirSync('./database');
                fs.writeFileSync('./database/antifeatures.json', JSON.stringify(data, null, 2));
            } catch (e) {
                console.log('Error saving anti-features:', e);
            }
        }

        loadAntiFeatures();

        // ============================================
        // 📌 ANTI-FEATURES HANDLER FUNCTIONS
        // ============================================
        
        // Anti-tag handler
        const handleAntiTag = async (groupId, sender, isAdmin, msg) => {
            const settings = antiFeatures.groups.get(groupId) || {};
            if (!settings.antitag || isAdmin) return false;

            const hasMentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0 ||
                               msg.message?.imageMessage?.contextInfo?.mentionedJid?.length > 0 ||
                               msg.message?.videoMessage?.contextInfo?.mentionedJid?.length > 0;
            
            if (hasMentions) {
                await zk.sendMessage(groupId, {
                    delete: {
                        remoteJid: groupId,
                        fromMe: false,
                        id: msg.key.id,
                        participant: sender
                    }
                });
                return true;
            }
            return false;
        };

        // Anti-media handler
        const handleAntiMedia = async (groupId, sender, isAdmin, msg) => {
            const settings = antiFeatures.groups.get(groupId) || {};
            if (!settings.antimedia || isAdmin) return false;

            const hasMedia = msg.message?.imageMessage ||
                           msg.message?.videoMessage ||
                           msg.message?.audioMessage ||
                           msg.message?.documentMessage ||
                           msg.message?.stickerMessage;
            
            if (hasMedia) {
                await zk.sendMessage(groupId, {
                    delete: {
                        remoteJid: groupId,
                        fromMe: false,
                        id: msg.key.id,
                        participant: sender
                    }
                });
                return true;
            }
            return false;
        };

        // Anti-spam handler
        const handleAntiSpam = async (groupId, sender, isAdmin, msg) => {
            const settings = antiFeatures.groups.get(groupId) || {};
            if (!settings.antispam || isAdmin) return false;

            const now = Date.now();
            const userKey = `${groupId}:${sender}`;
            
            if (!antiFeatures.spamTracker.has(userKey)) {
                antiFeatures.spamTracker.set(userKey, {
                    count: 1,
                    lastMsg: now,
                    timer: setTimeout(() => antiFeatures.spamTracker.delete(userKey), 5000)
                });
                return false;
            }

            const userData = antiFeatures.spamTracker.get(userKey);
            
            if (now - userData.lastMsg > 5000) {
                clearTimeout(userData.timer);
                antiFeatures.spamTracker.set(userKey, {
                    count: 1,
                    lastMsg: now,
                    timer: setTimeout(() => antiFeatures.spamTracker.delete(userKey), 5000)
                });
                return false;
            }

            userData.count++;
            userData.lastMsg = now;

            if (userData.count > 5) {
                await zk.sendMessage(groupId, {
                    delete: {
                        remoteJid: groupId,
                        fromMe: false,
                        id: msg.key.id,
                        participant: sender
                    }
                });

                await zk.sendMessage(groupId, {
                    text: `⚠️ @${sender.split('@')[0]} *𝙰𝙽𝚃𝙸-𝚂𝙿𝙰𝙼*\n𝙿𝚕𝚎𝚊𝚜𝚎 𝚍𝚘𝚗'𝚝 𝚜𝚙𝚊𝚖!`,
                    mentions: [sender]
                });
                return true;
            }
            return false;
        };

        // Anti-bug handler
        const handleAntiBug = async (groupId, sender, isAdmin, msg) => {
            const settings = antiFeatures.groups.get(groupId) || {};
            if (!settings.antibug || isAdmin) return false;

            const isBugMessage = 
                msg.message?.protocolMessage ||
                msg.message?.reactionMessage ||
                msg.message?.pollCreationMessage ||
                msg.message?.pollUpdateMessage ||
                msg.message?.paymentMessage ||
                msg.message?.orderMessage;

            if (isBugMessage) {
                await zk.sendMessage(groupId, {
                    delete: {
                        remoteJid: groupId,
                        fromMe: false,
                        id: msg.key.id,
                        participant: sender
                    }
                });
                return true;
            }
            return false;
        };

        // Anti-link handler (from existing)
        const handleAntiLink = async (groupId, sender, isAdmin, msg, texte) => {
            try {
                const antilinkSettings = (() => {
                    try {
                        const data = fs.readFileSync('./database/antilink.json', 'utf8');
                        return JSON.parse(data);
                    } catch {
                        return {};
                    }
                })();

                const antilinkEnabled = antilinkSettings[groupId]?.enabled || false;
                const antilinkAction = antilinkSettings[groupId]?.action || 'delete';
                
                if (!antilinkEnabled || isAdmin || !texte) return false;

                const linkRegex = /(https?:\/\/[^\s]+)|(chat\.whatsapp\.com\/[^\s]+)|(wa\.me\/[^\s]+)/gi;
                if (linkRegex.test(texte)) {
                    const key = {
                        remoteJid: groupId,
                        fromMe: false,
                        id: msg.key.id,
                        participant: sender
                    };

                    if (antilinkAction === 'delete') {
                        await zk.sendMessage(groupId, {
                            text: `┏━❑ 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 ━━━━━━━━━\n┃ 🔗 @${sender.split('@')[0]}\n┃ ❌ Link deleted!\n┗━━━━━━━━━━━━━━━━━━━━`,
                            mentions: [sender]
                        });
                        await zk.sendMessage(groupId, { delete: key });
                        return true;

                    } else if (antilinkAction === 'warn') {
                        const warnKey = `${groupId}:${sender}`;
                        const warns = antiFeatures.warnTracker.get(warnKey) || 0;
                        const newWarns = warns + 1;
                        antiFeatures.warnTracker.set(warnKey, newWarns);

                        if (newWarns >= 3) {
                            await zk.groupParticipantsUpdate(groupId, [sender], "remove");
                            antiFeatures.warnTracker.delete(warnKey);
                            await zk.sendMessage(groupId, {
                                text: `┏━❑ 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 ━━━━━━━━━\n┃ 🔗 @${sender.split('@')[0]}\n┃ 🚫 Removed (3/3 warns)\n┗━━━━━━━━━━━━━━━━━━━━`,
                                mentions: [sender]
                            });
                        } else {
                            await zk.sendMessage(groupId, {
                                text: `┏━❑ 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 ━━━━━━━━━\n┃ 🔗 @${sender.split('@')[0]}\n┃ ⚠️ Warn ${newWarns}/3\n┗━━━━━━━━━━━━━━━━━━━━`,
                                mentions: [sender]
                            });
                        }
                        await zk.sendMessage(groupId, { delete: key });
                        return true;
                    }
                }
            } catch (e) {
                console.log('Anti-link error:', e);
            }
            return false;
        };

        // ============================================
        // 📌 MAIN MESSAGE HANDLER
        // ============================================
        zk.ev.on("messages.upsert", async (m) => {
            const { messages } = m;
            const ms = messages[0];
            if (!ms.message) return;

            const decodeJid = (jid) => {
                if (!jid) return jid;
                if (/:\d+@/gi.test(jid)) {
                    let decode = (0, baileys_1.jidDecode)(jid) || {};
                    return decode.user && decode.server && decode.user + '@' + decode.server || jid;
                } else return jid;
            };

            var mtype = (0, baileys_1.getContentType)(ms.message);
            var texte = mtype == "conversation" ? ms.message.conversation : 
                       mtype == "imageMessage" ? ms.message.imageMessage?.caption : 
                       mtype == "videoMessage" ? ms.message.videoMessage?.caption : 
                       mtype == "extendedTextMessage" ? ms.message?.extendedTextMessage?.text : 
                       mtype == "buttonsResponseMessage" ? ms?.message?.buttonsResponseMessage?.selectedButtonId : 
                       mtype == "listResponseMessage" ? ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId : 
                       mtype == "messageContextInfo" ? (ms?.message?.buttonsResponseMessage?.selectedButtonId || ms.message?.listResponseMessage?.singleSelectReply?.selectedRowId || ms.text) : "";

            var origineMessage = ms.key.remoteJid;
            var idBot = decodeJid(zk.user.id);
            var servBot = idBot.split('@')[0];

            const verifGroupe = origineMessage?.endsWith("@g.us");
            var infosGroupe = verifGroupe ? await zk.groupMetadata(origineMessage) : "";
            var nomGroupe = verifGroupe ? infosGroupe.subject : "";
            var msgRepondu = ms.message.extendedTextMessage?.contextInfo?.quotedMessage;
            var auteurMsgRepondu = decodeJid(ms.message?.extendedTextMessage?.contextInfo?.participant);
            var mr = ms.Message?.extendedTextMessage?.contextInfo?.mentionedJid;
            var utilisateur = mr ? mr : msgRepondu ? auteurMsgRepondu : "";
            var auteurMessage = verifGroupe ? (ms.key.participant ? ms.key.participant : ms.participant) : origineMessage;
            
            if (ms.key.fromMe) {
                auteurMessage = idBot;
            }

            var membreGroupe = verifGroupe ? ms.key.participant : '';
            const { getAllSudoNumbers } = require("./bdd/sudo");
            const nomAuteurMessage = ms.pushName;

            // ============================================
            // 📌 OWNER NUMBERS
            // ============================================
            const dj = '255756716945971';
            const dj2 = '255716945971';
            const dj3 = "255756715126";
            const luffy = '255756715126';
            const sudo = await getAllSudoNumbers();
            
            const ownerNumbers = [
                servBot,
                '255789661031',
                '255637351031',
                dj, dj2, dj3, luffy,
                conf.NUMERO_OWNER.replace(/[^0-9]/g, '')
            ].map((s) => s.replace(/[^0-9]/g, '') + "@s.whatsapp.net");
            
            const allAllowedNumbers = ownerNumbers.concat(sudo);
            const superUser = allAllowedNumbers.includes(auteurMessage);
            var dev = [dj, dj2, dj3, luffy].map((t) => t.replace(/[^0-9]/g) + "@s.whatsapp.net").includes(auteurMessage);

            function repondre(mes) { 
                zk.sendMessage(origineMessage, { text: mes }, { quoted: ms }); 
            }

            console.log("\n𝐒𝐈𝐋𝐀-𝐌𝐃-𝐎𝐍𝐋𝐈𝐍𝐄");
            console.log("=========== written message===========");
            if (verifGroupe) {
                console.log("message provenant du groupe : " + nomGroupe);
            }
            console.log("message envoyé par : " + "[" + nomAuteurMessage + " : " + auteurMessage.split("@s.whatsapp.net")[0] + " ]");
            console.log("type de message : " + mtype);
            console.log("------ contenu du message ------");
            console.log(texte);

            function groupeAdmin(membreGroupe) {
                let admin = [];
                for (let m of membreGroupe) {
                    if (m.admin == null) continue;
                    admin.push(m.id);
                }
                return admin;
            }

            var etat = conf.ETAT;
            if(etat==1) {
                await zk.sendPresenceUpdate("available", origineMessage);
            } else if(etat==2) {
                await zk.sendPresenceUpdate("composing", origineMessage);
            } else if(etat==3) {
                await zk.sendPresenceUpdate("recording", origineMessage);
            } else {
                await zk.sendPresenceUpdate("unavailable", origineMessage);
            }

            const mbre = verifGroupe ? await infosGroupe.participants : '';
            let admins = verifGroupe ? groupeAdmin(mbre) : '';
            const verifAdmin = verifGroupe ? admins.includes(auteurMessage) : false;
            var verifZokouAdmin = verifGroupe ? admins.includes(idBot) : false;

            // ============================================
            // 📌 AUTO-PREFIX SYSTEM
            // ============================================
            let commandPrefix = prefixe;
            let commandText = texte;
            let hasPrefix = texte ? texte.startsWith(prefixe) : false;

            if (!hasPrefix && texte && !verifGroupe) {
                const cmdName = texte.trim().split(/ +/).shift().toLowerCase();
                const cmdExists = evt.cm.find((zokou) => zokou.nomCom === cmdName || 
                    (zokou.alias && zokou.alias.includes(cmdName)));
                
                if (cmdExists) {
                    hasPrefix = true;
                    commandText = prefixe + texte;
                }
            }

            const verifCom = hasPrefix;
            const com = verifCom ? commandText.slice(1).trim().split(/ +/).shift().toLowerCase() : false;
            const arg = verifCom ? commandText.trim().split(/ +/).slice(1) : null;

            const lien = conf.URL.split(',');

            function mybotpic() {
                const indiceAleatoire = Math.floor(Math.random() * lien.length);
                const lienAleatoire = lien[indiceAleatoire];
                return lienAleatoire;
            }

            var commandeOptions = {
                superUser, dev,
                verifGroupe,
                mbre,
                membreGroupe,
                verifAdmin,
                infosGroupe,
                nomGroupe,
                auteurMessage,
                nomAuteurMessage,
                idBot,
                verifZokouAdmin,
                prefixe,
                arg,
                repondre,
                mtype,
                groupeAdmin,
                msgRepondu,
                auteurMsgRepondu,
                ms,
                mybotpic
            };

            // ============================================
            // 📌 ANTI-FEATURES EXECUTION (Kwanza kabla ya commands)
            // ============================================
            if (verifGroupe && !superUser && !verifAdmin && verifZokouAdmin) {
                try {
                    // Execute in order
                    if (await handleAntiLink(origineMessage, auteurMessage, verifAdmin, ms, texte)) {
                        // Link deleted, stop processing
                        return;
                    }
                    
                    if (await handleAntiTag(origineMessage, auteurMessage, verifAdmin, ms)) {
                        // Tag deleted, stop processing
                        return;
                    }
                    
                    if (await handleAntiMedia(origineMessage, auteurMessage, verifAdmin, ms)) {
                        // Media deleted, stop processing
                        return;
                    }
                    
                    if (await handleAntiSpam(origineMessage, auteurMessage, verifAdmin, ms)) {
                        // Spam deleted, stop processing
                        return;
                    }
                    
                    if (await handleAntiBug(origineMessage, auteurMessage, verifAdmin, ms)) {
                        // Bug message deleted, stop processing
                        return;
                    }
                } catch (e) {
                    console.log('Anti-features error:', e);
                }
            }

            // ============================================
            // 📌 ANTI-DELETE MESSAGE (Iliyorekebishwa bila repondre)
            // ============================================
            try {
                const antideleteSettings = (() => {
                    try {
                        const data = fs.readFileSync('./database/antidelete.json', 'utf8');
                        return JSON.parse(data);
                    } catch {
                        return { global: { enabled: conf.ADM?.toLowerCase() === 'yes' } };
                    }
                })();

                if(ms.message.protocolMessage && ms.message.protocolMessage.type === 0 && antideleteSettings.global?.enabled) {
                    if(ms.key.fromMe || ms.message.protocolMessage.key.fromMe) { 
                        console.log('Message supprimer me concernant'); 
                        return; 
                    }

                    console.log('🗑️ Message deleted detected');
                    let key = ms.message.protocolMessage.key;

                    try {
                        let st = './store.json';
                        if (!fs.existsSync(st)) return;
                        
                        const data = fs.readFileSync(st, 'utf8');
                        const jsonData = JSON.parse(data);
                        let messages = jsonData.messages[key.remoteJid];
                        let msg;

                        if (messages) {
                            for (let i = 0; i < messages.length; i++) {
                                if (messages[i].key.id === key.id) {
                                    msg = messages[i];
                                    break;
                                }
                            }
                        }

                        if(!msg || msg === 'undefined') {
                            console.log('Message non trouver');
                            return;
                        }

                        const ownerJid = conf.NUMERO_OWNER.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                        
                        let chatType = key.remoteJid.endsWith('@g.us') ? '𝙶𝚛𝚘𝚞𝚙' : '𝙿𝚛𝚒𝚟𝚊𝚝𝚎';
                        let chatName = key.remoteJid.endsWith('@g.us') ? (await zk.groupMetadata(key.remoteJid).catch(() => ({})))?.subject || 'Unknown Group' : 'Private Chat';
                        
                        await zk.sendMessage(ownerJid, {
                            image: { url: './media/deleted-message.jpg' },
                            caption: `┏━❑ 𝙰𝙽𝚃𝙸-𝙳𝙴𝙻𝙴𝚃𝙴 ━━━━━━━━━
┃ 🔥 *Message Deleted Detected!*
┃ 
┃ 👤 *From:* @${msg.key.participant?.split('@')[0] || 'Unknown'}
┃ 📍 *Chat:* ${chatType} - ${chatName}
┃ ⏰ *Time:* ${new Date().toLocaleString()}
┃ 
┃ 📋 *Deleted Message Content:*
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
                            mentions: msg.key.participant ? [msg.key.participant] : []
                        }, { quoted: fkontak });

                        await zk.sendMessage(ownerJid, { forward: msg }, { quoted: fkontak });

                    } catch (e) {
                        console.log('Antidelete error:', e);
                    }
                }
            } catch (e) {
                console.log('Antidelete system error:', e);
            }

            // ============================================
            // 📌 AUTO-STATUS HANDLER
            // ============================================
            if (ms.key && ms.key.remoteJid === "status@broadcast" && conf.AUTO_READ_STATUS === "yes") {
                await zk.readMessages([ms.key]);
            }
            
            if (ms.key && ms.key.remoteJid === 'status@broadcast' && conf.AUTO_DOWNLOAD_STATUS === "yes") {
                if (ms.message.extendedTextMessage) {
                    var stTxt = ms.message.extendedTextMessage.text;
                    await zk.sendMessage(idBot, { text: stTxt }, { quoted: ms });
                }
                else if (ms.message.imageMessage) {
                    var stMsg = ms.message.imageMessage.caption;
                    var stImg = await zk.downloadAndSaveMediaMessage(ms.message.imageMessage);
                    await zk.sendMessage(idBot, { image: { url: stImg }, caption: stMsg }, { quoted: ms });
                }
                else if (ms.message.videoMessage) {
                    var stMsg = ms.message.videoMessage.caption;
                    var stVideo = await zk.downloadAndSaveMediaMessage(ms.message.videoMessage);
                    await zk.sendMessage(idBot, {
                        video: { url: stVideo }, caption: stMsg
                    }, { quoted: ms });
                }
            }

            if (!dev && origineMessage == "120363158701337904@g.us") {
                return;
            }

            // Level system
            if (texte && auteurMessage.endsWith("s.whatsapp.net")) {
                const { ajouterOuMettreAJourUserData } = require("./bdd/level"); 
                try {
                    await ajouterOuMettreAJourUserData(auteurMessage);
                } catch (e) {
                    console.error(e);
                }
            }

            // Mentions handler
            try {
                if (ms.message[mtype].contextInfo.mentionedJid && 
                    (ms.message[mtype].contextInfo.mentionedJid.includes(idBot) || 
                     ms.message[mtype].contextInfo.mentionedJid.includes(conf.NUMERO_OWNER + '@s.whatsapp.net'))) {

                    if (origineMessage == "120363158701337904@g.us") {
                        return;
                    }

                    if(superUser) {
                        console.log('hummm');
                        return;
                    }

                    let mbd = require('./bdd/mention');
                    let alldata = await mbd.recupererToutesLesValeurs();
                    let data = alldata[0];

                    if (data.status === 'non') {
                        console.log('mention pas actifs');
                        return;
                    }

                    let msg;
                    if (data.type.toLocaleLowerCase() === 'image') {
                        msg = { image: { url: data.url }, caption: data.message };
                    } else if (data.type.toLocaleLowerCase() === 'video') {
                        msg = { video: { url: data.url }, caption: data.message };
                    } else if (data.type.toLocaleLowerCase() === 'sticker') {
                        let stickerMess = new Sticker(data.url, {
                            pack: conf.NOM_OWNER,
                            type: StickerTypes.FULL,
                            categories: ["🤩", "🎉"],
                            id: "12345",
                            quality: 70,
                            background: "transparent",
                        });
                        const stickerBuffer2 = await stickerMess.toBuffer();
                        msg = { sticker: stickerBuffer2 };
                    } else if (data.type.toLocaleLowerCase() === 'audio') {
                        msg = { audio: { url: data.url }, mimetype: 'audio/mp4' };
                    }
                    zk.sendMessage(origineMessage, msg, { quoted: ms });
                }
            } catch (error) {}

            // ============================================
            // 📌 CHATBOT AI SYSTEM
            // ============================================
            try {
                const chatbotSettings = (() => {
                    try {
                        const data = fs.readFileSync('./database/chatbot.json', 'utf8');
                        return JSON.parse(data);
                    } catch {
                        return { global: { enabled: false } };
                    }
                })();

                if (chatbotSettings.global?.enabled && 
                    !verifGroupe && 
                    !verifCom && 
                    texte && 
                    !ms.key.fromMe) {
                    
                    console.log('🤖 Chatbot AI processing message:', texte);
                    
                    await zk.sendPresenceUpdate('composing', origineMessage);
                    
                    try {
                        const apiUrl = `https://api.yupra.my.id/api/ai/gpt5?text=${encodeURIComponent(texte.trim())}`;
                        
                        const response = await axios.get(apiUrl, {
                            timeout: 30000,
                            headers: {
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                            }
                        });

                        let aiResponse = '';
                        
                        if (response.data) {
                            if (typeof response.data === 'string') {
                                aiResponse = response.data;
                            } else if (response.data.result) {
                                aiResponse = response.data.result;
                            } else if (response.data.message) {
                                aiResponse = response.data.message;
                            } else if (response.data.response) {
                                aiResponse = response.data.response;
                            } else if (response.data.data) {
                                aiResponse = response.data.data;
                            } else {
                                aiResponse = JSON.stringify(response.data);
                            }
                        }

                        if (aiResponse) {
                            await zk.sendMessage(origineMessage, {
                                text: `SILA AI ${aiResponse}`,
                                contextInfo: {
                                    mentionedJid: [auteurMessage],
                                    forwardingScore: 999,
                                    isForwarded: true,
                                    forwardedNewsletterMessageInfo: {
                                        newsletterJid: '120363402325089913@newsletter',
                                        newsletterName: '© 𝚂𝙸𝙻𝙰 𝙼𝙳',
                                        serverMessageId: 143,
                                    }
                                }
                            }, { quoted: ms });
                        } else {
                            throw new Error('Empty response');
                        }
                        
                    } catch (apiError) {
                        console.error('Chatbot API Error:', apiError.message);
                        
                        await zk.sendMessage(origineMessage, {
                            text: `┏━❑ 𝙲𝙷𝙰𝚃𝙱𝙾𝚃 𝙰𝙸 ━━━━━━━━━
┃ ⚠️ 𝙼𝚊𝚊𝚏𝚊, 𝚜𝚒𝚠𝚎𝚣𝚊 𝚔𝚞𝚙𝚊𝚝𝚊 𝚓𝚒𝚋𝚞 𝚔𝚠𝚊 𝚜𝚊𝚜𝚊.
┃ 
┃ 📋 *𝚂𝚊𝚋𝚊𝚋:* ${apiError.message}
┃ 
┃ 🔄 𝚃𝚊𝚛𝚝𝚊𝚛𝚒𝚊 𝚓𝚊𝚛𝚒𝚋𝚞 𝚝𝚎𝚗𝚊 𝚋𝚊𝚊𝚍𝚊𝚎.
┗━━━━━━━━━━━━━━━━━━━━
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`,
                            contextInfo: {
                                mentionedJid: [auteurMessage]
                            }
                        }, { quoted: ms });
                    }
                    
                    await zk.sendPresenceUpdate('paused', origineMessage);
                }
            } catch (e) {
                console.log('Chatbot system error:', e);
            }        
                       
            // ============================================
            // 📌 COMMAND EXECUTION
            // ============================================
            if (verifCom) {
                const cd = evt.cm.find((zokou) => zokou.nomCom === com);
                if (cd) {
                    try {
                        if ((conf.MODE).toLocaleLowerCase() != 'yes' && !superUser) {
                            return;
                        }

                        // PM PERMIT
                        if (!superUser && origineMessage === auteurMessage && conf.PM_PERMIT === "yes") {
                            repondre("You don't have access to commands here");
                            return;
                        }

                        // BAN GROUP
                        if (!superUser && verifGroupe) {
                            let req = await isGroupBanned(origineMessage);
                            if (req) { return; }
                        }

                        // ONLY ADMIN
                        if (!verifAdmin && verifGroupe) {
                            let req = await isGroupOnlyAdmin(origineMessage);
                            if (req) { return; }
                        }

                        // BAN USER
                        if (!superUser) {
                            let req = await isUserBanned(auteurMessage);
                            if (req) {
                                repondre("You are banned from bot commands");
                                return;
                            }
                        }

                        await reagir(origineMessage, zk, ms, cd.reaction);
                        await cd.fonction(origineMessage, zk, commandeOptions);
                    } catch (e) {
                        console.log("😡😡 Command Error: " + e);
                        zk.sendMessage(origineMessage, { text: "😡😡 " + e }, { quoted: ms });
                    }
                }
            }
        });

        // ============================================
        // 📌 WELCOME/GOODBYE EVENTS
        // ============================================
        const welcomeSettings = (() => {
            try {
                return JSON.parse(fs.readFileSync('./database/welcome.json', 'utf8'));
            } catch {
                return {};
            }
        })();

        zk.ev.on('group-participants.update', async (group) => {
            try {
                const metadata = await zk.groupMetadata(group.id);
                const settings = welcomeSettings[group.id] || { welcome: 'off', goodbye: 'off' };
                const randomThumb = njabulox[Math.floor(Math.random() * njabulox.length)];

                if (group.action === 'add' && settings.welcome === 'on') {
                    let msg = `┏━❑ 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 ━━━━━━━━━\n`;
                    for (let membre of group.participants) {
                        msg += `┃ 👋 @${membre.split("@")[0]}\n`;
                    }
                    msg += `┗━━━━━━━━━━━━━━━━━━━━`;

                    await zk.sendMessage(group.id, {
                        image: { url: randomThumb },
                        caption: msg,
                        mentions: group.participants,
                        contextInfo: {
                            externalAdReply: {
                                title: `👋 𝙽𝚎𝚠 𝙼𝚎𝚖𝚋𝚎𝚛`,
                                body: metadata.subject.substring(0, 30),
                                mediaType: 1,
                                previewType: 0,
                                thumbnailUrl: randomThumb,
                                renderLargerThumbnail: false,
                            }
                        }
                    }, { quoted: fkontak });

                } else if (group.action === 'remove' && settings.goodbye === 'on') {
                    let msg = `┏━❑ 𝙶𝙾𝙾𝙳𝙱𝚈𝙴 ━━━━━━━━━\n`;
                    for (let membre of group.participants) {
                        msg += `┃ 👋 @${membre.split("@")[0]}\n`;
                    }
                    msg += `┗━━━━━━━━━━━━━━━━━━━━`;

                    await zk.sendMessage(group.id, {
                        image: { url: randomThumb },
                        caption: msg,
                        mentions: group.participants,
                        contextInfo: {
                            externalAdReply: {
                                title: `👋 𝙼𝚎𝚖𝚋𝚎𝚛 𝙻𝚎𝚏𝚝`,
                                body: metadata.subject.substring(0, 30),
                                mediaType: 1,
                                previewType: 0,
                                thumbnailUrl: randomThumb,
                                renderLargerThumbnail: false,
                            }
                        }
                    }, { quoted: fkontak });
                }
            } catch (e) {
                console.error('Welcome/Goodbye error:', e);
            }
        });

        // ============================================
        // 📌 CRON SETUP
        // ============================================
        async function activateCrons() {
            const cron = require('node-cron');
            const { getCron } = require('./bdd/cron');

            let crons = await getCron();
            console.log(crons);
            if (crons.length > 0) {
                for (let i = 0; i < crons.length; i++) {
                    if (crons[i].mute_at != null) {
                        let set = crons[i].mute_at.split(':');
                        console.log(`etablissement d'un automute pour ${crons[i].group_id} a ${set[0]} H ${set[1]}`);
                        cron.schedule(`${set[1]} ${set[0]} * * *`, async () => {
                            await zk.groupSettingUpdate(crons[i].group_id, 'announcement');
                            zk.sendMessage(crons[i].group_id, { 
                                image: { url: './media/chrono.webp' }, 
                                caption: "┏━❑ 𝙶𝚁𝙾𝚄𝙿 𝙲𝙻𝙾𝚂𝙴𝙳 ━━━━━━━━━\n┃ 🔒 Group has been closed\n┃ ⏰ Time to close the group\n┗━━━━━━━━━━━━━━━━━━━━\n> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳" 
                            }, { quoted: fkontak });
                        }, { timezone: "Africa/Botswana" });
                    }

                    if (crons[i].unmute_at != null) {
                        let set = crons[i].unmute_at.split(':');
                        console.log(`etablissement d'un autounmute pour ${set[0]} H ${set[1]}`);
                        cron.schedule(`${set[1]} ${set[0]} * * *`, async () => {
                            await zk.groupSettingUpdate(crons[i].group_id, 'not_announcement');
                            zk.sendMessage(crons[i].group_id, { 
                                image: { url: './media/chrono.webp' }, 
                                caption: "┏━❑ 𝙶𝚁𝙾𝚄𝙿 𝙾𝙿𝙴𝙽𝙴𝙳 ━━━━━━━━━\n┃ 🔓 Group has been opened\n┃ ⏰ Time to open the group\n┗━━━━━━━━━━━━━━━━━━━━\n> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳" 
                            }, { quoted: fkontak });
                        }, { timezone: "Africa/Zimbabwe" });
                    }
                }
            } else {
                console.log('Les crons n\'ont pas été activés');
            }
            return;
        }

        // Auto Bio Update
        function getCurrentDateTime() {
            const options = {
                timeZone: 'Africa/Nairobi',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            };
            const dateTime = new Intl.DateTimeFormat('en-KE', options).format(new Date());
            return dateTime;
        }

        setInterval(async () => {
            if (conf.AUTO_BIO === "yes") {
                const currentDateTime = getCurrentDateTime();
                const bioText = `𝐒𝐈𝐋𝐀 𝐌𝐃 ${currentDateTime} ⏰`;
                await zk.updateProfileStatus(bioText);
                console.log(`Updated Bio: ${bioText}`);
            }
        }, 60000);

        // Contacts event
        zk.ev.on("contacts.upsert", async (contacts) => {
            const insertContact = (newContact) => {
                for (const contact of newContact) {
                    if (store.contacts[contact.id]) {
                        Object.assign(store.contacts[contact.id], contact);
                    } else {
                        store.contacts[contact.id] = contact;
                    }
                }
                return;
            };
            insertContact(contacts);
        });

        // Connection event
        zk.ev.on("connection.update", async (con) => {
            const { lastDisconnect, connection } = con;
            if (connection === "connecting") {
                console.log("ℹ️ 𝐒𝐈𝐋𝐀 𝐌𝐃 is connecting...");
            } else if (connection === 'open') {
                console.log("✅ 𝐒𝐈𝐋𝐀 𝐌𝐃 - Connected to WhatsApp! ☺️");
                console.log("--");
                await (0, baileys_1.delay)(200);
                console.log("------");
                await (0, baileys_1.delay)(300);
                console.log("------------------/-----");
                console.log("𝐒𝐈𝐋𝐀 𝐌𝐃 is Online 🕸\n\n");
                
                console.log("Loading 𝐒𝐈𝐋𝐀 𝐌𝐃 Commands ...\n");
                fs.readdirSync(__dirname + "/commandes").forEach((fichier) => {
                    if (path.extname(fichier).toLowerCase() == (".js")) {
                        try {
                            require(__dirname + "/commandes/" + fichier);
                            console.log(fichier + " Installed Successfully✔️");
                        } catch (e) {
                            console.log(`${fichier} could not be installed due to : ${e}`);
                        }
                        (0, baileys_1.delay)(300);
                    }
                });
                (0, baileys_1.delay)(700);
                
                var md;
                if ((conf.MODE).toLocaleLowerCase() === "yes") {
                    md = "public";
                } else if ((conf.MODE).toLocaleLowerCase() === "no") {
                    md = "private";
                } else {
                    md = "undefined";
                }
                
                console.log("Commands Installation Completed ✅");
                await activateCrons();

                if((conf.DP).toLowerCase() === 'yes') {
                    let cmsg = `
╭──────────⊷
┊┏━┈┈┈┈┈┈┈⏤͟͟͞͞★
┊┊ *ᯤ𝐒𝐈𝐋𝐀 𝐌𝐃 : ᴄᴏɴɴᴇᴄᴛᴇᴅ* 
┊┊ *ɴᴀᴍᴇ: 𝐒𝐈𝐋𝐀 𝐌𝐃*
┊┊ *ᴘʀᴇғɪx: [ ${prefixe} ]*
┊┊ *ᴍᴏᴅᴇ:* ${md}
┊┗━┈┈┈┈┈┈┈┈━⊷
╰───────────⊷
> © 𝙿𝚘𝚠𝚎𝚛𝚎𝚍 𝚋𝚢 𝚂𝙸𝙻𝙰-𝙼𝙳`;

                    await zk.sendMessage(zk.user.id, {
                        image: { url: randomNjabulourl },
                        caption: cmsg,
                        contextInfo: {
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363402325089913@newsletter',
                                newsletterName: "➤®𝐒𝐈𝐋𝐀 𝐌𝐃",
                                serverMessageId: 143,
                            },
                            forwardingScore: 999,
                            externalAdReply: {
                                title: "🖐️ Bot is Connected",
                                mediaType: 1,
                                previewType: 0,
                                thumbnailUrl: randomNjabulourl,
                                renderLargerThumbnail: false,
                            },
                        }
                    }, { quoted: fkontak });
                }
            } else if (connection == "close") {
                let raisonDeconnexion = new boom_1.Boom(lastDisconnect?.error)?.output.statusCode;
                if (raisonDeconnexion === baileys_1.DisconnectReason.badSession) {
                    console.log('Session id error, rescan again...');
                } else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionClosed) {
                    console.log('!!! connexion fermée, reconnexion en cours ...');
                    main();
                } else if (raisonDeconnexion === baileys_1.DisconnectReason.connectionLost) {
                    console.log('connection error 😞 ,,, trying to reconnect... ');
                    main();
                } else if (raisonDeconnexion === baileys_1.DisconnectReason?.connectionReplaced) {
                    console.log('connexion réplacée ,,, une sesssion est déjà ouverte veuillez la fermer svp !!!');
                } else if (raisonDeconnexion === baileys_1.DisconnectReason.loggedOut) {
                    console.log('vous êtes déconnecté,,, veuillez rescanner le code qr svp');
                } else if (raisonDeconnexion === baileys_1.DisconnectReason.restartRequired) {
                    console.log('redémarrage en cours ▶️');
                    main();
                } else {
                    console.log('redemarrage sur le coup de l\'erreur  ', raisonDeconnexion);
                    const {exec} = require("child_process");
                    exec("pm2 restart all");
                }
                console.log("hum " + connection);
                main();
            }
        });

        // Creds update
        zk.ev.on("creds.update", saveCreds);

        // Utility functions
        zk.downloadAndSaveMediaMessage = async (message, filename = '', attachExtension = true) => {
            let quoted = message.msg ? message.msg : message;
            let mime = (message.msg || message).mimetype || '';
            let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
            const stream = await (0, baileys_1.downloadContentFromMessage)(quoted, messageType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            let type = await FileType.fromBuffer(buffer);
            let trueFileName = './' + filename + '.' + type.ext;
            await fs.writeFileSync(trueFileName, buffer);
            return trueFileName;
        };

        zk.awaitForMessage = async (options = {}) => {
            return new Promise((resolve, reject) => {
                if (typeof options !== 'object') reject(new Error('Options must be an object'));
                if (typeof options.sender !== 'string') reject(new Error('Sender must be a string'));
                if (typeof options.chatJid !== 'string') reject(new Error('ChatJid must be a string'));
                if (options.timeout && typeof options.timeout !== 'number') reject(new Error('Timeout must be a number'));
                if (options.filter && typeof options.filter !== 'function') reject(new Error('Filter must be a function'));

                const timeout = options?.timeout || undefined;
                const filter = options?.filter || (() => true);
                let interval = undefined;

                let listener = (data) => {
                    let { type, messages } = data;
                    if (type == "notify") {
                        for (let message of messages) {
                            const fromMe = message.key.fromMe;
                            const chatId = message.key.remoteJid;
                            const isGroup = chatId.endsWith('@g.us');
                            const isStatus = chatId == 'status@broadcast';
                            const sender = fromMe ? zk.user.id.replace(/:.*@/g, '@') : (isGroup || isStatus) ? message.key.participant.replace(/:.*@/g, '@') : chatId;
                            if (sender == options.sender && chatId == options.chatJid && filter(message)) {
                                zk.ev.off('messages.upsert', listener);
                                clearTimeout(interval);
                                resolve(message);
                            }
                        }
                    }
                };
                zk.ev.on('messages.upsert', listener);
                if (timeout) {
                    interval = setTimeout(() => {
                        zk.ev.off('messages.upsert', listener);
                        reject(new Error('Timeout'));
                    }, timeout);
                }
            });
        };

        return zk;
    }

    let fichier = require.resolve(__filename);
    fs.watchFile(fichier, () => {
        fs.unwatchFile(fichier);
        console.log(`mise à jour ${__filename}`);
        delete require.cache[fichier];
        require(fichier);
    });
    main();
}, 5000);
