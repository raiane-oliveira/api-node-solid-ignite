import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepositories } from '../gyms-repositories'
import { randomUUID } from 'crypto'
import { Decimal } from '@prisma/client/runtime/library'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepositories {
  public items: Gym[] = []

  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id)

    if (!gym) {
      return null
    }

    return gym
  }

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      latitude: new Decimal(data.latitude.toString()),
      longitude: new Decimal(data.longitude.toString()),
      phone: data.phone ?? null,
    }

    this.items.push(gym)
    return gym
  }

  async searchMany(query: string, page: number) {
    const gyms = this.items
      .filter((item) =>
        item.title.toLowerCase().trim().includes(query.toLowerCase().trim()),
      )
      .slice((page - 1) * 20, page * 20)

    return gyms
  }

  async findManyNearby(params: FindManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )

      return distance < 10 // 10 km
    })
  }
}
