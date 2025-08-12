'use client';

// import Link from 'next/link';
import LogoutButton from '../ui/LogoutBtn';
import UnregisterButton from '../ui/UnregisterBtn';
import { useAuthStore } from '@/src/stores/authStore';
import { useUiStore } from '@/src/stores/uiStore';
// css
import styles from './Sidebar.module.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Row } from 'react-bootstrap';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onHoverChange: (expanded: boolean) => void;
}

export default function Sidebar({ isExpanded, onToggle, onHoverChange }: SidebarProps) {
  // 내 정보
  const userData = useAuthStore.getState().user;
  const sidebarClasses = `${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`;
  const selectedLinkClasses = `${styles.active}`
  // store
  const { currentPath } = useUiStore();
  const isActive = (path: string) => currentPath.startsWith(path);
  return (
      <nav
      className={sidebarClasses}
      onMouseEnter={() => onHoverChange(true)} // 마우스 진입 시 확장
      onMouseLeave={() => onHoverChange(false)} // 마우스 이탈 시 축소
    >
      <Navbar>
        <Container>
          {!isExpanded &&<span>☰</span>}
          {isExpanded && <Navbar.Brand href="/" ><h4 className={currentPath==='/'?selectedLinkClasses:''}>마음 아지트</h4></Navbar.Brand>}
        </Container>
      </Navbar>
      {isExpanded && <div>
      {/* 로그인시 */}
      {userData?
      <div>
        <Navbar>
          <Container>
            <Row>
              {/* <Navbar.Brand href='/user/profile'> */}
              <Navbar.Brand href='/posts'>
                  <span className={isActive('/posts') ? selectedLinkClasses:''}>게시물</span>
              </Navbar.Brand>
              <br />
              <Navbar.Brand><Nav.Link href='/user/profile' disabled>
                  <span className={isActive('/user/profile')? selectedLinkClasses:''} style={{color:'#808080'}}>내 정보</span>
              </Nav.Link></Navbar.Brand>
            </Row>
          </Container>
        </Navbar>
        <br />
        {/* 로그인 정보 */}
        <Container>
          <Row>
            <b>{userData.username} 님</b>
            <div>안녕하세요.</div>
          </Row>
        </Container>
        <br />
        {/* 버튼들 */}
      <Container>
        <LogoutButton />
        <br />
        <UnregisterButton />
      </Container>
      <br/>
      </div>
      :
      // 비로그인시
      <Container>
        <Navbar>
          <Navbar.Brand href='/auth/login'>
            <span className={isActive('/auth/login') ? selectedLinkClasses:''}>로그인</span>
            </Navbar.Brand>
        </Navbar>
      </Container>
      }
      <hr></hr>
      {/* 외부 링크 */}
      <Navbar>
        <Container>
          <h4>외부 링크</h4>
        </Container>
      </Navbar>
      
      <Navbar>
        <Container>
          <Navbar.Brand href="https://github.com/ljm0850">
            <span>🖊️github</span>
          </Navbar.Brand>
        </Container>
      </Navbar>
      
      <Navbar>
        <Container>
          <Navbar.Brand href="https://ljm0850.tistory.com/">
            <span>📚블로그</span>
          </Navbar.Brand>
        </Container>
      </Navbar>
      </div>
      }
    </nav>
  );
}