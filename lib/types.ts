export interface Event {
  instagram: string
  date: string
  artists: string
  time: string
  ticketLink: string
  price: string
  minPrice: number
  timeValue: number
  timeCategory: string
  venue: string
}

export interface FilterOptions {
  search: string
  priceRange: number[]
  timeOfDay: string[]
  eventType: string[]
  sortBy: string
}
