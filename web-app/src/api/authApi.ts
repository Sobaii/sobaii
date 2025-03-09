import fetchWrapper from "./fetchWrapper";

const baseUrl = `${import.meta.env.VITE_SERVER_URL}/auth`;

export const signUpUserWithGoogle = async () => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  return await fetchWrapper(`${baseUrl}/google`, options);
};

export const getUserGoogleInfo = async () => {
  const options = {
    method: "GET",
  };

  return await fetchWrapper(`${baseUrl}/google/userinfo`, options);
};
