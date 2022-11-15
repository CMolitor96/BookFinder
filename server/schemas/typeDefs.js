const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Number
        savedBooks: [bookSchema]!
    }

    type Book {
        authors: [String]
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        user(username: String!): User
        me: User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        saveBook(username: String!, authors: [String]!, description: String!, bookId: String!, image: String!, link: String!, title: String!): User
        removeBook(username: String!, bookId: String!): User
    }
`;

module.exports = typeDefs;