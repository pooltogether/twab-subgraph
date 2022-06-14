import { Account } from '../../generated/schema';
import { generateCompositeId } from '../helpers/common';

export function loadOrCreateAccount(accountAddress: string, ticketAddress: string): Account {
    const id = generateCompositeId(ticketAddress, accountAddress);

    let account = Account.load(id);

    // create case
    if (account == null) {
        account = new Account(id);
        account.address = accountAddress;
    }

    return account as Account;
}
