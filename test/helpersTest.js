const {
  generateRandomString,
  emailExists,
  userIdOfEmail,
  urlsForUser
} = require('../helpers/userHelpers');

const {
  assert
} = require('chai');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('userIdOfEmail', function () {
  it('should return a user with valid email', function () {
    const user = userIdOfEmail(testUsers, "user@example.com");
    const expectedUserID = "userRandomID";
    assert.equal(expectedUserID, user);
  });

});