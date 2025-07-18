import { PostListItemDto } from "@/src/lib/api";
import Link from "next/link";

export default function ArticleItem({articleItem}:{articleItem:PostListItemDto}){
  const articleDetailUrl = `/posts/${articleItem.id}`
  return (
    <div>
      <Link href={articleDetailUrl}>글 제목:{articleItem.title}</Link>
    </div>
  )
}