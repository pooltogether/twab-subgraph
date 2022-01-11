import { BigInt } from '@graphprotocol/graph-ts';
import { assert } from 'matchstick-as/assembly/index';

export const assertAccountFields = (
    accountId: string,
    ticketAddress: string,
    blockTimestamp: BigInt,
    delegateBalance: i32,
): void => {
    assert.fieldEquals('Account', accountId, 'id', accountId);
    assert.fieldEquals('Account', accountId, 'ticket', ticketAddress);
    assert.fieldEquals('Account', accountId, 'delegateBalance', delegateBalance.toString());
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
