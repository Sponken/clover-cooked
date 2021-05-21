/*
 * ersättnigsfunktion för Array.find som throwar ett exception om elementet inte hittades
 */
export function unsafeFind<T>(array: T[], matchFunction: (o: T) => boolean): T {
  const foundItem = array.find(matchFunction);
  if (foundItem === undefined) {
    throw "unsafeFind: Could not find element matching function";
  }
  return foundItem;
}

/**
 * Kollar om den första array innehåller alla element från den andra
 */
export function includesAll(superArr: any[], subArr: any[]): boolean {
  return subArr.every((e) => superArr.includes(e));
}

export function removeElement<T>(array: T[], element: T): boolean {
  let index = array.indexOf(element);
  if (index > -1) {
    array.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * castar undefined till false, om argumentet är boolean så returneras argumentet
 */
export function undefinedToBoolean(value: undefined | boolean) {
  if (value === undefined) return false;
  return value;
}

/**
 * Få reda på hur många hela minuter det är tills ett Date
 */
export function getMinutesTo(date: Date): number {
  return Math.floor(getSecondsTo(date) / 60);
}

/**
 * Få reda på hur många sekunder det är tills ett Date
 */
export function getSecondsTo(date: Date): number {
  const currentDate = new Date();
  return milliSecondToSecond(date.getTime() - currentDate.getTime());
}

const milliSecondToSecond = (millies: number) => Math.floor(millies / 1000);

/**
 * clearInterval fast kan ta emot typen NodeJS.Timeout | undefined
 * om undefined gör den ingenting
 */
export const clearIntervalOrUndefined = (
  interval: NodeJS.Timeout | undefined
) => {
  if (interval !== undefined) {
    let i = interval as NodeJS.Timeout; // hack för typescript
    clearInterval(i);
  }
};

/**
 * clearTimeout fast kan ta emot typen NodeJS.Timeout | undefined
 * om undefined gör den ingenting
 */
export const clearTimeoutOrUndefined = (
  timeout: NodeJS.Timeout | undefined
) => {
  if (timeout !== undefined) {
    let i = timeout as NodeJS.Timeout; // hack för typescript
    clearInterval(i);
  }
};

/**
 * Tar bort ett värde ur en array. Har dålig performance.
 */
 export function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

/**
 * Kör en funktion på varje value i en map
 * om undefined gör den ingenting
 */
export function filteredMap<T, V, W>(m: Map<T, V>, f: (v: V) => W): Map<T, W> {
  let m2 = new Map();
  m.forEach((value, key) => m2.set(key, f(value)))
  return m2
}

export function mapHasValue<K, V>(m: Map<K, V>, v: V): boolean {
  for (const [_, vi] of Array.from(m.entries())) {
    if (vi === v) { return true }
  }
  return false
}