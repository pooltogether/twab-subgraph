import { Twab } from '../../generated/schema';

// should always be creating a TWAB
export function createTwab(id: string): Twab {
    let twab = Twab.load(id);

    // create case
    if (twab == null) {
        twab = new Twab(id);
    }

    return twab as Twab;
}
