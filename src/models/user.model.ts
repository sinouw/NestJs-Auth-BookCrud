import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';


export const UserSchema = new mongoose.Schema({
    username: { type: String, unique : true , required : true},
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    password: String,
}, { timestamps: true });

export interface  User extends mongoose.Document {
    readonly _id  : string;
    readonly username: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly password: string;
}

export class  CreateUserDto {
    readonly username: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly password: string;
}

UserSchema.pre('save', function (next) {
    let user = this as any;
    // Make sure not to rehash the password if it is already hashed
    if (!user.isModified('password')) return next();
    // Generate a salt and use it to hash the user's password
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.checkPassword = function (attempt, callback) {
    let user = this;
    bcrypt.compare(attempt, user.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};