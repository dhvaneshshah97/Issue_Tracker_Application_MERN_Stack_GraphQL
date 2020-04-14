const fs = require('fs');
const express = require("express");
const { ApolloServer, UserInputError } = require('apollo-server-express');

let aboutMessage = "Issue Tracker API v1.0";
const issuesDB = [
    {
        id: 1, status: 'New', owner: 'Dhvanesh', created: new Date('2016-08-15'), effort: 5,
        completionDate: undefined, title: 'Error in console when clicking Add',
    },
    {
        id: 2, status: 'Assigned', owner: 'Dharmik', created: new Date('2016-08-16'), effort: 14,
        completionDate: new Date('2016-08-30'), title: 'Missing bottom border on panel',
    },
];

const resolvers = {
    Query: {
        about: () => aboutMessage,
        issueList,
    },
    Mutation: {
        setAboutMessage,
        issueAdd,
    },

};
function issueList() {
    return issuesDB;
}
function setAboutMessage(_, { message }) {
    return aboutMessage = message;
}
function validateIssue(issue) {
    const errors = [];
    if (issue.title.length < 3) {
        errors.push('Field "title" must be at least 3 characters long.')
    }
    if (issue.status == 'Assigned' && !issue.owner) {
        errors.push('Field "owner" is required when status is "Assigned"');
    }
    if (errors.length > 0) {
        throw new UserInputError('Invalid input(s)', { errors });
    }
    
}
function issueAdd(_, { issue }) {
    validateIssue(issue);
    issue.id = issuesDB.length + 1;
    issue.created = "24-2-1997";
    // if (issue.status == undefined) issue.status = "New";
    issuesDB.push(issue);
    return issue;
}

const server = new ApolloServer({
    typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
    resolvers,
    formatError: error => {
        console.log(error);
        return error;
    }
});
const app = express();
fileServerMiddleware = express.static('public');
app.use('/', fileServerMiddleware);
server.applyMiddleware({ app, path: '/graphql' });

app.listen(3000, function () {
    console.log('App started on port 3000');
})