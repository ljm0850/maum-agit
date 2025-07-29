'use client';

// import Link from 'next/link';
import LogoutButton from '../ui/LogoutBtn';
import UnregisterButton from '../ui/UnregisterBtn';
import { useAuthStore } from '@/src/stores/authStore';

// css
import styles from './Sidebar.module.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onHoverChange: (expanded: boolean) => void;
}

export default function Sidebar({ isExpanded, onToggle, onHoverChange }: SidebarProps) {
  // 내 정보
  const userData = useAuthStore.getState().user;
  const sidebarClasses = `${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`;
  
  return (
      <nav
      className={sidebarClasses}
      onMouseEnter={() => onHoverChange(true)} // 마우스 진입 시 확장
      onMouseLeave={() => onHoverChange(false)} // 마우스 이탈 시 축소
    >
      <Navbar>
        <Container>
          <span>☰</span>
          {isExpanded && <Navbar.Brand href="/">마음 아지트</Navbar.Brand>}
        </Container>
      </Navbar>
      {isExpanded && <div>
      {/* 로그인 정보 */}
      <Navbar>
        <Container>
          {userData ? 
          (<p><div><b>{userData.username}</b>님</div><div>안녕하세요.</div></p>)
          :(<p>로그인이 필요합니다.</p>)}
        </Container>
      </Navbar>
      <br/>
      
      {/* 링크들 */}
      {userData &&
      <div>
        <Navbar>
          <Container>
            <Navbar.Brand href='/posts'>
                <span>게시물</span>
            </Navbar.Brand>
          </Container>
        </Navbar>
        <br />
      </div>
      }
      
      <Navbar>
        <Container>
          <Navbar.Brand href="https://github.com/ljm0850">
            <span>github</span>
          </Navbar.Brand>
        </Container>
      </Navbar>
      <br />
      
      <Navbar>
        <Container>
          <Navbar.Brand href="https://ljm0850.tistory.com/">
            <span>블로그</span>
          </Navbar.Brand>
        </Container>
      </Navbar>
      {/* 로그아웃 & 회원탈퇴 버튼 */}
      {userData && <div>
        <LogoutButton></LogoutButton>
        <UnregisterButton></UnregisterButton>
        </div>
        }
      </div>
      }
    </nav>
  );
}

{/* <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
            React Bootstrap
          </Navbar.Brand>
        </Container>
      </Navbar> */}