const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User } = require('../models');

const resolvers = {
    Query: {
        user: async (parent, {username}) => {
            return User.findOne({ username })
        }, 
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('thoughts');
              }
              throw new AuthenticationError('You need to be logged in!');
            },
    },
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            if (!user) {
                return res.status(400).json({ message: 'Something is wrong!' });
              }
            const token = signToken(user);
            return { token, user };
          },
          login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
            if (!user) {
              throw new AuthenticationError('No user found with this email address');
            }
      
            const correctPw = await user.isCorrectPassword(password);
      
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }
      
            const token = signToken(user);
      
            return { token, user };
          },
          saveBook: async (parent, {user, body}) => {
            try {
                const updatedUser = await User.findOneAndUpdate(
                  { _id: user._id },
                  { $addToSet: { savedBooks: body } },
                  { new: true, runValidators: true }
                );
                return res.json(updatedUser);
              } catch (err) {
                console.log(err);
                return res.status(400).json(err);
              }
          },
          deleteBook: async (parent, {user, params}) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId: params.bookId } } },
                { new: true }
              );
              if (!updatedUser) {
                return res.status(404).json({ message: "Couldn't find user with this id!" });
              }
              return res.json(updatedUser);
          }
    }
};

module.exports = resolvers;