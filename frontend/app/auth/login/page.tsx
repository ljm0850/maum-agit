import GoogleLoginButton from "@/src/components/ui/GoogleLoginBtn";
// css
import styles from './Login.module.css'

export default function LoginPage(){
  return (
   <div className={styles.loginContainer}>
        <div className={styles.formSection}>
          <div>
            <GoogleLoginButton backendAuthUrl="http://localhost/api/auth/google"></GoogleLoginButton>
          </div>
        </div>
        <div className={styles.imageSection} />
        <div className={styles.loginImageOverlay}></div>
    </div>
  )
}


{/* <GoogleLoginButton backendAuthUrl="http://localhost/api/auth/google"></GoogleLoginButton>   */}