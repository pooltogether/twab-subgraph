import { Address } from '@graphprotocol/graph-ts';
import { clearStore, test } from 'matchstick-as/assembly/index';

import { generateCompositeId } from '../src/helpers/common';
import {
    assertAccountFields,
    assertTwabFields,
    delegateAddress,
    delegateeAddress,
    delegateAccountAddress,
    delegateeAccountAddress,
} from './helpers/assertField';
import {
    createDelegatedEvent,
    createNewUserTwabEvent,
    createTransferEvent,
} from './helpers/mockedEvent';
import { mockBalanceOfFunction, mockGetAccountDetailsFunction } from './helpers/mockedFunction';
import { handleDelegated, handleNewUserTwab, handleTransfer } from '../src/mappings/ticket';
import { Account } from '../generated/schema';
import { NewUserTwab } from '../generated/Ticket/Ticket';

const balance = 100;
const delegateBalance = 0;
const twabAmount = 50;
const nextTwabIndex = 1;
const cardinality = 32;
const randomTimestamp = 1635493033;

const createNewUserTwab = (
    userAddress: Address,
    userBalance: i32,
    userDelegateBalance: i32,
): NewUserTwab => {
    const newUserTwabEvent = createNewUserTwabEvent(
        userAddress.toHexString(),
        twabAmount,
        randomTimestamp,
    );

    mockGetAccountDetailsFunction(
        newUserTwabEvent,
        userAddress,
        userDelegateBalance,
        nextTwabIndex,
        cardinality,
    );

    mockBalanceOfFunction(newUserTwabEvent, userAddress, userBalance);

    handleNewUserTwab(newUserTwabEvent);

    return newUserTwabEvent;
};

test('should handleDelegated', () => {
    createNewUserTwab(delegateAddress, balance, delegateBalance);

    const delegatedEvent = createDelegatedEvent(delegateAccountAddress, delegateeAccountAddress);

    createNewUserTwab(delegateeAddress, delegateBalance, balance);

    const ticketAddress = delegatedEvent.address.toHexString();

    handleDelegated(delegatedEvent);

    const delegateeAccount = Account.load(
        generateCompositeId(ticketAddress, delegateeAccountAddress),
    ) as Account;

    assertAccountFields(
        delegateAccountAddress,
        ticketAddress,
        balance,
        delegateBalance,
        delegateeAccount,
    );

    assertAccountFields(delegateeAccountAddress, ticketAddress, delegateBalance, balance);

    clearStore();
});

test('should handleNewUserTwab', () => {
    const newUserTwabEvent = createNewUserTwab(delegateAddress, balance, delegateBalance);

    const ticketAddress = newUserTwabEvent.address.toHexString();
    const blockTimestamp = newUserTwabEvent.block.timestamp;

    const twabId = generateCompositeId(delegateAddress.toHexString(), blockTimestamp.toHexString());

    assertAccountFields(delegateAccountAddress, ticketAddress, balance, delegateBalance);
    assertTwabFields(
        delegateAccountAddress,
        ticketAddress,
        twabId,
        blockTimestamp,
        delegateBalance,
        twabAmount,
    );

    clearStore();
});

test('should handleTransfer', () => {
    const transferEvent = createTransferEvent(
        delegateAddress.toHexString(),
        delegateeAddress.toHexString(),
        balance,
    );

    const ticketAddress = transferEvent.address.toHexString();

    mockGetAccountDetailsFunction(transferEvent, delegateAddress, 0, nextTwabIndex, cardinality);

    mockGetAccountDetailsFunction(
        transferEvent,
        delegateeAddress,
        balance,
        nextTwabIndex,
        cardinality,
    );

    mockBalanceOfFunction(transferEvent, delegateAddress, 0);
    mockBalanceOfFunction(transferEvent, delegateeAddress, balance);

    handleTransfer(transferEvent);

    assertAccountFields(delegateAccountAddress, ticketAddress, 0, 0);
    assertAccountFields(delegateeAccountAddress, ticketAddress, balance, balance);

    clearStore();
});
