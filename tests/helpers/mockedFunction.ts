import { Address, ethereum } from '@graphprotocol/graph-ts';
import { createMockedFunction } from 'matchstick-as/assembly/index';

import { NewUserTwab } from '../../generated/Ticket/Ticket';

export const mockGetAccountDetailsFunction = (
    event: NewUserTwab,
    delegateAddress: Address,
    balance: i32,
    nextTwabIndex: i32,
    cardinality: i32,
): void => {
    createMockedFunction(
        event.address,
        'getAccountDetails',
        'getAccountDetails(address):((uint208,uint24,uint24))',
    )
        .withArgs([ethereum.Value.fromAddress(delegateAddress)])
        .returns([
            ethereum.Value.fromTuple(
                changetype<ethereum.Tuple>([
                    ethereum.Value.fromI32(balance),
                    ethereum.Value.fromI32(nextTwabIndex),
                    ethereum.Value.fromI32(cardinality),
                ]),
            ),
        ]);
};
