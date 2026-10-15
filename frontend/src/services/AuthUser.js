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