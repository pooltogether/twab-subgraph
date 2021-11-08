import { Twab } from '../../generated/schema';

export function loadOrCreateTwab(id: string): Twab {
    let twab = Twab.load(id);

    // create case
    if (twab == null) {
        twab = new Twab(id);
    }

    return twab as Twab;
}
