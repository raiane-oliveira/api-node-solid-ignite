import { Gym } from '@prisma/client'

export interface GymsRepositories {
  findById(id: string): Promise<Gym | null>
}
