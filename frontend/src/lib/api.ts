import axios from "axios";

const API_BASE_URL = '/api/';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('accessToken')??'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZDNlNTFlMi1jMWVlLTQxZTctYTRlZi00ODE0YTc3NGI0MWUiLCJ1c2VybmFtZSI6ImphZW1pbiBsZWUiLCJpYXQiOjE3NTE0NDcxMzMsImV4cCI6MTc1MTQ1MDczM30.6XyFkdYstM_730fHzDCGVhz23pnDm0F9lO9PxSQ7Rys'; // localStorage에서 토큰 가져오기
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4NmNkY2IyOS1iNDY3LTRiNGMtYTkzYy00MTY5ODRmNDgwNzMiLCJ1c2VybmFtZSI6ImRlZXBkaXZlIGxvYSIsImlhdCI6MTc1MTQ0OTU0MiwiZXhwIjoxNzUxNDUzMTQyfQ.p5KBy-XOWfMikcnkJ0RQSQ5Owo5BFBA5gK1TdTIpNac'; // 임시 하드코딩
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Post {
  id: number;
  title: string;
  content: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
    id: string,
    username: string,
    email: string,
    providerName: string,
    providerId: string,
    profileImageUrl?: string|null,
    // createdAt: Date,
    // updatedAt: Date,
    createdAt: string,
    updatedAt: string,
    posts: Post[],
}

export const getMyInfo = async (): Promise<UserInfo> => {
  const res = await apiClient.get('users/me');
  return res.data;
}