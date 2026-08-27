import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nezzel.com'
  const currentDate = new Date()

  const routes = [
    // Homepage
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 1,
    },

    // Gold section
    {
      url: `${baseUrl}/gold`,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gold/calculator`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gold/zakat`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },

    // Silver section
    {
      url: `${baseUrl}/silver`,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/silver/calculator`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },

    // Currency section
    {
      url: `${baseUrl}/currencies`,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/currencies/calculator`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/currency/analytics`,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 0.7,
    },

    // Crypto section
    {
      url: `${baseUrl}/crypto`,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/crypto/calculator`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    },

    // Charts & History
    {
      url: `${baseUrl}/chart`,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/history`,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },

    // News
    {
      url: `${baseUrl}/news`,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    },

    // Static pages
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Karat pages
  const karats = ['k24', 'k21', 'k18']
  karats.forEach(karat => {
    routes.push({
      url: `${baseUrl}/karat/${karat}`,
      lastModified: currentDate,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    })
  })

  return routes
}
