// Example input: "2024-09-21T17:06:54.357Z" -> Expected output: "Sep 21, 2024"

export const convertToReadableDate = (isoString: string) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };