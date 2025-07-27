import { unregister } from "../lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUserUnregister = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn:()=>unregister(),
    onSuccess:()=>{
      localStorage.removeItem('accessToken'); 
      queryClient.clear();
      alert("회원 탈퇴되었습니다.");
    }
  })
}