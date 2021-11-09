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

    if (delegateBalance === 0) {
        assert.fieldEquals(
            'Account',
            accountId,
            'zeroBalanceOccurredAt',
            blockTimestamp.toString(),
        );
    } else {
        assert.fieldEquals('Account', accountId, 'zeroBalanceOccurredAt', 'null');
    }
};

export const assertTwabFields = (
    accountId: string,
    twabId: string,
    blockTimestamp: BigInt,
    delegateBalance: i32,
): void => {
    assert.fieldEquals('Twab', twabId, 'id', twabId);
    assert.fieldEquals('Twab', twabId, 'timestamp', blockTimestamp.toString());
    assert.fieldEquals('Twab', twabId, 'amount', delegateBalance.toString());
    assert.fieldEquals('Twab', twabId, 'account', accountId);
};
