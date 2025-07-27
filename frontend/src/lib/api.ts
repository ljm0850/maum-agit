import axios from "axios";

export interface Post {
  id: string;
  title: string;
  originalContent: string;
  purifiedContent?: string;
  createdAt: string;
  updatedAt: string;
  tags?: { id: string; name: string }[];
}
export interface PostFormDto {
  title: string,
  originalContent: string,
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

// 유저
export const getMyInfo = async (): Promise<UserInfo> => {
  const res = await apiClient.get('users/me');
  return res.data;
}

export const unregister = async() => {
  const res = await apiClient.delete('users/me');
  return res.data;
} 

// 게시글
export const getMyPostList = async (
  page: number=1,
  limit: number=10,
  tag?: string
): Promise<Post[]> => {
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

export const getMyPostById = async (id:string): Promise<Post> => {
  try {
    const res = await apiClient.get(`posts/${id}`)
    return res.data;
  } catch (error) {
    console.log('글 조회 에러',error)
    throw new Error('글 조회에서 에러 발생')
  }
}

export const createPost = async (postData: PostFormDto):Promise<Post> => {
  try {
    const res = await apiClient.post('posts',postData);
    return res.data;
  } catch(error) {
    console.log(error);
    throw new Error('게시글 작성에서 오류가 발생하였습니다.');
  }

}

export const updatePost = async (id:string ,postData: PostFormDto): Promise<Post> => {
  try {
      const res = await apiClient.patch(`posts/${id}`,postData);
      return res.data;
    } catch (error) {
      console.log(error);
      throw new Error('게시글 수정에서 오류가 발생하였습니다.');
    }
}

export const deletePost = async (postId:string): Promise<void> => {
  try {
    const res = apiClient.delete(`posts/${postId}`);
    console.log(res)
  } catch (error) {
    console.log(error);
    throw new Error('게시글 삭제에서 오류가 발생하였습니다.')
  }
}