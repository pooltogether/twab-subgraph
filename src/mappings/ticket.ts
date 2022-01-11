import { NewUserTwab, Ticket } from '../../generated/Ticket/Ticket';
import { generateCompositeId, ZERO } from '../helpers/common';
import { loadOrCreateAccount } from '../helpers/loadOrCreateAccount';
import { loadOrCreateTicket } from '../helpers/loadOrCreateTicket';
import { createTwab } from '../helpers/createTwab';

export function handleNewUserTwab(event: NewUserTwab): void {
    // load Account entity for the to address
    const delegate = event.params.delegate;

    const ticketAddress = event.address.toHexString();
    loadOrCreateTicket(ticketAddress);

    const timestamp = event.block.timestamp;

    const account = loadOrCreateAccount(delegate.toHexString());

    // if just created set ticket field
    if (account.ticket == null) {
        account.ticket = ticketAddress;
    }

    // bind to Ticket and get the balanceOf (this is the amount being Delegated)
    const ticketContract = Ticket.bind(event.address);
    const accountDetails = ticketContract.getAccountDetails(delegate); // rpc call to get the account details of the delegate

    // update the balance of the delegate
    account.delegateBalance = accountDetails.balance;

    let twab = createTwab(generateCompositeId(delegate.toHexString(), timestamp.toHexString()));
    twab.timestamp = timestamp;
    twab.amount = event.params.newTwab.amount;
    twab.account = account.id;
    twab.delegateBalance = accountDetails.balance;
    twab.save();

    // save accounts
    account.save();
}
