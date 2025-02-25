export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const handleFormSubmit = (data) => {
  // Handle form submission logic here
  // e.g., make an API call to register the freelancer
  console.log("Form submitted with data:", data);
};

export const handleDynamicInputChange = (setter) => (event) => {
  const { value } = event.target;
  setter(value.split(',').map(item => item.trim()));
};
