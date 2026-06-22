export function validateProfile(data = {}) {
  const errors = {};

  if (!data.name?.trim()) {
    errors.name = "Name is required";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.email = "Invalid email";
  }

  if (!data.phone?.trim()) {
    errors.phone = "Phone is required";
  } else if (!/^\d{10}$/.test(data.phone)) {
    errors.phone = "Phone must be 10 digits";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}


export function validateSocialLinks(data = {}) {

  const linkedin = data?.linkedin || "";
  const github = data?.github || "";


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