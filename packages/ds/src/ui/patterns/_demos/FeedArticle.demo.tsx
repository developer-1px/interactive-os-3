import { FeedArticle } from '../FeedArticle'
export default () => (
  <ul>
    <FeedArticle posinset={1} setsize={1} header={<strong>Article header</strong>}>
      Article body content here.
    </FeedArticle>
  </ul>
)
