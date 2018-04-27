import * as React from 'react'
import styled, { css } from 'react-emotion'
import { Option } from 'catling'
import { colors, spacing } from '../styles'
import { Link, CreateVote } from '../api/types'
import { ProposalDescription, LinkMeta, ArrowUp, ButtonLink } from './'

interface Props {
  proposal: Link
  onVote: (vote: CreateVote) => any
  userId: Option<number>
}

const ScoreContainer = styled('div')`
  font-size: 25px;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.grey};
`

const arrowContainerStyle = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 45px;
  width: 17px;
  margin-right: ${spacing.s2};
`

const arrowStyle = (voted: boolean) => css`
  fill: ${voted ? colors.grey : colors.greyLight};
`

export function ProposalItem({ proposal, onVote, userId }: Props) {
  const vote = userId
    .flatMap(id => Option(proposal.votes.find(v => v.user_id === id)))
    .map(v => v.direction)
    .getOrElse(0)

  const score = proposal.votes.reduce((sum, v) => sum + v.direction, 0)

  const upvoteChange = vote === 1 ? 0 : 1

  return (
    <div style={{ display: 'flex' }}>
      <ScoreContainer>{score}</ScoreContainer>
      <div className={arrowContainerStyle}>
        <ButtonLink
          onClick={() =>
            onVote({
              direction: upvoteChange,
              link_id: proposal.id,
            })
          }
        >
          <ArrowUp className={arrowStyle(vote === 1)} />
        </ButtonLink>
      </div>
      <div>
        <h4>{proposal.title}</h4>
        <ProposalDescription description={proposal.url} />
        <LinkMeta
          username={proposal.user.username}
          linkDate={proposal.inserted_at}
          linkId={proposal.id}
          commentCount={proposal.comments_count}
        />
      </div>
    </div>
  )
}

export default ProposalItem
