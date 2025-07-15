import axios from "axios";

export interface Post {
  id: number;
  title: string;
  content: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostListItemDto {
  id: string;
  title: string;
  purifiedContent?: string;
  createdAt: string;
  updatedAt: string;
  tags?: { id: string; name: string }[];
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

export const getMyInfo = async (): Promise<UserInfo> => {
  const res = await apiClient.get('users/me');
  return res.data;
}

export const getMyPostList = async (
  page: number=1,
  limit: number=10,
  tag?: string
): Promise<PostListItemDto[]> => {
  const params: { page: number; limit: number; tag?: string } = {
    page,
    limit,
  };
  if (tag) params.tag = tag;
  try {
    const res = await apiClient.get('posts', { params });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response){
      throw new Error(error.response.data.message || `API Error: ${error.response.status}`);
    } else {
      throw new Error('알수 없는 에러')
    }
  }
}