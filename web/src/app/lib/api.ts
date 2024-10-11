import axios from "axios";

const BASE_URL = process.env.NEXT_API_URL;

export const createResume = async ({
  jobDescription,
  resume,
}: {
  jobDescription: string;
  resume: string;
}) => {
  const result = await axios.post(`${BASE_URL}/api/resume`, {
    jobDescription,
    resume,
  });

  return result.data;
};

export const getResumeText = async ({}: {}) => {
  const result = await axios.get(`${BASE_URL}/api/resume/text`);
  return result.data;
};

export const authUrl = `${BASE_URL}/auth/google`;
