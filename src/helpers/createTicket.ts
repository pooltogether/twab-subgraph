import { Ticket } from '../../generated/schema';

// should always be creating a Ticket
export function createTicket(id: string): Ticket {
    let ticket = Ticket.load(id);

    // create case
    if (ticket == null) {
        ticket = new Ticket(id);
    }

    return ticket as Ticket;
}
