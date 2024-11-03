import axios from "axios";
import { BASE_URL } from "./constants";

export const createResume = async ({
  jobDescription = "",
  resume,
}: {
  jobDescription: string;
  resume: string;
}) => {
  try {
    const result = await axios.post(`${BASE_URL}/ai/create-resume`, {
      jobDescription,
      resume,
    });
    return result.data.result;
  } catch (error) {
    console.log(error);
  }

  return null;
};

export const getProfile = async () => {
  const result = await axios.get(`${BASE_URL}/profile`);
  return result.data.result;
};

export const authUrl = `${BASE_URL}/auth/google`;
