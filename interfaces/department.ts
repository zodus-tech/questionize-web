import { Member } from './member'

export interface Department {
  id: string
  name: string
  members: Member[]
}
