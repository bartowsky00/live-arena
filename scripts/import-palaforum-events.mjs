#!/usr/bin/env node
import { createClient } from '@sanity/client'

const SANITY_TOKEN = process.env.SANITY_TOKEN

if (!SANITY_TOKEN) {
  console.error('❌ Errore: SANITY_TOKEN non trovato.')
  process.exit(1)
}

const client = createClient({
  projectId: '4xmmsipb',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: SANITY_TOKEN,
  useCdn: false,
})

async function main() {
  console.log('🔍 Cercando venue Palaforum...')

  // Trova la venue Palaforum
  let venues = await client.fetch(`*[_type == "venue"]{ _id, name, shortName }`)
  console.log('Venue trovate:', venues)

  let palaforum = venues.find(v =>
    v.shortName === 'palaforum' ||
    v.name?.toLowerCase().includes('palaforum')
  )

  // Se non esiste, creala
  if (!palaforum) {
    console.log('⚠️  Venue Palaforum non trovata, la creo...')

    const newVenue = await client.create({
      _type: 'venue',
      name: 'Palaforum Giuseppe Bellavia',
      slug: { _type: 'slug', current: 'palaforum' },
      shortName: 'palaforum',
      description: 'Un vero gioiello per chi ama arte e spettacolo. Acustica eccellente, attrezzature professionali, sedute comode e illuminazione avanzata. Il Palaforum Giuseppe Bellavia è la struttura ideale per concerti, spettacoli teatrali ed eventi culturali.',
      address: 'Via Esa Chimento, 92100 Agrigento AG',
      capacity: '2000+',
      features: ['Al coperto', 'Acustica eccellente', 'Parcheggio', 'Accessibile', 'Climatizzato'],
      isIndoor: true,
    })

    console.log(`✅ Venue creata: ${newVenue.name} (${newVenue._id})`)
    palaforum = newVenue
  } else {
    console.log(`✅ Venue trovata: ${palaforum.name} (${palaforum._id})`)
  }

  // Eventi da importare (solo futuri)
  const events = [
    {
      _type: 'event',
      artist: 'La Sera dei Miracoli',
      slug: { _type: 'slug', current: 'la-sera-dei-miracoli-tributo-lucio-dalla-2026' },
      tour: 'Tributo a Lucio Dalla',
      date: '2026-03-28',
      time: '21:00',
      status: 'on-sale',
      description: 'Un tributo speciale al grande maestro della musica italiana Lucio Dalla.',
      venue: { _type: 'reference', _ref: palaforum._id },
    },
    {
      _type: 'event',
      artist: 'Roberto Vecchioni',
      slug: { _type: 'slug', current: 'roberto-vecchioni-2026' },
      tour: 'Tra il silenzio e il tuono Tour',
      date: '2026-05-02',
      time: '21:00',
      status: 'on-sale',
      description: 'Un viaggio tra poesia, musica e racconti con il nuovo spettacolo teatrale del celebre artista.',
      venue: { _type: 'reference', _ref: palaforum._id },
    },
  ]

  console.log('')
  console.log('📝 Importando eventi...')

  for (const event of events) {
    // Controlla se esiste già
    const existing = await client.fetch(
      `*[_type == "event" && slug.current == $slug][0]`,
      { slug: event.slug.current }
    )

    if (existing) {
      console.log(`⏭️  "${event.artist}" già esistente, saltato`)
      continue
    }

    const created = await client.create(event)
    console.log(`✅ Creato: "${event.artist}" (${created._id})`)
  }

  console.log('')
  console.log('🎉 Importazione completata!')
}

main().catch(err => {
  console.error('Errore:', err.message)
  process.exit(1)
})
