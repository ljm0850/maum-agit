'use client';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';

export default function IntroducePage() {
  return (
    <Container>
    <Tabs
      defaultActiveKey="projectBackground"
      id="fill-tab-example"
      className="mb-3"
      fill
    >
      <Tab eventKey="projectBackground" title="프로젝트 기획배경">
          <Card border="info">
            <Container>
                <li>긴 시간 동안 느낀 부정적인 감정들을 고찰하며 떠올린 프로젝트입니다.</li>
                <li>자신의 감정을 되돌아 볼 수 있는 서비스를 만들고자 했습니다.</li>
                <li>부정적인 감정들을 나중에 되돌아 보면 별 일이 아닌 경우가 대부분이기에, 이를 강조하는 프로젝트를 생각했습니다.</li>
            </Container>
          </Card>
      </Tab>
      <Tab eventKey="projectObjective" title="프로젝트 목표">
        <Card border="info">
          <Container>
            <li>백엔드 & 프론트엔드 & 배포까지 이어지는 풀스택에 대한 경험</li>
            <li>Javascript기반 백엔드인 Nuxt.js에 대한 경험</li>
            <li>Next.js의 SSR에 대한 경험</li>
            <li>AI를 활용한 코딩에 대한 경험</li>
          </Container>
        </Card>
      </Tab>
      <Tab eventKey="navigation" title="네비게이션">
        <Card border='success'>
          <Container>
            <details>
              <summary>비로그인시</summary>
              <li>로그인 Link</li>
            </details>
            <br />
            <details>
              <summary>로그인시</summary>
              <li>내 정보, 게시물 <b>Link</b>(현재 주소에 맞춰 색 변화)</li>
              <li>사용자 이름 님 안녕하세요</li>
              <li>로그아웃/회원탈퇴(임시) 버튼</li>
            </details>
            <br />
            <li>개발 깃허브 및 개발 블로그 외부 링크</li>
          </Container>
        </Card>
      </Tab>
      <Tab eventKey="login" title="로그인">
        <Card border='success'>
          <Container>
            <li>구글 OAuth 로그인</li>
            <li>구글 로그인 후 콜백 페이지에서 accessToken을 이용하여 유저 정보 획득 및 리다이렉트 하는 방식</li>
          </Container>
        </Card>
      </Tab>

      <Tab eventKey="posts" title="게시물 기능">
        <Card border='success'>
          <Container>
            <li>자신이 작성한 글만 확인 가능</li>
            <br />
            <details>
              <summary>글 쓰기</summary>
              <li>모달 창 활용</li>
              <li>현재는 제목, 본문으로 구성</li>
              <li>조만간 태그 혹은 color 선택박스 추가 예정</li>
              <li>미 입력시 안내문구</li>
              <li>작성 중 모달 창 종료시 작성중이던 글 저장</li>
            </details>
            <br />
            <details>
              <summary>글 수정</summary>
              <li>글 디테일에서 수정 버튼을 작동시 모달창이 뜸</li>
              <li>글 쓰기와 같은 모달창을 활용, 선택된 detail 여부에 따라 수정/쓰기</li>
              <li>미 입력시 안내문구</li>
              <li>작성 중 모달 창 종료시 수정중이던 글 저장</li>
            </details>
            <br />
            <details>
              <summary>글 목록</summary>
              <li>프로젝트 기획 배경을 고려하여 페이지네이션 대신 무한스크롤 채택</li>
              <li>선택한 컬러에 따라 카드 색 변경 추가 예정</li>
              <li>현재는 글의 제목만 띄워두고 있으나, Ai를 활용하여 글의 키워드, 요약 혹은 일러스트를 띄우는 방식 고려중</li>
            </details>
            <br />
            <details>
              <summary>글 디테일</summary>
              <li>현재는 제목, 본문, 작성일 정도만 표기</li>
              <li>글 수정 및 삭제 버튼</li>
            </details>
          </Container>
        </Card>
      </Tab>
      <Tab eventKey="ect" title="페쇄 목록">
        <Card>
          <Container>
            <details>
              <summary>내 정보</summary>
              <li>/user/profile</li>
              <li>내 정보창이 필요할 정도의 기능은 없어 잠시 폐기</li>
              <li>추후 게시물에 모두에게 공개되는 글을 만든다면, 필요하다고 판단</li>
            </details>
            <br />
            <details>
              <summary>게시물 디테일 페이지</summary>
              <li>/posts/[id]</li>
              <li>초기엔 디테일 페이지를 따로 뒀으나, 게시글을 읽는 방식이 프로젝트 방향에 비해 너무 무겁다고 판단하여 변경</li>
            </details>
          </Container>
        </Card>
      </Tab>
    </Tabs>
  </Container>
  )
}