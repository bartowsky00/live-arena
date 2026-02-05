import { isSanityConfigured, getEvents, getUpcomingEvents, getPastEvents, getEventsByVenue, type Event, type VenueRef } from './sanity';
import eventsData from '../data/events.json';

// Formatta la data per la visualizzazione
function formatDate(dateStr: string, dateEndStr?: string): string {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

  if (dateEndStr) {
    const dateEnd = new Date(dateEndStr);
    if (date.getMonth() === dateEnd.getMonth() && date.getFullYear() === dateEnd.getFullYear()) {
      return `${date.getDate()}-${dateEnd.getDate()} ${date.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}`;
    }
    return `${date.toLocaleDateString('it-IT', options)} - ${dateEnd.toLocaleDateString('it-IT', options)}`;
  }

  return date.toLocaleDateString('it-IT', options);
}

// Converte i dati JSON locali nel formato Event
function convertLocalEvent(event: typeof eventsData.events[0]): Event {
  return {
    _id: event.id,
    artist: event.artist,
    slug: event.id,
    tour: event.tour,
    date: event.date,
    dateEnd: event.dateEnd,
    image: event.image,
    description: event.description,
    status: event.status as Event['status'],
    ticketOne: event.ticketOne || undefined,
    ticketZeta: event.ticketZeta || undefined,
    prices: event.prices,
    // Default venue for local events (Live Arena)
    venue: {
      name: 'Live Arena',
      slug: 'live-arena',
      shortName: 'live-arena',
      address: 'Via Esa Chimento, 92100 Agrigento AG',
      isIndoor: false
    }
  };
}

// Verifica se un evento è passato
function isEventPast(event: Event): boolean {
  const eventDate = new Date(event.dateEnd || event.date);
  const today = new Date();
  return eventDate < today;
}

// Aggiunge dateDisplay formattata e corregge lo status
function addDateDisplay(events: Event[]): (Event & { dateDisplay: string })[] {
  return events.map(event => ({
    ...event,
    dateDisplay: formatDate(event.date, event.dateEnd),
    // Se l'evento è passato, forza lo status a 'past'
    status: isEventPast(event) ? 'past' : event.status,
  }));
}

// Ottiene tutti gli eventi
export async function getAllEvents(): Promise<(Event & { dateDisplay: string })[]> {
  if (isSanityConfigured) {
    try {
      const events = await getEvents();
      if (events.length > 0) {
        return addDateDisplay(events);
      }
    } catch (error) {
      console.warn('Errore Sanity, uso dati locali:', error);
    }
  }

  // Fallback ai dati locali
  const events = eventsData.events.map(convertLocalEvent);
  return addDateDisplay(events);
}

// Ottiene gli eventi futuri (basandosi sulla data, non sullo status)
export async function getUpcoming(): Promise<(Event & { dateDisplay: string })[]> {
  const today = new Date();

  if (isSanityConfigured) {
    try {
      const events = await getUpcomingEvents();
      if (events.length > 0) {
        // Filtra per data, non per status
        const futureEvents = events.filter(e => new Date(e.dateEnd || e.date) >= today);
        return addDateDisplay(futureEvents);
      }
    } catch (error) {
      console.warn('Errore Sanity, uso dati locali:', error);
    }
  }

  // Fallback ai dati locali - filtra per data
  const events = eventsData.events
    .filter(e => new Date(e.dateEnd || e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(convertLocalEvent);
  return addDateDisplay(events);
}

// Ottiene gli eventi passati (basandosi sulla data, non sullo status)
export async function getPast(): Promise<(Event & { dateDisplay: string })[]> {
  const today = new Date();

  if (isSanityConfigured) {
    try {
      const allEvents = await getEvents();
      if (allEvents.length > 0) {
        // Filtra per data, non per status
        const pastEvents = allEvents.filter(e => new Date(e.dateEnd || e.date) < today);
        return addDateDisplay(pastEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    } catch (error) {
      console.warn('Errore Sanity, uso dati locali:', error);
    }
  }

  // Fallback ai dati locali - filtra per data
  const events = eventsData.events
    .filter(e => new Date(e.dateEnd || e.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(convertLocalEvent);
  return addDateDisplay(events);
}

// Ottiene eventi per venue specifica
export async function getEventsByVenueSlug(venueSlug: string): Promise<(Event & { dateDisplay: string })[]> {
  if (isSanityConfigured) {
    try {
      const events = await getEventsByVenue(venueSlug);
      if (events.length > 0) {
        return addDateDisplay(events);
      }
    } catch (error) {
      console.warn('Errore Sanity, uso dati locali:', error);
    }
  }

  // Fallback ai dati locali - filtra per venueSlug (default live-arena)
  const events = eventsData.events
    .filter(e => venueSlug === 'live-arena') // Tutti i dati locali sono Live Arena
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(convertLocalEvent);
  return addDateDisplay(events);
}

// Ottiene eventi futuri per venue specifica
export async function getUpcomingByVenue(venueSlug: string): Promise<(Event & { dateDisplay: string })[]> {
  const today = new Date();
  const allVenueEvents = await getEventsByVenueSlug(venueSlug);
  return allVenueEvents.filter(e => new Date(e.dateEnd || e.date) >= today);
}

// Ottiene eventi passati per venue specifica
export async function getPastByVenue(venueSlug: string): Promise<(Event & { dateDisplay: string })[]> {
  const today = new Date();
  const allVenueEvents = await getEventsByVenueSlug(venueSlug);
  return allVenueEvents
    .filter(e => new Date(e.dateEnd || e.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
