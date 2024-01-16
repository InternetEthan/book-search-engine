// const { Schema, model } = require('mongoose');
// const bcrypt = require('bcrypt');

// // import schema from Book.js
// const bookSchema = require('./Book');

// const userSchema = new Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       match: [/.+@.+\..+/, 'Must use a valid email address'],
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     // set savedBooks to be an array of data that adheres to the bookSchema
//     savedBooks: [bookSchema],
//   },
//   // set this to use virtual below
//   {
//     toJSON: {
//       virtuals: true,
//     },
//   }
// );

// // hash user password
// userSchema.pre('save', async function (next) {
//   if (this.isNew || this.isModified('password')) {
//     const saltRounds = 10;
//     this.password = await bcrypt.hash(this.password, saltRounds);
//   }

//   next();
// });

// // custom method to compare and validate password for logging in
// userSchema.methods.isCorrectPassword = async function (password) {
//   return bcrypt.compare(password, this.password);
// };

// // when we query a user, we'll also get another field called `bookCount` with the number of saved books we have
// userSchema.virtual('bookCount').get(function () {
//   return this.savedBooks.length;
// });

// const User = model('User', userSchema);

// module.exports = User;

const jwt = require('jsonwebtoken');

const secret = "thisisasecret";
const expiration = '2h';

module.exports = {
  authMiddleware: function ({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    // if no token, return request object as is
    if (!token) {
      return req;
    }

    try {
      // decode and attach user data to request object
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    // return updated request object
    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};