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
  silamd: sila,
  sila: sila,
  cm: cm
};

// Expose as global to support command files that call `sila()` without
// destructuring the export (many command modules assume a global `sila`).
try {
  global.sila = sila;
  global.silamd = sila;
}
catch (e) {
  // ignore
}
