import { Address, BigInt } from '@graphprotocol/graph-ts';
import { assert } from 'matchstick-as/assembly/index';

import { generateCompositeId } from '../../src/helpers/common';
import { Account } from '../../generated/schema';

export const delegateAddress = Address.fromString('0x897ea87eC79b9Fe5425f9f6c072c5Aa467bAdB0f');
export const delegateAccountAddress = delegateAddress.toHexString();

export const delegateeAddress = Address.fromString('0x8a37cb10f5AB9374283237551E396b53194E64e3');
export const delegateeAccountAddress = delegateeAddress.toHexString();

export const assertAccountFields = (
    accountAddress: string,
    ticketAddress: string,
    balance: i32,
    delegateBalance: i32,
    delegatee: Account | null = null,
): void => {
    const id = generateCompositeId(ticketAddress, accountAddress);

    assert.fieldEquals('Account', id, 'id', generateCompositeId(ticketAddress, accountAddress));
    assert.fieldEquals('Account', id, 'address', accountAddress);
    assert.fieldEquals('Account', id, 'ticket', ticketAddress);
    assert.fieldEquals('Account', id, 'balance', balance.toString());
    assert.fieldEquals('Account', id, 'delegateBalance', delegateBalance.toString());

    if (delegatee) {
        assert.fieldEquals('Account', id, 'delegatee', delegatee.id);
    }
};

export const assertTwabFields = (
    accountAddress: string,
    ticketAddress: string,
    twabId: string,
    blockTimestamp: BigInt,
    delegateBalance: i32,
    amount: i32,
): void => {
    assert.fieldEquals('Twab', twabId, 'id', twabId);
    assert.fieldEquals('Twab', twabId, 'timestamp', blockTimestamp.toString());
    assert.fieldEquals('Twab', twabId, 'amount', amount.toString());
    assert.fieldEquals(
        'Twab',
        twabId,
        'account',
        generateCompositeId(ticketAddress, accountAddress),
    );
    assert.fieldEquals('Twab', twabId, 'delegateBalance', delegateBalance.toString());
};
