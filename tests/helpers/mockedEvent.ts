import { Address, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/index';

import { NewUserTwab } from '../../generated/Ticket/Ticket';

export function createNewUserTwabEvent(
    delegate: string,
    newTwabAmount: i32,
    newTwabTimestamp: i32,
): NewUserTwab {
    let mockEvent = newMockEvent();

    let newUserTwabEvent = new NewUserTwab(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        mockEvent.parameters,
    );

    newUserTwabEvent.parameters = new Array();

    let delegateParam = new ethereum.EventParam(
        'delegate',
        ethereum.Value.fromAddress(Address.fromString(delegate)),
    );

    let newTwabParam = new ethereum.EventParam(
        'newTwab',
        ethereum.Value.fromArray([
            ethereum.Value.fromI32(newTwabAmount),
            ethereum.Value.fromI32(newTwabTimestamp),
        ]),
    );

    newUserTwabEvent.parameters.push(delegateParam);
    newUserTwabEvent.parameters.push(newTwabParam);

    return newUserTwabEvent;
}
