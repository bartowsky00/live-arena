#!/usr/bin/env node
import { createClient } from '@sanity/client'
import https from 'https'
import http from 'http'

const SANITY_TOKEN = process.env.SANITY_TOKEN

if (!SANITY_TOKEN) {
  console.error('❌ Errore: SANITY_TOKEN non trovato.')
  console.log('Esegui: SANITY_TOKEN="il-tuo-token" node scripts/update-palaforum-images.mjs')
  process.exit(1)
}

const client = createClient({
  projectId: '4xmmsipb',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: SANITY_TOKEN,
  useCdn: false,
})

// Scarica immagine da URL e restituisce buffer
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Segui redirect
        return downloadImage(response.headers.location).then(resolve).catch(reject)
      }

      const chunks = []
      response.on('data', chunk => chunks.push(chunk))
      response.on('end', () => resolve(Buffer.concat(chunks)))
      response.on('error', reject)
    }).on('error', reject)
  })
}

async function main() {
  const eventsToUpdate = [
    {
      slug: 'roberto-vecchioni-2026',
      imageUrl: 'https://sportvillagebellavia.it/wp-content/uploads/2026/02/587227369_1613804436692766_702466765282016781_n.jpg',
      filename: 'roberto-vecchioni-2026.jpg'
    },
    {
      slug: 'la-sera-dei-miracoli-tributo-lucio-dalla-2026',
      imageUrl: 'https://sportvillagebellavia.it/wp-content/uploads/2025/10/554920116_1560406868699190_693765007083760629_n.jpg',
      filename: 'la-sera-dei-miracoli-2026.jpg'
    }
  ]

  for (const eventData of eventsToUpdate) {
    console.log(`\n📷 Elaborando: ${eventData.slug}`)

    // Trova l'evento
    const event = await client.fetch(
      `*[_type == "event" && slug.current == $slug][0]{ _id, artist, image }`,
      { slug: eventData.slug }
    )

    if (!event) {
      console.log(`⚠️  Evento non trovato: ${eventData.slug}`)
      continue
    }

    if (event.image) {
      console.log(`⏭️  "${event.artist}" ha già un'immagine, saltato`)
      continue
    }

    console.log(`📥 Scaricando immagine...`)

    try {
      const imageBuffer = await downloadImage(eventData.imageUrl)
      console.log(`   Dimensione: ${(imageBuffer.length / 1024).toFixed(1)} KB`)

      console.log(`📤 Caricando su Sanity...`)
      const imageAsset = await client.assets.upload('image', imageBuffer, {
        filename: eventData.filename,
      })

      console.log(`🔗 Collegando all'evento...`)
      await client.patch(event._id)
        .set({
          image: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageAsset._id,
            }
          }
        })
        .commit()

      console.log(`✅ "${event.artist}" aggiornato con immagine`)
    } catch (err) {
      console.error(`❌ Errore per ${eventData.slug}:`, err.message)
    }
  }

  console.log('\n🎉 Completato!')
}

main().catch(err => {
  console.error('Errore:', err.message)
  process.exit(1)
})
