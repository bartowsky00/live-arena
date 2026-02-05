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
  console.log('🔍 Cercando eventi duplicati...\n')

  // Ottieni tutti gli eventi
  const events = await client.fetch(`
    *[_type == "event"] | order(_createdAt desc) {
      _id,
      artist,
      "slug": slug.current,
      date,
      _createdAt,
      image
    }
  `)

  // Raggruppa per slug
  const eventsBySlug = {}
  for (const event of events) {
    const slug = event.slug
    if (!eventsBySlug[slug]) {
      eventsBySlug[slug] = []
    }
    eventsBySlug[slug].push(event)
  }

  const toDelete = []

  for (const [slug, duplicates] of Object.entries(eventsBySlug)) {
    if (duplicates.length > 1) {
      console.log(`📋 ${duplicates[0].artist} (${slug}): ${duplicates.length} copie`)

      // Ordina: preferisci quelli con immagine, poi i più recenti, poi non-draft
      duplicates.sort((a, b) => {
        // Prima quelli con immagine
        if (a.image && !b.image) return -1
        if (!a.image && b.image) return 1
        // Poi non-draft
        const aIsDraft = a._id.startsWith('drafts.')
        const bIsDraft = b._id.startsWith('drafts.')
        if (!aIsDraft && bIsDraft) return -1
        if (aIsDraft && !bIsDraft) return 1
        // Poi più recenti
        return new Date(b._createdAt) - new Date(a._createdAt)
      })

      // Mantieni il primo, elimina gli altri
      const keep = duplicates[0]
      console.log(`   ✅ Mantengo: ${keep._id} (${keep._createdAt})`)

      for (let i = 1; i < duplicates.length; i++) {
        const dup = duplicates[i]
        console.log(`   🗑️  Elimino: ${dup._id}`)
        toDelete.push(dup._id)
      }
      console.log('')
    }
  }

  if (toDelete.length === 0) {
    console.log('✅ Nessun duplicato trovato!')
    return
  }

  console.log(`\n🗑️  Eliminando ${toDelete.length} duplicati...`)

  // Elimina in batch
  const transaction = client.transaction()
  for (const id of toDelete) {
    transaction.delete(id)
  }

  await transaction.commit()

  console.log('\n🎉 Pulizia completata!')

  // Mostra riepilogo finale
  const remaining = await client.fetch(`count(*[_type == "event"])`)
  console.log(`📊 Eventi rimasti: ${remaining}`)
}

main().catch(err => {
  console.error('Errore:', err.message)
  process.exit(1)
})
