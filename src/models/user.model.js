import mongoose from 'mongoose';
import crypto from 'crypto';
import validator from 'validator';
import { hash, verify } from 'argon2';
import toJSON from './plugins/index';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      }
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            'Password must contain at least one letter and one number'
          );
        }
      },
      private: true
    },
    passwordConfirmation: {
      type: String,
      required: true,
      validate: {
        // This only works with CREATE & SAVE!!!!!
        validator: function (el) {
          return el === this.password;
        },
        messege: 'Passwords are not the same'
      }
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'seller'],
      default: 'user'
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  return await verify(this.password, password);
};

// Encrypt Password Using Argon2
userSchema.pre('save', async function (next) {
  // 1) Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // 2) Salt & Hashing Password
  const salt = crypto.randomBytes(32);
  this.password = await hash(this.password, { salt });

  // 3) Delete passwordConfirmation field
  this.passwordConfirmation = undefined;
  next();
});

// Set passwordChangedAt field to the current time when the user change the password
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

export default User;
