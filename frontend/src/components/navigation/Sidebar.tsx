'use client';

import Link from 'next/link';

interface SidebarProps {
  isExpanded: boolean;
  onToggle: () => void;
  onHoverChange: (expanded: boolean) => void;
}

export default function Sidebar({ isExpanded, onToggle, onHoverChange }: SidebarProps) {

  return (
    <nav
      style={{
        width: isExpanded ? '200px' : '60px',
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isExpanded ? 'flex-start' : 'center',
      }}
      onMouseEnter={() => onHoverChange(true)} // 마우스 진입 시 확장
      onMouseLeave={() => onHoverChange(false)} // 마우스 이탈 시 축소
    >

      <div onClick={onToggle} style={{ cursor: 'pointer', alignSelf: 'flex-end', marginBottom: '20px' }}>
        <span>☰</span>
      </div>

      {/* 내비게이션 아이템 목록 */}
      <ul style={{ listStyle: 'none', padding: 0, width: '100%' }}>
        <li>
          <Link href="/posts" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
            <span>🏠</span>
            {isExpanded && <span>게시물</span>}
          </Link>
        </li>
        <li>
          <Link href="/users" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white' }}>
            <span>👤</span>
            {isExpanded && <span>사용자</span>}
          </Link>
        </li>
        <li>
          <Link href="https://github.com/ljm0850">
            {isExpanded && <span>github</span>}
          </Link>
        </li>
        <li>
          <Link href="">
          {isExpanded && <span>blog</span>}
          </Link>
        </li>
        <li>
          {isExpanded && <div>문의: dlwoals0850@gmail.com</div>}
        </li>
      </ul>
    </nav>
  );
}