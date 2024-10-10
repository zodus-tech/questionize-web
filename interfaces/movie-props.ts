import { Genre } from './genre'

export interface MovieProps {
  id: number
  title: string
  description: string
  voteAverage: number
  poster: string
  genres: Genre[]
}
