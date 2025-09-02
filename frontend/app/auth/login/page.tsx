import GoogleLoginButton from "@/src/components/ui/GoogleLoginBtn";
// css
import styles from './Login.module.css'

export default function LoginPage(){
  const domain = process.env.NEXT_PUBLIC_API_URL?process.env.NEXT_PUBLIC_API_URL:'localhost:3000'
  const backendAuthUrl = `${domain}/api/auth/google`;
  return (
   <div className={styles.loginContainer}>
        <div className={styles.formSection}>
          <div>
            <GoogleLoginButton backendAuthUrl={backendAuthUrl}></GoogleLoginButton>
          </div>
        </div>
        <div className={styles.imageSection} />
        <div className={styles.loginImageOverlay}></div>
    </div>
  )
}


{/* <GoogleLoginButton backendAuthUrl="http://localhost/api/auth/google"></GoogleLoginButton>   */}