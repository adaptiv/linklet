import * as React from 'react'

interface Props {
  description: string
}

export function ProposalDescription({ description }: Props) {
  return (
    <div>{description}</div>
  )
}

export default ProposalDescription
