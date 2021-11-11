const generateRandomString = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
};

const emailLookup = (userDB, email) => {
  for (const user in userDB) {
    if (userDB[user].email === email) {
      return true;
    }
  }
  return false;
};

module.exports = {
  generateRandomString,
  emailLookup
};