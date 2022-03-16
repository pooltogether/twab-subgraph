import { Address } from '@graphprotocol/graph-ts';

import { Account } from '../../generated/schema';
import { Ticket, Ticket__getAccountDetailsResultValue0Struct } from '../../generated/Ticket/Ticket';
import { ZERO } from '../helpers/common';

export const setTicket = (ticketAddress: string, account: Account): void => {
    // If just created set ticket field
    if (account.ticket == null) {
        account.ticket = ticketAddress;
    }
};

export const setBalance = (
    account: Account,
    ticket: Ticket,
    walletAddress: Address,
    accountDetails: Ticket__getAccountDetailsResultValue0Struct,
): void => {
    const balance = ticket.balanceOf(walletAddress);

    account.balance = balance;
    account.delegateBalance = accountDetails.balance;
};

export const setDelegatee = (account: Account, delegateeId: string): void => {
    account.delegatee = delegateeId;
};
