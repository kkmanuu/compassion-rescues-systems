export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  export const validatePassword = (password) => {
    return password.length >= 8;
  };
  
  export const validateCaseForm = (formData) => {
    const errors = {};
    if (!formData.location) errors.location = 'Location is required';
    if (!formData.description) errors.description = 'Description is required';
    return errors;
  };