// Minimal `reagir` implementation to avoid circular dependency and provide
// a safe default reaction behaviour. It sends a quoted text containing
// the reaction emoji/string when a command triggers a reaction.
module.exports.reagir = async function (dest, zk, ms, reaction) {
  try {
    if (!reaction) return;
    // Prefer sending a reaction if supported, fallback to a quoted text reply
    try {
      await zk.sendMessage(dest, { react: { text: reaction, key: ms.key } });
    }
    catch (e) {
      // Fallback: send a small text message quoted to the triggering message
      await zk.sendMessage(dest, { text: reaction }, { quoted: ms });
    }
  }
  catch (err) {
    console.error('reagir error', err);
  }
};
