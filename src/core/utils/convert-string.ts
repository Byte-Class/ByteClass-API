// File to convert string arrays to strings

export const convertStringArrayToString = (string: string[] | string) =>
  Array.isArray(string) ? string.join() : string;
