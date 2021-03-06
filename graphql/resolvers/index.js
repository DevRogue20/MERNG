const postResolvers = require('./posts');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');
const { Subscription } = require('./posts');
const { ProvidedRequiredArgumentsOnDirectivesRule } = require('graphql/validation/rules/ProvidedRequiredArgumentsRule');

module.exports = {
    Post: {
       likeCount: (parent) => parent.likes.length,
       commentCount: (parent) => parent.comments.length
    },
    Query: {
        ...postResolvers.Query
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postResolvers.Mutation,
        ...commentsResolvers.Mutation
    },
    Subscription: {
        ...postResolvers.Subscription
    }
};