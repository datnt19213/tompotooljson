import axios from "axios";

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston",
});

export const excuteCode = async (language: string, sourceCode: string) => {
  const response = await API.post("/execute", {
    language: language,
    version: "5.0.3",
    files: [
      {
        content: sourceCode,
      },
    ],
  });
  return response.data;
};
