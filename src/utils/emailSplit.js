function extractUsernameFromEmail(email) {
  const atIndex = email.indexOf("@");
  if (atIndex !== -1) {
    return email.slice(0, atIndex);
  } else {
    return null; // Return null if no '@' symbol is found (invalid email)
  }
}

module.exports = {
  extractUsernameFromEmail,
};
