export default function getAllKeysInObjectArray<T extends Record<string, unknown>>(
  objectsArray: T[],
  excludeKeys: string[] = []
): string[] {
  const keyTracker: Record<string, boolean> = {};

  objectsArray.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      keyTracker[key] = true;
    });
  });
  return Object.keys(keyTracker).filter((key) => !excludeKeys.includes(key));
}

// Example usage:
// const objectsArray = [
//   { name: 'Alice', age: 25, city: 'Toronto' },
//   { name: 'Bob', age: 30, country: 'Canada' },
//   { name: 'Charlie', age: 35, city: 'Vancouver' }
// ];

// const excludeKeys = ['age'];

// ['name', 'city', 'country']
