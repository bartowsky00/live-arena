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

// Query per ottenere tutti gli eventi con venue
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
      featured,
      "venue": venue->{
        name,
        "slug": slug.current,
        shortName,
        address,
        isIndoor
      }
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
      featured,
      "venue": venue->{
        name,
        "slug": slug.current,
        shortName,
        address,
        isIndoor
      }
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
      status,
      "venue": venue->{
        name,
        "slug": slug.current,
        shortName,
        address,
        isIndoor
      }
    }
  `);
}

// Query per ottenere eventi per venue specifica
export async function getEventsByVenue(venueSlug: string): Promise<Event[]> {
  const client = getClient();
  if (!client) return [];

  return client.fetch(`
    *[_type == "event" && venue->slug.current == $venueSlug] | order(date asc) {
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
      featured,
      "venue": venue->{
        name,
        "slug": slug.current,
        shortName,
        address,
        isIndoor
      }
    }
  `, { venueSlug });
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
      prices,
      "gallery": gallery[]{
        "url": asset->url,
        "caption": caption
      },
      "venue": venue->{
        name,
        "slug": slug.current,
        shortName,
        address,
        coordinates,
        isIndoor
      }
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

// Query per venue singola
export async function getVenue(slug: string): Promise<Venue | null> {
  const client = getClient();
  if (!client) return null;

  return client.fetch(`
    *[_type == "venue" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      shortName,
      description,
      address,
      coordinates,
      capacity,
      features,
      openingYear,
      "coverImage": coverImage.asset->url,
      "gallery": gallery[]{
        "url": asset->url,
        "caption": caption
      },
      isIndoor
    }
  `, { slug });
}

// Query per tutte le venue
export async function getVenues(): Promise<Venue[]> {
  const client = getClient();
  if (!client) return [];

  return client.fetch(`
    *[_type == "venue"] | order(name asc) {
      _id,
      name,
      "slug": slug.current,
      shortName,
      description,
      address,
      capacity,
      "coverImage": coverImage.asset->url,
      isIndoor
    }
  `);
}

// Tipo per le venue
export interface Venue {
  _id: string;
  name: string;
  slug: string;
  shortName: string;
  description?: string;
  address?: string;
  coordinates?: string;
  capacity?: string;
  features?: string[];
  openingYear?: number;
  coverImage?: string;
  gallery?: { url: string; caption?: string }[];
  isIndoor: boolean;
}

// Tipo per la venue minima (nei riferimenti evento)
export interface VenueRef {
  name: string;
  slug: string;
  shortName: string;
  address?: string;
  isIndoor: boolean;
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
  gallery?: { url: string; caption?: string }[];
  venue?: VenueRef;
}
