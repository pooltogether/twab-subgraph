import { Delegation } from '../../generated/schema';

export const createDelegation = (id: string): Delegation => new Delegation(id);
