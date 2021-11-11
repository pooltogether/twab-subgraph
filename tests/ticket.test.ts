import { Address } from '@graphprotocol/graph-ts';
import { clearStore, test } from 'matchstick-as/assembly/index';

import { generateCompositeId } from '../src/helpers/common';
import { assertAccountFields, assertTwabFields } from './helpers/assertField';
import { createNewUserTwabEvent } from './helpers/mockedEvent';
import { mockGetAccountDetailsFunction } from './helpers/mockedFunction';
import { handleNewUserTwab } from '../src/mappings/ticket';

const delegateAddress = Address.fromString('0x897ea87eC79b9Fe5425f9f6c072c5Aa467bAdB0f');
const accountId = delegateAddress.toHexString();

const delegateBalance = 100;
const ZERO = 0;
const twabAmount = 50;
const nextTwabIndex = 1;
const cardinality = 32;

test('should handleNewUserTwab', () => {
    const newUserTwabEvent = createNewUserTwabEvent(
        delegateAddress.toHexString(),
        twabAmount,
        1635493033,
    );

    const ticketAddress = newUserTwabEvent.address.toHexString();
    const blockTimestamp = newUserTwabEvent.block.timestamp;

    mockGetAccountDetailsFunction(
        newUserTwabEvent,
        delegateAddress,
        delegateBalance,
        nextTwabIndex,
        cardinality,
    );

    handleNewUserTwab(newUserTwabEvent);

    const twabId = generateCompositeId(delegateAddress.toHexString(), blockTimestamp.toHexString());

    assertAccountFields(accountId, ticketAddress, blockTimestamp, delegateBalance);
    assertTwabFields(accountId, twabId, blockTimestamp, delegateBalance, twabAmount);

    clearStore();
});

test('should handleNewUserTwab if delegateBalance is equal to zero, then superior to zero', () => {
    const firstNewUserTwabEvent = createNewUserTwabEvent(
        delegateAddress.toHexString(),
        twabAmount,
        1635493033,
    );

    const ticketAddress = firstNewUserTwabEvent.address.toHexString();
    const firstBlockTimestamp = firstNewUserTwabEvent.block.timestamp;

    mockGetAccountDetailsFunction(
        firstNewUserTwabEvent,
        delegateAddress,
        ZERO,
        nextTwabIndex,
        cardinality,
    );

    handleNewUserTwab(firstNewUserTwabEvent);

    const firstTwabId = generateCompositeId(
        delegateAddress.toHexString(),
        firstBlockTimestamp.toHexString(),
    );

    assertAccountFields(accountId, ticketAddress, firstBlockTimestamp, ZERO);
    assertTwabFields(accountId, firstTwabId, firstBlockTimestamp, ZERO, twabAmount);

    const secondNewUserTwabEvent = createNewUserTwabEvent(
        delegateAddress.toHexString(),
        delegateBalance,
        1635493034,
    );

    const secondBlockTimestamp = secondNewUserTwabEvent.block.timestamp;

    mockGetAccountDetailsFunction(
        secondNewUserTwabEvent,
        delegateAddress,
        delegateBalance,
        nextTwabIndex,
        cardinality,
    );

    handleNewUserTwab(secondNewUserTwabEvent);

    const secondTwabId = generateCompositeId(
        delegateAddress.toHexString(),
        secondBlockTimestamp.toHexString(),
    );

    assertAccountFields(accountId, ticketAddress, secondBlockTimestamp, delegateBalance);
    assertTwabFields(
        accountId,
        secondTwabId,
        secondBlockTimestamp,
        delegateBalance,
        delegateBalance,
    );

    clearStore();
});
