import { Address, BigInt } from '@graphprotocol/graph-ts';
import { assert } from 'matchstick-as/assembly/index';

import { Account } from '../../generated/schema';

export const delegateAddress = Address.fromString('0x897ea87eC79b9Fe5425f9f6c072c5Aa467bAdB0f');
export const delegateAccountId = delegateAddress.toHexString();

export const delegateeAddress = Address.fromString('0x8a37cb10f5AB9374283237551E396b53194E64e3');
export const delegateeAccountId = delegateeAddress.toHexString();

export const assertAccountFields = (
    accountId: string,
    ticketAddress: string,
    balance: i32,
    delegateBalance: i32,
    delegatee: Account | null = null,
): void => {
    assert.fieldEquals('Account', accountId, 'id', accountId);
    assert.fieldEquals('Account', accountId, 'ticket', ticketAddress);
    assert.fieldEquals('Account', accountId, 'balance', balance.toString());
    assert.fieldEquals('Account', accountId, 'delegateBalance', delegateBalance.toString());

    if (delegatee) {
        assert.fieldEquals('Account', accountId, 'delegatee', delegatee.id);
    }
};

export const assertTwabFields = (
    accountId: string,
    twabId: string,
    blockTimestamp: BigInt,
    delegateBalance: i32,
    amount: i32,
): void => {
    assert.fieldEquals('Twab', twabId, 'id', twabId);
    assert.fieldEquals('Twab', twabId, 'timestamp', blockTimestamp.toString());
    assert.fieldEquals('Twab', twabId, 'amount', amount.toString());
    assert.fieldEquals('Twab', twabId, 'account', accountId);
    assert.fieldEquals('Twab', twabId, 'delegateBalance', delegateBalance.toString());
};
