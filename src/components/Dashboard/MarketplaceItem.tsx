import React from 'react'

type MarketplaceItemProps = {
    id: string;
}

export default function MarketplaceItem({ id }: MarketplaceItemProps) {
  return (
    <div>MarketplaceItem: {id}</div>
  )
}
