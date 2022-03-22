import { BigInt } from '@graphprotocol/graph-ts';

import { Account, Twab } from '../../generated/schema';
import { Ticket__getAccountDetailsResultValue0Struct } from '../../generated/Ticket/Ticket';

export const setTwab = (
    twab: Twab,
    account: Account,
    accountDetails: Ticket__getAccountDetailsResultValue0Struct,
    amount: BigInt,
    timestamp: BigInt,
): void => {
    twab.account = account.id;
    twab.amount = amount;
    twab.delegateBalance = accountDetails.balance;
    twab.timestamp = timestamp;
};
