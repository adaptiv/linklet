import * as React from 'react'

import { State } from '../../store/index'

import { Dispatch, connect } from 'react-redux'
import { Redirect } from 'react-router'
import { reduxForm, SubmitHandler } from 'redux-form'
import { saveLink } from '../../store/links/thunks'
import PaddedCard from '../../components/padded-card'
import Button from '../../components/button'
import FormInput from '../../components/form-input'
import Label from '../../components/label'

interface FormProps {
  handleSubmit: SubmitHandler<Fields, {}>
}

interface Fields {
  title: string
  url: string
}

const LinkForm = reduxForm<Fields>({
  form: 'link',
})((props: FormProps) => {
  const { handleSubmit } = props
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="title">Title</Label>
        <FormInput name="title" component="input" type="text" />
      </div>
      <div>
        <Label htmlFor="url">URL</Label>
        <FormInput name="url" component="input" type="text" />
      </div>
      <Button type="submit">Save Link</Button>
    </form>
  )
})

interface StateMappedToProps {
  isLoggedIn: boolean
}
interface DispatchMappedToProps {
  saveLink: (fields: Fields) => any
}
interface Props extends StateMappedToProps, DispatchMappedToProps {}

export function Login({ isLoggedIn, saveLink }: Props) {
  if (!isLoggedIn) {
    return <Redirect to="/login" />
  }

  return (
    <PaddedCard>
      <h1>New Link</h1>
      <LinkForm onSubmit={saveLink} />
    </PaddedCard>
  )
}

function mapStateToProps(state: State) {
  return { isLoggedIn: state.auth.token !== null }
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    saveLink: (form: Fields) => dispatch(saveLink(form)),
  }
}

export default connect<StateMappedToProps, DispatchMappedToProps>(
  mapStateToProps,
  mapDispatchToProps,
)(Login)
