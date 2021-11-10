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

    const delegateAccount = loadOrCreateAccount(delegate.toHexString());

    // if just created set ticket field
    if (delegateAccount.ticket == null) {
        delegateAccount.ticket = ticketAddress;
    }

    // bind to Ticket and get the balanceOf (this is the amount being Delegated)
    const ticketContract = Ticket.bind(event.address);

    const delegateAccountDetails = ticketContract.getAccountDetails(delegate); // rpc call to get the account details of the delegate

    // update the balance of the delegate
    delegateAccount.delegateBalance = delegateAccountDetails.balance;

    // if the balance is 0 set zeroBalanceOccurredAt
    if (delegateAccount.delegateBalance == ZERO) {
        delegateAccount.zeroBalanceOccurredAt = event.block.timestamp;
    } else {
        delegateAccount.zeroBalanceOccurredAt = null;
    }

    let twab = createTwab(generateCompositeId(delegate.toHexString(), timestamp.toHexString()));

    twab.timestamp = timestamp;
    twab.amount = delegateAccountDetails.balance;
    twab.account = delegateAccount.id;
    twab.delegateBalance = delegateAccountDetails.balance;
    twab.save();

    // save accounts
    delegateAccount.save();
}
