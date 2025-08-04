import GoogleLoginButton from "@/src/components/ui/GoogleLoginBtn";

export default function LoginPage(){
  return (
    <GoogleLoginButton backendAuthUrl="http://localhost/api/auth/google"></GoogleLoginButton>
  )
}