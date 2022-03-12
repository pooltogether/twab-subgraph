import { Address, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/index';

import { Delegated, NewUserTwab, Transfer } from '../../generated/Ticket/Ticket';

export function createDelegatedEvent(delegate: string, delegatee: string): Delegated {
    const mockEvent = newMockEvent();

    const delegatedEvent = new Delegated(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        mockEvent.parameters,
    );

    delegatedEvent.parameters = new Array();

    const delegateParam = new ethereum.EventParam(
        'delegate',
        ethereum.Value.fromAddress(Address.fromString(delegate)),
    );

    const delegateeParam = new ethereum.EventParam(
        'delegatee',
        ethereum.Value.fromAddress(Address.fromString(delegatee)),
    );

    delegatedEvent.parameters.push(delegateParam);
    delegatedEvent.parameters.push(delegateeParam);

    return delegatedEvent;
}

export function createNewUserTwabEvent(delegate: string, amount: i32, timestamp: i32): NewUserTwab {
    const mockEvent = newMockEvent();

    const newUserTwabEvent = new NewUserTwab(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        mockEvent.parameters,
    );

    newUserTwabEvent.parameters = new Array();

    const delegateParam = new ethereum.EventParam(
        'delegate',
        ethereum.Value.fromAddress(Address.fromString(delegate)),
    );

    const newTwabParam = new ethereum.EventParam(
        'newTwab',
        ethereum.Value.fromTuple(
            changetype<ethereum.Tuple>([
                ethereum.Value.fromI32(amount),
                ethereum.Value.fromI32(timestamp),
            ]),
        ),
    );

    newUserTwabEvent.parameters.push(delegateParam);
    newUserTwabEvent.parameters.push(newTwabParam);

    return newUserTwabEvent;
}

export function createTransferEvent(from: string, to: string, value: i32): Transfer {
    const mockEvent = newMockEvent();

    const transferEvent = new Transfer(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        mockEvent.parameters,
    );

    transferEvent.parameters = new Array();

    const fromParam = new ethereum.EventParam(
        'from',
        ethereum.Value.fromAddress(Address.fromString(from)),
    );

    const toParam = new ethereum.EventParam(
        'to',
        ethereum.Value.fromAddress(Address.fromString(to)),
    );

    const valueParam = new ethereum.EventParam('value', ethereum.Value.fromI32(value));

    transferEvent.parameters.push(fromParam);
    transferEvent.parameters.push(toParam);
    transferEvent.parameters.push(valueParam);

    return transferEvent;
}
