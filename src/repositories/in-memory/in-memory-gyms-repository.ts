import { Gym, Prisma, User } from '@prisma/client'
import { GymsRepositories } from '../gyms-repositories'

export class InMemoryGymsRepository implements GymsRepositories {
  public items: Gym[] = []

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }
}
