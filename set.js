const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
// Load feature flags from features.json for runtime toggles
const FEATURES_FILE = path.join(__dirname, 'features.json');
let FEATURES = {};
if (fs.existsSync(FEATURES_FILE)) {
    try {
        FEATURES = JSON.parse(fs.readFileSync(FEATURES_FILE));
    }
    catch (e) {
        console.error('Failed to parse features.json', e);
        FEATURES = {};
    }
}
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
// List of image URLs
const njabulox = [
    "https://files.catbox.moe/krnlo3.jpeg",
    "https://files.catbox.moe/36vahk.png",
    "https://files.catbox.moe/j7kue0.jpeg",
    "https://files.catbox.moe/edcfwx.jpeg",
    "https://files.catbox.moe/98k75b.jpeg" // New image added
];

// Select a random image file
const randomNjabulourl = () => njabulox[Math.floor(Math.random() * njabulox.length)];

// Helper to send alive audio with contextual externalAdReply thumbnail
async function sendAliveAudio(zk, dest, AUDIO_URL, runtime) {
    if (!zk || !dest || !AUDIO_URL) return;
    try {
        await zk.sendMessage(dest, {
            audio: { url: AUDIO_URL },
            mimetype: 'audio/mp4',
            ptt: true,
            contextInfo: {
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402325089913@newsletter',
                    newsletterName: "➤®𝐒𝐈𝐋𝐀-𝐌𝐃",
                    serverMessageId: 143,
                },
                forwardingScore: 999,
                externalAdReply: {
                    title: `⏰ message am alive  ${runtime}`,
                    mediaType: 1,
                    previewType: 0,
                    thumbnailUrl: randomNjabulourl(),
                    renderLargerThumbnail: true,
                }
            }
        });
    }
    catch (e) {
        console.error('sendAliveAudio error', e);
    }
}

module.exports = { session: process.env.SESSION_ID || 'zokk',

    //process.env.PREFIX//
    PREFIXE: process.env.PREFIX || ".",

    //process.env.OWNER_NAME//
    OWNER_NAME: process.env.OWNER_NAME || "Silamd-elite",
   
    //process.env.NUMERO_OWNER//
    NUMERO_OWNER : process.env.NUMERO_OWNER || "255789661031",              
   
    //process.env.AUTO_READ_STATUS//             
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",

    //process.env.AUTO_BIO//
    AUTO_BIO : process.env.AUTO_BIO || 'yes',
   
    //process.env.AUTOREACT_STATUS//             
    AUTOREACT_STATUS : process.env.AUTOREACT_STATUS || 'yes',
    
    //process.env.AUTO_DOWNLOAD_STATUS//            
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    
    //process.env.BOT_NAME//            
    BOT : process.env.BOT_NAME || 'Silamd-elite',
    
    //process.env.BOT_MENU_LINKS//             
    URL : process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/krnlo3.jpeg',

    //GURL: process.env.GURL//
     GURL: process.env.GURL  || 'https://whatsapp.com/channel/0029VbBG4gfISTkCpKxyMH02',
  
    //process.env.PUBLIC_MODE//             
    MODE: process.env.PUBLIC_MODE || "yes",
    
    //process.env.PM_PERMIT//             
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    
    //process.env.HEROKU_APP_NAME//             
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    
    //process.env.HEROKU_APY_KEY//             
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    
    //process.env.WARN_COUNT//            
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    
    //process.env.PRESENCE//             
    ETAT : process.env.PRESENCE || '',
    
    //process.env.PM_CHATBOT//             
    CHATBOT : process.env.PM_CHATBOT || 'no',
    
    //process.env.STARTING_BOT_MESSAGE//             
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    
    //process.env.ANTI_DELETE_MESSAGE//             
    ADM : process.env.ANTI_DELETE_MESSAGE || 'no',
    // Loaded feature flags
    FEATURES,
    // Helper to send alive audio
    sendAliveAudio,
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
})

// Watch features.json and reload FEATURES when it changes
if (fs.existsSync(FEATURES_FILE)) {
    fs.watchFile(FEATURES_FILE, () => {
        try {
            const fresh = JSON.parse(fs.readFileSync(FEATURES_FILE));
            FEATURES = fresh;
            if (module && module.exports) module.exports.FEATURES = FEATURES;
            console.log('features.json reloaded');
        }
        catch (e) {
            console.error('Failed to reload features.json', e);
        }
    });
}



