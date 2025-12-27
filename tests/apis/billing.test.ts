import { rokka } from '../mockServer'
import nock from 'nock'

describe('billing', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('billing.get', () => {
    it('gets billing data without date range', async () => {
      nock('https://api.rokka.io')
        .get('/billing/myorg')
        .query(true) // Match any query
        .reply(200, {
          total_traffic: 1000000,
          total_storage: 500000,
          total_operations: 10000,
        })

      const resp = await rokka().billing.get('myorg')

      expect(resp.body.total_traffic).toBe(1000000)
      expect(resp.body.total_storage).toBe(500000)
      expect(resp.body.total_operations).toBe(10000)
    })

    it('gets billing data with date range', async () => {
      nock('https://api.rokka.io')
        .get('/billing/myorg')
        .query({ from: '2024-01-01', to: '2024-01-31' })
        .reply(200, {
          from: '2024-01-01',
          to: '2024-01-31',
          total_traffic: 500000,
          total_storage: 250000,
          total_operations: 5000,
          daily: [
            { date: '2024-01-01', traffic: 10000 },
            { date: '2024-01-02', traffic: 15000 },
          ],
        })

      const resp = await rokka().billing.get(
        'myorg',
        '2024-01-01',
        '2024-01-31',
      )

      expect(resp.body.from).toBe('2024-01-01')
      expect(resp.body.to).toBe('2024-01-31')
      expect(resp.body.daily).toHaveLength(2)
    })

    it('gets billing data with only from date', async () => {
      nock('https://api.rokka.io')
        .get('/billing/myorg')
        .query({ from: '2024-01-01' })
        .reply(200, {
          from: '2024-01-01',
          total_traffic: 750000,
        })

      const resp = await rokka().billing.get('myorg', '2024-01-01')

      expect(resp.body.from).toBe('2024-01-01')
    })

    it('handles error response for unauthorized access', async () => {
      nock('https://api.rokka.io')
        .get('/billing/myorg')
        .query(true) // Match any query
        .reply(403, {
          error: {
            message: 'Forbidden: You do not have access to billing data',
          },
        })

      try {
        await rokka().billing.get('myorg')
        fail('Expected an error to be thrown')
      } catch (error: any) {
        expect(error.statusCode).toBe(403)
      }
    })
  })
})
