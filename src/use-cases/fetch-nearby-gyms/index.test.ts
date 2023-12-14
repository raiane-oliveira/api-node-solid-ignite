import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, it, expect } from 'vitest'
import { FetchNearbyGymsUseCase } from '.'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near gym',
      latitude: -7.2419178,
      longitude: -35.8825136,
    })

    await gymsRepository.create({
      title: 'Far gym',
      latitude: -7.0329137,
      longitude: -35.8663189,
    })

    const { gyms } = await sut.execute({
      userLatitude: -7.2419178,
      userLongitude: -35.8825136,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near gym' })])
  })
})
