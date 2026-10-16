import axios from "axios";

export const UserRegister = async (APIURL, registerUser) => {
  try {
    const response = await axios.post(APIURL, registerUser, { withCredentials: true });
    return response;
  } catch (error) {
    console.log("Status:", error.response?.status);
    console.log("Error details:", error.response?.data);
    throw error;
  }
};

export const UserLogin = async (APIURL, loginUser) => {
  console.log("APIURL : ", APIURL);
  console.log("login user details : ", loginUser);
  try {
    const response = await axios.post(APIURL, loginUser, { withCredentials: true });
    return response;
  } catch (err) {
    console.log("status:", err.response?.status);
    console.log("Error Details :", err.response?.data);
    throw err;
  }
}

export const UserProfile = async (APIURL, accessTokenObject) => {
  console.log("Profile API URL :", APIURL);
  console.log("Access Token Object :", accessTokenObject);
  try {
    const respone = await axios.get(APIURL, accessTokenObject, { withCredentials: true });
    return respone;
  } catch (err) {
    console.log("status:", err.response?.status);
    console.log("Error Details :", err.response?.data);
    throw err;
  }
}

export const AccessTokenFromRrfreshToken = async (COOKIESURL, refreshToken) => {
  console.log("Refresh Page URL :", COOKIESURL);
  console.log("Refresh Token Object :", refreshToken);
  try {
    const response = await axios.post(COOKIESURL, {}, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    });
    // http://localhost:5555/api/auth/refresh-token public API
    return response;
  } catch (error) {
    console.log("status:", error.response?.status);
    console.log("Error Details :", error.response?.data);
    throw error;
  }
}

export const UserLogout = async (APIURL) => {
  console.log("Profile API URL :", APIURL);
  try {
    const respone = await axios.post(APIURL, {}, { withCredentials: true });
    return respone;
  } catch (err) {
    console.log("status:", err.response?.status);
    console.log("Error Details :", err.response?.data);
    throw err;
  }
}

export const DeleteUser = async (APIURL, accessToken) => {
  console.log("This is my URL for API :", APIURL);
  console.log("This is my Access token while select during delete user :", accessToken);
  try {
    const response = axios.delete(APIURL, {
      withCredentials: true, headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    return response;
  } catch (err) {
    console.log("status:", err.response?.status);
    console.log("Error Details :", err.response?.data);
    throw err;
  }
}