import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, it, expect } from 'vitest'
import { SearchGymsUseCase } from '.'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search gyms by its title', async () => {
    await gymsRepository.create({
      title: 'Software gym',
      latitude: -7.4324,
      longitude: 32.3232,
    })

    await gymsRepository.create({
      title: 'Java gym',
      latitude: -7.4324,
      longitude: 32.3232,
    })

    await gymsRepository.create({
      title: 'JavaScript gym',
      latitude: -7.4324,
      longitude: 32.3232,
    })

    const { gyms } = await sut.execute({
      query: 'java',
      page: 1,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Java gym' }),
      expect.objectContaining({ title: 'JavaScript gym' }),
    ])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 0; i < 22; i++) {
      await gymsRepository.create({
        title: `gym-${i + 1}`,
        latitude: 0,
        longitude: 0,
      })
    }

    const { gyms } = await sut.execute({
      query: 'gym',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'gym-21' }),
      expect.objectContaining({ title: 'gym-22' }),
    ])
  })
})
