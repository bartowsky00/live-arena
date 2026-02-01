import { createClient, type SanityClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Configurazione Sanity
const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || '';
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

// Controlla se Sanity è configurato
export const isSanityConfigured = projectId && projectId !== 'IL_TUO_PROJECT_ID' && /^[a-z0-9-]+$/.test(projectId);

// Client lazy - creato solo se configurato
let _client: SanityClient | null = null;

export function getClient(): SanityClient | null {
  if (!isSanityConfigured) return null;

  if (!_client) {
    _client = createClient({
      projectId,
      dataset,
      useCdn: true,
      apiVersion: '2024-01-01',
    });
  }
  return _client;
}

// Helper per generare URL delle immagini
export function urlFor(source: SanityImageSource) {
  const client = getClient();
  if (!client) return null;
  return imageUrlBuilder(client).image(source);
}

// Query per ottenere tutti gli eventi
export async function getEvents(): Promise<Event[]> {
  const client = getClient();
  if (!client) return [];

  return client.fetch(`
    *[_type == "event"] | order(date asc) {
      _id,
      artist,
      "slug": slug.current,
      tour,
      date,
      dateEnd,
      time,
      "image": image.asset->url,
      description,
      status,
      ticketOne,
      ticketZeta,
      prices,
      featured
    }
  `);
}

// Query per ottenere gli eventi in programma
export async function getUpcomingEvents(): Promise<Event[]> {
  const client = getClient();
  if (!client) return [];

  return client.fetch(`
    *[_type == "event" && status != "past"] | order(date asc) {
      _id,
      artist,
      "slug": slug.current,
      tour,
      date,
      dateEnd,
      time,
      "image": image.asset->url,
      description,
      status,
      ticketOne,
      ticketZeta,
      prices,
      featured
    }
  `);
}

// Query per ottenere gli eventi passati
export async function getPastEvents(): Promise<Event[]> {
  const client = getClient();
  if (!client) return [];

  return client.fetch(`
    *[_type == "event" && status == "past"] | order(date desc) {
      _id,
      artist,
      "slug": slug.current,
      tour,
      date,
      "image": image.asset->url,
      description,
      status
    }
  `);
}

// Query per ottenere un singolo evento
export async function getEvent(slug: string): Promise<Event | null> {
  const client = getClient();
  if (!client) return null;

  return client.fetch(`
    *[_type == "event" && slug.current == $slug][0] {
      _id,
      artist,
      "slug": slug.current,
      tour,
      date,
      dateEnd,
      time,
      "image": image.asset->url,
      description,
      status,
      ticketOne,
      ticketZeta,
      prices
    }
  `, { slug });
}

// Query per le impostazioni del sito
export async function getSiteSettings() {
  const client = getClient();
  if (!client) return null;

  return client.fetch(`
    *[_type == "siteSettings"][0] {
      title,
      description,
      "heroVideo": heroVideo.asset->url,
      "heroImage": heroImage.asset->url,
      socialInstagram,
      socialFacebook,
      address,
      vatNumber
    }
  `);
}

// Tipo per gli eventi
export interface Event {
  _id: string;
  artist: string;
  slug: string;
  tour?: string;
  date: string;
  dateEnd?: string;
  time?: string;
  image: string;
  description?: string;
  status: 'coming-soon' | 'on-sale' | 'sold-out' | 'past';
  ticketOne?: string;
  ticketZeta?: string;
  prices?: { type: string; price: number }[];
  featured?: boolean;
}
