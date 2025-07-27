import { useQuery } from "@tanstack/react-query";
import { UserInfo, getMyInfo } from "../lib/api";

const freshTime = 1000 * 60 * 5; // 5분

export const useMyInfoQuery = () => {
  return useQuery<UserInfo>({
    queryKey:['user','me'],
    queryFn: getMyInfo,
    staleTime: freshTime,
  })
}
