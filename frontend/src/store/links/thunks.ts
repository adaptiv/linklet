import { Dispatch } from 'react-redux'
import { reset } from 'redux-form'

import actions from '../../store/actions'

import api from '../../api'

import { State } from '../index'
import { CreateLink, CreateVote } from '../../api/types'
import { isEmpty } from 'ramda'

export function fetchLinks(page: number = 1) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(actions.SetLoading(true))
    ;(await api().links.all({ page }))
      .map(links => {
        dispatch(actions.SetLinks(links))
      })
      .leftMap(err => {
        dispatch(actions.flashAlert(err.message, 'danger'))
      })
    dispatch(actions.SetLoading(false))
  }
}

export function fetchLink(linkId: string) {
  return async (dispatch: Dispatch<any>) => {
    dispatch(actions.SetLoading(true))
    ;(await api().links.fetch(linkId)).map(link => {
      dispatch(actions.SetLinks([link]))
    })
    dispatch(actions.SetLoading(false))
  }
}

export function fetchLinksIfNeeded() {
  return (dispatch: Dispatch<any>, getState: () => State) => {
    if (isEmpty(getState().links.items)) {
      dispatch(fetchLinks())
    }
  }
}

export function fetchLinkIfNeeded(linkId: string) {
  return (dispatch: Dispatch<any>, getState: () => State) => {
    if (!getState().links.items[linkId]) {
      dispatch(fetchLink(linkId))
    }
  }
}

export function saveLink(link: CreateLink) {
  return async (dispatch: Dispatch<any>, getState: () => State) => {
    const state = getState()
    if (!state.auth.token) {
      dispatch(
        actions.flashAlert(
          'No auth token present. Cannot create link',
          'danger',
        ),
      )
    } else {
      dispatch(actions.SetLoading(true))
      ;(await api().links.create(state.auth.token, link))
        .map(newLink => {
          dispatch(actions.flashAlert('Link Saved!', 'success'))
          dispatch(reset('link'))
        })
        .leftMap(err => dispatch(actions.flashAlert(err.message, 'danger')))
      dispatch(actions.SetLoading(false))
    }
  }
}

export function vote(vote: CreateVote) {
  return async (dispatch: Dispatch<any>, getState: () => State) => {
    const state = getState()
    if (!state.auth.token || !state.auth.user) {
      dispatch(actions.flashAlert('You have to be logged in to vote', 'danger'))
    } else {
      dispatch(
        actions.UpdateVote(vote.link_id, state.auth.user.id, vote.direction),
      )
      await api().votes.create(state.auth.token, vote)
    }
  }
}
