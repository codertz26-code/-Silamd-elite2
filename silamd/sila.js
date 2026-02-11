let cm = [];

function sila(nomCom, fonction) {
  cm.push({
    nomCom: nomCom?.nomCom || nomCom,
    fonction: fonction,
    reaction: nomCom?.reaction || "⏳",
    desc: nomCom?.desc || "No description",
    Categorie: nomCom?.Categorie || "General"
  });
}

module.exports = {
  sila: sila,
  cm: cm
};
