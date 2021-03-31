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
