import { Address, ethereum } from '@graphprotocol/graph-ts';
import { assert, clearStore, createMockedFunction, test } from 'matchstick-as/assembly/index';

import { generateCompositeId } from '../src/helpers/common';
import { createNewUserTwabEvent } from './helpers/createNewUserTwabEvent';
import { handleNewUserTwab } from '../src/mappings/ticket';

const delegateAddress = Address.fromString('0x897ea87eC79b9Fe5425f9f6c072c5Aa467bAdB0f');

test('should handleNewUserTwab', () => {
    const delegateBalance = 100;
    const nextTwabIndex = 1;
    const cardinality = 32;

    const newUserTwabEvent = createNewUserTwabEvent(delegateAddress.toHexString(), delegateBalance, 1635493033);

    const ticketAddress = newUserTwabEvent.address.toHexString();
    const blockTimestamp = newUserTwabEvent.block.timestamp;

    createMockedFunction(
        newUserTwabEvent.address,
        'getAccountDetails',
        'getAccountDetails(address):((uint208,uint24,uint24))',
    )
        .withArgs([ethereum.Value.fromAddress(delegateAddress)])
        .returns([
            ethereum.Value.fromTuple(
                changetype<ethereum.Tuple>([
                    ethereum.Value.fromI32(delegateBalance),
                    ethereum.Value.fromI32(nextTwabIndex),
                    ethereum.Value.fromI32(cardinality),
                ]),
            ),
        ]);

    handleNewUserTwab(newUserTwabEvent);

    const accountId = delegateAddress.toHexString();
    const twabId = generateCompositeId(delegateAddress.toHexString(), blockTimestamp.toHexString());

    assert.fieldEquals('Account', accountId, 'id', accountId);
    assert.fieldEquals('Account', accountId, 'ticket', ticketAddress);
    assert.fieldEquals('Account', accountId, 'delegateBalance', delegateBalance.toString());

    assert.fieldEquals('Twab', twabId, 'id', twabId);
    assert.fieldEquals('Twab', twabId, 'timestamp', blockTimestamp.toString());
    assert.fieldEquals('Twab', twabId, 'amount', delegateBalance.toString());
    assert.fieldEquals('Twab', twabId, 'account', accountId);

    assert.fieldEquals('Ticket', ticketAddress, 'id', ticketAddress);
    clearStore();
});

test('should handleNewUserTwab if delegateBalance is equal to zero', () => {
    const delegateBalance = 0;
    const nextTwabIndex = 1;
    const cardinality = 32;

    const newUserTwabEvent = createNewUserTwabEvent(delegateAddress.toHexString(), delegateBalance, 1635493033);

    const ticketAddress = newUserTwabEvent.address.toHexString();
    const blockTimestamp = newUserTwabEvent.block.timestamp;

    createMockedFunction(
        newUserTwabEvent.address,
        'getAccountDetails',
        'getAccountDetails(address):((uint208,uint24,uint24))',
    )
        .withArgs([ethereum.Value.fromAddress(delegateAddress)])
        .returns([
            ethereum.Value.fromTuple(
                changetype<ethereum.Tuple>([
                    ethereum.Value.fromI32(delegateBalance),
                    ethereum.Value.fromI32(nextTwabIndex),
                    ethereum.Value.fromI32(cardinality),
                ]),
            ),
        ]);

    handleNewUserTwab(newUserTwabEvent);

    const accountId = delegateAddress.toHexString();
    const twabId = generateCompositeId(delegateAddress.toHexString(), blockTimestamp.toHexString());

    assert.fieldEquals('Account', accountId, 'id', accountId);
    assert.fieldEquals('Account', accountId, 'ticket', ticketAddress);
    assert.fieldEquals('Account', accountId, 'delegateBalance', delegateBalance.toString());
    assert.fieldEquals('Account', accountId, 'zeroBalanceOccurredAt', blockTimestamp.toString());

    assert.fieldEquals('Twab', twabId, 'id', twabId);
    assert.fieldEquals('Twab', twabId, 'timestamp', blockTimestamp.toString());
    assert.fieldEquals('Twab', twabId, 'amount', delegateBalance.toString());
    assert.fieldEquals('Twab', twabId, 'account', accountId);

    assert.fieldEquals('Ticket', ticketAddress, 'id', ticketAddress);
    clearStore();
});
