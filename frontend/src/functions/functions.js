const getLexSession = () => {
  const keys = Object.keys(window.sessionStorage);
  const lexKey = keys.filter((e) => e.includes("kommunicate"))[0];
  const data = JSON.parse(window.sessionStorage.getItem(lexKey));
  return data.appOptions.appId;
};

module.exports = { getLexSession };
