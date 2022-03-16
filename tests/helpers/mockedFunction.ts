import { Address, ethereum } from '@graphprotocol/graph-ts';
import { createMockedFunction } from 'matchstick-as/assembly/index';

export const mockGetAccountDetailsFunction = (
    event: ethereum.Event,
    userAddress: Address,
    balance: i32,
    nextTwabIndex: i32,
    cardinality: i32,
): void => {
    createMockedFunction(
        event.address,
        'getAccountDetails',
        'getAccountDetails(address):((uint208,uint24,uint24))',
    )
        .withArgs([ethereum.Value.fromAddress(userAddress)])
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

export const mockBalanceOfFunction = (
    event: ethereum.Event,
    userAddress: Address,
    balance: i32,
): void => {
    createMockedFunction(event.address, 'balanceOf', 'balanceOf(address):(uint256)')
        .withArgs([ethereum.Value.fromAddress(userAddress)])
        .returns([ethereum.Value.fromI32(balance)]);
};
