import { Address } from '@graphprotocol/graph-ts';
import { assert, clearStore, test } from 'matchstick-as/assembly/index';

import { generateCompositeId } from '../src/helpers/common';
import {
    assertAccountFields,
    assertDelegationFields,
    assertTwabFields,
} from './helpers/assertField';
import { createDelegatedEvent, createNewUserTwabEvent } from './helpers/mockedEvent';
import { mockBalanceOfFunction, mockGetAccountDetailsFunction } from './helpers/mockedFunction';
import { handleDelegated, handleNewUserTwab } from '../src/mappings/ticket';

const delegateAddress = Address.fromString('0x897ea87eC79b9Fe5425f9f6c072c5Aa467bAdB0f');
const delegateeAddress = Address.fromString('0x8a37cb10f5AB9374283237551E396b53194E64e3');
const accountId = delegateAddress.toHexString();

const balance = 75;
const delegatedBalance = 25;
const delegateBalance = 100;
const ZERO = 0;
const twabAmount = 50;
const nextTwabIndex = 1;
const cardinality = 32;

test('should handleDelegated and record a delegation', () => {
    const delegatedEvent = createDelegatedEvent(
        delegateAddress.toHexString(),
        delegateeAddress.toHexString(),
    );

    const blockTimestamp = delegatedEvent.block.timestamp;

    handleDelegated(delegatedEvent);

    const delegationId = generateCompositeId(
        delegateAddress.toHexString(),
        blockTimestamp.toHexString(),
    );

    assertDelegationFields(
        delegationId,
        delegateAddress.toHexString(),
        delegateeAddress.toHexString(),
        blockTimestamp,
    );

    clearStore();
});

test('should handleDelegated and not record a delegation if delegate and delegatee addresses are the same', () => {
    const delegatedEvent = createDelegatedEvent(
        delegateAddress.toHexString(),
        delegateAddress.toHexString(),
    );

    const blockTimestamp = delegatedEvent.block.timestamp;

    handleDelegated(delegatedEvent);

    const delegationId = generateCompositeId(
        delegateAddress.toHexString(),
        blockTimestamp.toHexString(),
    );

    assert.notInStore('Delegation', delegationId)

    clearStore();
});

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

    mockBalanceOfFunction(newUserTwabEvent, delegateAddress, balance);

    handleNewUserTwab(newUserTwabEvent);

    const twabId = generateCompositeId(delegateAddress.toHexString(), blockTimestamp.toHexString());

    assertAccountFields(accountId, ticketAddress, balance, delegatedBalance, delegateBalance);
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

    mockBalanceOfFunction(firstNewUserTwabEvent, delegateAddress, ZERO);

    handleNewUserTwab(firstNewUserTwabEvent);

    const firstTwabId = generateCompositeId(
        delegateAddress.toHexString(),
        firstBlockTimestamp.toHexString(),
    );

    assertAccountFields(accountId, ticketAddress, ZERO, ZERO, ZERO);
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

    mockBalanceOfFunction(secondNewUserTwabEvent, delegateAddress, balance);

    handleNewUserTwab(secondNewUserTwabEvent);

    const secondTwabId = generateCompositeId(
        delegateAddress.toHexString(),
        secondBlockTimestamp.toHexString(),
    );

    assertAccountFields(accountId, ticketAddress, balance, delegatedBalance, delegateBalance);
    assertTwabFields(
        accountId,
        secondTwabId,
        secondBlockTimestamp,
        delegateBalance,
        delegateBalance,
    );

    clearStore();
});
