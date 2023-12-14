import { Gym, Prisma } from '@prisma/client'

export interface GymsRepositories {
  findById(id: string): Promise<Gym | null>
  create(data: Prisma.GymCreateInput): Promise<Gym>
  searchMany(query: string, page: number): Promise<Gym[]>
}
