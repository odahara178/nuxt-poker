export type Suit = '♠' | '♥' | '♦' | '♣'
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A'
export type HandRank =
  | 'HIGH_CARD'
  | 'ONE_PAIR'
  | 'TWO_PAIR'
  | 'THREE_OF_A_KIND'
  | 'STRAIGHT'
  | 'FLUSH'
  | 'FULL_HOUSE'
  | 'FOUR_OF_A_KIND'
  | 'STRAIGHT_FLUSH'
  | 'ROYAL_FLUSH'

export interface Card {
  suit: Suit
  rank: Rank
  id: string
  faceUp: boolean
}

export interface EvaluatedHand {
  rank: HandRank
  rankIndex: number
  bestFive: Card[]
  tiebreakers: number[]
  label: string
  detail: string
}
