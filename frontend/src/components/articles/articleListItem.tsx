import { Post } from "@/src/lib/api";
import Link from "next/link";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';


export default function ArticleItem({articleItem}:{articleItem:Post}){
  const articleDetailUrl = `/posts/${articleItem.id}`
  return (
    <div>
      <Link href={articleDetailUrl}>글 제목:{articleItem.title}</Link>
    </div>
  )
}