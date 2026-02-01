import { isSanityConfigured, getEvents, getUpcomingEvents, getPastEvents, type Event } from './sanity';
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
  };
}

// Aggiunge dateDisplay formattata agli eventi
function addDateDisplay(events: Event[]): (Event & { dateDisplay: string })[] {
  return events.map(event => ({
    ...event,
    dateDisplay: formatDate(event.date, event.dateEnd),
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

// Ottiene gli eventi futuri
export async function getUpcoming(): Promise<(Event & { dateDisplay: string })[]> {
  if (isSanityConfigured) {
    try {
      const events = await getUpcomingEvents();
      if (events.length > 0) {
        return addDateDisplay(events);
      }
    } catch (error) {
      console.warn('Errore Sanity, uso dati locali:', error);
    }
  }

  // Fallback ai dati locali
  const events = eventsData.events
    .filter(e => e.status !== 'past')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(convertLocalEvent);
  return addDateDisplay(events);
}

// Ottiene gli eventi passati
export async function getPast(): Promise<(Event & { dateDisplay: string })[]> {
  if (isSanityConfigured) {
    try {
      const events = await getPastEvents();
      if (events.length > 0) {
        return addDateDisplay(events);
      }
    } catch (error) {
      console.warn('Errore Sanity, uso dati locali:', error);
    }
  }

  // Fallback ai dati locali
  const events = eventsData.events
    .filter(e => e.status === 'past')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(convertLocalEvent);
  return addDateDisplay(events);
}
