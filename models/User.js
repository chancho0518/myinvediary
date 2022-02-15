const encryption = require('../helpers/encryption');

const User = class userValue{
    constructor(email, password, display_name, admin, activation) {
        this.email = email;
        this.password = password;
        this.display_name = display_name;
        this.admin = false;
        this.activation = true;
        }
    
    cryptoValue = function(value) {
        return encryption(value);
    }  
};

module.exports = { User };