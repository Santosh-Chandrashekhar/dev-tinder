const signUpDataValidation = (data) => {
  const { firstName, lastName } = data;
  if (!firstName || !lastName) {
    throw new Error("First name or Last name is not given");
  }
};

module.exports = { signUpDataValidation };
