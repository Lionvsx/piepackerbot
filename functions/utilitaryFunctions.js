const https = require('https')

module.exports = {
    removeDivider,
    removeEmojis,
    getEmoji,
    getDivider,
    readFile,
    downloadFile,
    sleep,
    getDuplicates,
    substractArrays,
    chunkArray,
    updateGuildMemberCache
}
/**
 * 
 * @param {String} string 
 * @returns {String} String without emojis
 */
function removeEmojis (string) {
    var regex = emojiRegex();
  
    return string?.replace(regex, '');
}

/**
 * 
 * @param {String} string 
 * @returns {String} Unicode Emoji
 */
function getEmoji (string) {
    let stringWithoutEmoji = removeEmojis(string);

    return string?.replace(stringWithoutEmoji, '')
}

/**
 * 
 * @param {String} string 
 * @returns {String} String without divider
 */
function removeDivider (string) {
    var regex = /『|』|┃|┋|︙/g

    return string?.replace(regex, '');
}

/**
 * 
 * @param {String} string 
 * @returns {String} Divider
 */
function getDivider (string) {
    let stringWithoutDivider = removeDivider(string);

    return string?.replace(stringWithoutDivider, '')
}
/**
 * 
 * @param {string} path 
 * @param {string} url 
 * @returns {void}
 */
const downloadFile = (path, url) => {
    return new Promise(async (resolve) => {
        const file = fs.createWriteStream(path)
        https.get(url, response => {
            var stream = response.pipe(file);
          
            stream.on("finish", () => {
              resolve();
            });
          });
    })
}
/**
 * 
 * @param {string} path 
 * @returns {File} file data
 */
const readFile = (path) => {
    return new Promise(async (resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) return reject(err);
            else if (data) return resolve(data);
        })
    })
}
/**
 * 
 * @param {number} ms time in milliseconds
 * @returns {void}
 */
const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 
 * @param {*[]} array 
 * @returns Array with duplicates
 */
 function getDuplicates(array) {
    return array.filter((value, index) => data.indexOf(value) != index) 
}

/**
 * 
 * @param {*[]} array1 
 * @param {*[]} array2 
 * @returns {*[]}
 */
 const substractArrays = (array1, array2) => {
    array1.filter((e) => {
        let i = array2.indexOf(e)
        return i == -1 ? true : (array2.splice(i, 1), false)
    })
}

/**
 * 
 * @param {*[]} arr 
 * @param {Number} chunkSize 
 * @returns 
 */
 function chunkArray(arr, chunkSize) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

/**
 * 
 * @param {object} guild 
 * @returns {object} guild members cache
 */
 const updateGuildMemberCache = async (guild) => {
    const guildMembersCache = guild.members.cache

    if (guildMembersCache.size != guild.memberCount) {
        guild.client.warn('Cached incomplete, updated', {
            updated: guild.memberCount - guildMembersCache.size,
            success: true
        })
        await guild.members.fetch();
    }
    return guild.members.cache
}