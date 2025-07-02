import { CounterDisplay } from "@/src/components/testComponent/CounterDisplay";
import UserInfoComponent from '@/src/components/testComponent/UserInfoComponent';
// 가상의 API 호출
const queryTest = async (delay: number = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ message: 'Hello from React Query!', timestamp: new Date().toLocaleTimeString() });
    }, delay);
  });
};

export default async function TestPage() {

  // React Query
  const data = await queryTest(); 

  return (
    <div>
      <hr/>
      <UserInfoComponent />
      <CounterDisplay />
      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px dashed #ccc' }} />

      <h2>React Query 데이터 페칭 테스트 (서버 상태 - 직접 fetch)</h2>
      <p>메시지: <strong style={{ color: '#007bff' }}>{data?.message}</strong></p>
      <p>데이터 가져온 시간: <strong style={{ color: '#28a745' }}>{data?.timestamp}</strong></p>
      <p style={{ fontSize: '0.8em', color: '#666', marginTop: '5px' }}>
        (이 데이터는 서버에서 미리 가져왔습니다.)
      </p>
    </div>
  );
}