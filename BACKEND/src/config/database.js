const mongoose = require('mongoose');
const dbConfig = require("./db");
const db = require("../models");
const Role = db.role;
const User = db.user;

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://samariatajamul_db_user:NC9m8WPtoa30qLyD@cluster0.s0qmlbq.mongodb.net/nishat_db`, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10
        });
        
        console.log("Successfully connect to MongoDB.");
        await initial();
        await initialUser();
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;


async function initial() {
    try {
        const count = await Role.estimatedDocumentCount();
        if (count === 0) {
            await new Role({ name: "user" }).save();
            console.log("added 'user' to roles collection");

            await new Role({ name: "moderator" }).save();
            console.log("added 'moderator' to roles collection");

            await new Role({ name: "admin" }).save();
            console.log("added 'admin' to roles collection");
        }
    } catch (err) {
        console.error("Error initializing roles:", err);
    }
}


async function initialUser() {
    try {
        const count = await User.estimatedDocumentCount();
        if (count === 0) {
            const role = await Role.findOne({ name: "admin" });
            if (role) {
                const newUser = new User({
                    firstName: "test",
                    lastName: "user",
                    email: "test@test.com",
                    password: "$2a$08$81IdAvtI89yWrST.mncgMurKSspFJgUd9/7E29nU45HDfpqp9o7ji",
                    roles: [role._id],
                });

                await newUser.save();
                console.log("added 'initial user' to users collection");
            } else {
                console.log("admin role not found");
            }
        }
    } catch (err) {
        console.error("Error initializing user:", err);
    }
}
