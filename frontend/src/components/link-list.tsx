import * as React from 'react'
import { Option } from 'catling'
import { Link, CreateVote } from '../api/types'
import { ProposalItem, List, ListItem } from './'

interface Props {
  links: Link[]
  onVote: (vote: CreateVote) => any
  userId: Option<number>
}

export function LinkList({ links, onVote, userId }: Props) {
  return (
    <List>
      {links.map((link, i) => (
        <ListItem key={link.id}>
          <ProposalItem key={i} proposal={link} onVote={onVote} userId={userId} />
        </ListItem>
      ))}
    </List>
  )
}

export default LinkList
