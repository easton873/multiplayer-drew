export function getRandomIndex<T>(list: T[]): T {
  if (list.length === 0) {
    return null; 
  }
  
  // Generate a random number between 0 (inclusive) and list.length (exclusive), 
  // then floor it to get a valid integer index.
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex];
}