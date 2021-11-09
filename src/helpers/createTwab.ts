import { Twab } from '../../generated/schema';

// twabs are append only on-chain thus they will only ever be created, not loaded
export const createTwab = (id: string): Twab => new Twab(id);
