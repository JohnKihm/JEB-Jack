const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');

// set token secret and expiration date
const secret = 'mysecretsshhhhh'; // Jeb note: move this to a dot.env file or similar
const expiration = '2h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  // function for our authenticated routes
  authMiddleware: function ({ req }) {
    // allows token to be sent via  req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
    console.log("Request: ", req);
    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      console.log('my data', data);
      req.user = data;
    } catch {
      console.log('Invalid token');
    }
    return req;
  },
  signToken: function ({ username, _id }) {
    const payload = { username, _id };
    console.log("Payload: ", payload);
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
