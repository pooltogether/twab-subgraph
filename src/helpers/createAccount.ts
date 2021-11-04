import { Account } from '../../generated/schema';

export function createAccount(id: string): Account {
    let delegateAccount = Account.load(id);

    // create case
    if (delegateAccount == null) {
        delegateAccount = new Account(id);
    }

    return delegateAccount as Account;
}
