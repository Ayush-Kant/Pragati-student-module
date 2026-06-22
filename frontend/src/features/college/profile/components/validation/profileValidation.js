export function validateProfile(data) {
  return {
    isValid: true,
    errors: {},
  };
}


export function validateSocialLinks(data = {}) {

  const linkedin = data.linkedin || "";
  const github = data.github || "";


  const urlRegex =
    /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/;


  if (linkedin && !urlRegex.test(linkedin)) {
    return {
      isValid: false,
      message: "Invalid LinkedIn URL",
    };
  }


  if (github && !urlRegex.test(github)) {
    return {
      isValid: false,
      message: "Invalid GitHub URL",
    };
  }


  return {
    isValid: true,
    message: "",
  };
}