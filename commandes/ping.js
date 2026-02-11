const { silamd } = require("../silamd/sila");

sila({ nomCom: 'ping',
    desc: 'Check bot response time',
    Categorie: 'General',
    reaction: '📡', 
    fromMe: 'true', 
  },
  async (dest, zk, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;
      
    try {
        const startTime = Date.now();
        
        await repondre("🏓 *Pong!*");
        
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        await repondre(`⚡ *Response Time:* \`${responseTime}ms\``);

    } catch (e) {
        console.log("❌ Ping Command Error: " + e);
        repondre("❌ Error: " + e);
    }
});
