// blacklist.js
const blacklist = new Set();

const addToBlacklist = (token) => {
    console.log("i am called")
    blacklist.add(token);
};

const isTokenBlacklisted = (token) => {
    return blacklist.has(token);
};

module.exports = { addToBlacklist, isTokenBlacklisted };
