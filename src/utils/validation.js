export const isEmail = (value) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value);
};

export const isNotEmpty = (value) => {
  return value.trim() !== "";
};

export const hasMinLength = (value, minLength) => {
  return value.length >= minLength;
};
