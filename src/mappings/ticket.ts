import { Delegated, NewUserTwab, Ticket } from '../../generated/Ticket/Ticket';
import { generateCompositeId, ZERO } from '../helpers/common';
import { loadOrCreateAccount } from '../helpers/loadOrCreateAccount';
import { loadOrCreateTicket } from '../helpers/loadOrCreateTicket';
import { createTwab } from '../helpers/createTwab';
import { createDelegation } from '../helpers/createDelegation';

export function handleDelegated(event: Delegated): void {
    const delegate = event.params.delegator;
    const delegatee = event.params.delegate;
    const timestamp = event.block.timestamp;

    // We don't record delegation to themselves
    if (delegate.toHex() != delegatee.toHex()) {
        const delegateAccount = loadOrCreateAccount(delegate.toHexString());
        const delegateeAccount = loadOrCreateAccount(delegatee.toHexString());

        let delegation = createDelegation(
            generateCompositeId(delegate.toHexString(), timestamp.toHexString()),
        );

        delegation.delegate = delegateAccount.id;
        delegation.delegatee = delegateeAccount.id;
        delegation.timestamp = timestamp;
        delegation.save();
    }
}

export function handleNewUserTwab(event: NewUserTwab): void {
    // load Account entity for the to address
    const delegate = event.params.delegate;

    const ticketAddress = event.address.toHexString();
    loadOrCreateTicket(ticketAddress);

    const timestamp = event.block.timestamp;

    const account = loadOrCreateAccount(delegate.toHexString());

    // If just created set ticket field
    if (account.ticket == null) {
        account.ticket = ticketAddress;
    }

    const ticketContract = Ticket.bind(event.address);
    const delegateTwab = ticketContract.getAccountDetails(delegate);
    const balance = ticketContract.balanceOf(delegate);

    account.balance = balance;
    account.delegateBalance = delegateTwab.balance;
    account.delegatedBalance = delegateTwab.balance.gt(balance)
        ? delegateTwab.balance.minus(balance)
        : ZERO;

    let twab = createTwab(generateCompositeId(delegate.toHexString(), timestamp.toHexString()));
    twab.timestamp = timestamp;
    twab.amount = event.params.newTwab.amount;
    twab.account = account.id;
    twab.delegateBalance = delegateTwab.balance;
    twab.save();

    account.save();
}
