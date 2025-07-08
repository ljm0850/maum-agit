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
    const token = localStorage.getItem('accessToken'); // localStorage에서 토큰 가져오기
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