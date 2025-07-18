import * as React from 'react';
import ArticleDetail from '@/src/components/articles/articleDetail';

export default function DetailPost({params,}: {params: Promise<{ id: string }>;}) {
  const { id } : {id:string} =  React.use(params);
  return (
    <ArticleDetail id={id}></ArticleDetail>
  );
}
