import { Member } from './member'

export interface Department {
  id: number
  name: string
  members: Member[]
}
