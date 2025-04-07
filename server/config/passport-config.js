const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const client = require('../../models/util').getMongoClient(false);


module.exports = function(passport) {
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                const collection = client.db().collection('users');
                
                const user = await collection.findOne({ username });
                if (!user) return done(null, false, { message: 'Incorrect username' });
                
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) return done(null, false, { message: 'Incorrect password' });
                
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id.toString()); // Serialize MongoDB _id
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const collection = client.db().collection('users');
            const user = await collection.findOne({ _id: new ObjectId(id) });
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};