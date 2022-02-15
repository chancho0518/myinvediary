const crypto = require('crypto');
const genSalt = 'abcde';

module.exports = function(value) {
    return crypto.createHash('sha512').update(value + genSalt).digest('base64');
};