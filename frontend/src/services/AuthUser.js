import axios from "axios";

export const UserRegister = async (APIURL, registerUser) => {
  try {
    const response = await axios.post(APIURL, registerUser, {withCredentials: true});
    return response;
  } catch (error) {
    console.log("Status:", error.response?.status);
    console.log("Error details:", error.response?.data);
    throw error;
  }
};

export const UserLogin = async (APIURL, loginUser) => {
  try {
    const response = await axios.post(APIURL, loginUser, { withCredentials: true });
    return response;
  } catch (err) {
    console.log("status:", err.response?.status);
    console.log("Error Details :", err.response?.data);
    throw errss
  }
}