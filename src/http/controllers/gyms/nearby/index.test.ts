import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby a gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Near gym',
        description: 'Some description.',
        phone: '123456789',
        latitude: -7.2419178,
        longitude: -35.8825136,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Far gym',
        description: 'Some description.',
        phone: '123456789',
        latitude: -7.0329137,
        longitude: -35.8663189,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -7.2419178,
        longitude: -35.8825136,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'Near gym',
      }),
    ])
  })
})
