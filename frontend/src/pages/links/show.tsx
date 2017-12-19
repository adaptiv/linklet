import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Option } from 'catling'

import { State } from '../../store'
import { RouteComponentProps } from 'react-router'
import NotFound from '../404'
import { Link, Comment } from '../../api/types'
import { values, isEmpty } from 'ramda'
import { SubmitHandler, reduxForm } from 'redux-form'
import { fetchLinksIfNeeded } from '../../store/links/thunks'
import {
  fetchComments,
  deleteComment,
  postComment,
} from '../../store/comments/thunks'

import { getUserIdFromToken } from '../../utils/auth'
import {
  Card,
  CardSection,
  PaddedCard,
  LinkHeading,
  Button,
  CommentList,
  FormInput,
  Label,
  SectionHeading,
  LinkMeta,
} from '../../components'

interface FormProps {
  handleSubmit: SubmitHandler<Fields, {}>
}

interface Fields {
  body: string
}

const CommentForm = reduxForm<Fields>({
  form: 'comment',
})((props: FormProps) => {
  const { handleSubmit } = props

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="body">Comment</Label>
        <FormInput name="body" component="textarea" type="text" rows={1} />
      </div>
      <Button type="submit">Post Comment</Button>
    </form>
  )
})

interface Params {
  id: string
}

interface StateMappedToProps {
  links: Record<string, Link>
  comments: Record<string, Comment>
  loading: boolean
  userId: Option<number>
}
interface DispatchMappedToProps {
  fetchLinksIfNeeded: () => void
  fetchComments: (linkId: string) => void
  postComment: (linkId: string) => (fields: Fields) => any
  deleteComment: (linkId: string, commentId: string) => void
}

interface Props
  extends StateMappedToProps,
    DispatchMappedToProps,
    RouteComponentProps<Params> {}

export class ShowLink extends React.Component<Props> {
  componentDidMount() {
    this.props.fetchLinksIfNeeded()
    this.props.fetchComments(this.props.match.params.id)
  }

  render() {
    const link = this.props.links[this.props.match.params.id]

    if (!link) {
      return NotFound()
    }

    const onDeleteComment = (commentId: number) => {
      this.props.deleteComment(link.id.toString(), commentId.toString())
    }

    const onPostComment = this.props.postComment(link.id.toString())
    const comments = values(this.props.comments)
    return (
      <div>
        <PaddedCard>
          <LinkHeading url={link.url} title={link.title} />
          <LinkMeta
            username={link.user.username}
            linkDate={link.inserted_at}
            linkId={link.id}
            commentCount={link.comments_count}
          />
        </PaddedCard>

        <Card>
          <CardSection>
            <SectionHeading>Comments</SectionHeading>
          </CardSection>

          <CommentList
            comments={comments}
            onDelete={onDeleteComment}
            userId={this.props.userId}
          />
          {isEmpty(comments) && <CardSection>None yet</CardSection>}
        </Card>

        {this.props.userId
          .map(() => (
            <PaddedCard>
              <CommentForm onSubmit={onPostComment} />
            </PaddedCard>
          ))
          .get()}
      </div>
    )
  }
}
function mapStateToProps({ links, ui, comments, auth }: State) {
  return {
    links: links.items,
    comments: comments.items,
    loading: ui.loading,
    userId: getUserIdFromToken(auth.token),
  }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    fetchLinksIfNeeded: () => dispatch(fetchLinksIfNeeded()),
    fetchComments: (linkId: string) => dispatch(fetchComments(linkId)),
    deleteComment: (linkId: string, commentId: string) =>
      dispatch(deleteComment(linkId, commentId)),
    postComment: (linkId: string) => (fields: Fields) =>
      dispatch(postComment(linkId, fields.body)),
  }
}

export default connect<StateMappedToProps, DispatchMappedToProps>(
  mapStateToProps,
  mapDispatchToProps,
)(ShowLink)
