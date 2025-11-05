const mongoose = require('mongoose');
// mongodb://localhost:27017/card_love
async function connect() {
    try {

        const USER = 'longbachit_db_user';
        const PASS = 'abcd@1234';                 // có ký tự @
        const HOST = 'cluster0.rfu7diy.mongodb.net';

        const uri = `mongodb+srv://healthylife:!healthylife@cluster0.rnhlwmz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

        console.log({uri})
        await mongoose.connect(uri, {

            useUnifiedTopology: true,

        });
        console.log('Connect successfully!!!');
    } catch (error) {
        console.log('Connect failure!!!');
    }
}

module.exports = { connect };
