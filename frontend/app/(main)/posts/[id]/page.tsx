import * as React from 'react';
export default function DetailPost({params,}: {params: Promise<{ id: string }>;}) {
  const { id } =  React.use(params)
  return (
    <div>
      {id}번 게시글 확인
    </div>
  );
}
