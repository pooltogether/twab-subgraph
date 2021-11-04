import { log } from '@graphprotocol/graph-ts';
import { NewUserTwab, Ticket } from '../generated/Ticket/Ticket';
import { loadOrCreateAccount } from './helpers/loadOrCreateAccount';
import { generateCompositeId, ZERO } from './helpers/common';
import { createTwab } from './helpers/createTwab';

export function handleNewUserTwab(event: NewUserTwab): void {
    log.warning('newUserTwab handler', []);
    // load Account entity for the to address
    const delegate = event.params.delegate;
    const ticketAddress = event.address.toHexString();
    const timestamp = event.block.timestamp;

    const delegateAccount = loadOrCreateAccount(delegate.toHexString());

    // if just created set ticket field
    if (delegateAccount.ticket == null) {
        delegateAccount.ticket = ticketAddress;
    }

    // bind to Ticket and get the balanceOf (this is the amount being Delegated)
    const ticketContract = Ticket.bind(event.address);
    log.warning('getting account details', []);
    const delegateAccountDetails = ticketContract.getAccountDetails(delegate); // rpc call to get the account details of the delegate

    // update the balance of the delegate
    delegateAccount.delegateBalance = delegateAccountDetails.balance;

    // if the balance is 0 set zeroBalanceOccurredAt
    if (delegateAccount.delegateBalance.equals(ZERO)) {
        delegateAccount.zeroBalanceOccurredAt = event.block.timestamp;
    }

    // create twab
    log.warning('creating twab', []);
    let twab = createTwab(generateCompositeId(delegate.toHexString(), timestamp.toHexString()));
    twab.timestamp = timestamp;
    twab.amount = delegateAccountDetails.balance;
    twab.account = delegateAccount.id;
    twab.save();

    log.warning('saving', []);
    // save the accounts
    delegateAccount.save();
}
