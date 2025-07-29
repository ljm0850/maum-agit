import { Post } from "@/src/lib/api";
import Card from 'react-bootstrap/Card';
import styles from "./articleListItem.module.css"

export default function ArticleItem({article}:{article:Post}){
  return (
    <div>
      <Card className={styles.articleItem}>
      <Card.Body>
        <Card.Title>{article.title}</Card.Title>
        {/* <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle>
        <Card.Link href="#">Card Link</Card.Link>
        <Card.Link href="#">Another Link</Card.Link> */}
      </Card.Body>
    </Card>


    </div>
  )
}