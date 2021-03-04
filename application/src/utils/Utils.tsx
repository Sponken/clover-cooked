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
