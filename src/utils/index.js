function getRandomElements(arr, n) {
  // Create a copy of the input array to avoid modifying it
  const shuffled = arr.slice(0);
  let i = arr.length;
  const result = [];

  // While there are elements remaining to select
  while (i-- && result.length < n) {
    const index = Math.floor((i + 1) * Math.random());
    const element = shuffled[index];

    // Move the selected element to the end of the array
    shuffled[index] = shuffled[i];
    shuffled[i] = element;

    // Add the selected element to the result
    result.push(element);
  }

  return result;
}

function getRandomNumber(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

function sortWithEmptyValues(arr) {
  // First, get an array of the non-empty values and their original indices
  const nonEmptyValues = arr
    .map((val, index) => [val, index])
    .filter(([val]) => val !== "");

  // Sort the non-empty values based on their numeric value
  nonEmptyValues.sort(([val1], [val2]) => val1 - val2);

  // Finally, use the non-empty values to create a new array with the empty values in their original positions
  const result = [];
  let nonEmptyIndex = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "") {
      result.push("");
    } else {
      result.push(nonEmptyValues[nonEmptyIndex][0]);
      nonEmptyIndex++;
    }
  }
  return result;
}

export const generateTambolaTicket = () => {
  let ticket = [];
  const usedNumbers = [];
  const arrOfNineIndices = Array(9)
    .fill("")
    .map((_, index) => index);

  const colNumbersPerIndex = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    [30, 31, 32, 33, 34, 35, 36, 37, 38, 39],
    [40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
    [50, 51, 52, 53, 54, 55, 56, 57, 58, 59],
    [60, 61, 62, 63, 64, 65, 66, 67, 68, 69],
    [70, 71, 72, 73, 74, 75, 76, 77, 78, 79],
    [80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
  ];

  // filling first two rows with 5 elements in each
  for (let row = 0; row < 2; row++) {
    const rowArr = Array(9)
      .fill("")
      .map((_) => "");
    const randomIndices = getRandomElements(arrOfNineIndices, 5);

    for (let col = 0; col < 9; col++) {
      if (randomIndices.includes(col)) {
        let currNumber = getRandomNumber(colNumbersPerIndex[col]);
        while (usedNumbers.includes(currNumber)) {
          currNumber = getRandomNumber(colNumbersPerIndex[col]);
        }
        rowArr[col] = currNumber;
        usedNumbers.push(rowArr[col]);
      }
    }

    ticket.push(rowArr);
  }

  // filling last row with five elements, mainly in columns where no number is present
  const markedCols = [];
  const rowArr = Array(9)
    .fill("")
    .map((_) => "");

  for (let col = 0; col < 9; col++) {
    if (!ticket[0][col] && !ticket[1][col]) {
      markedCols.push(col);
    }
  }

  let randomIndices = getRandomElements(
    arrOfNineIndices.filter((i) => !markedCols.includes(i)),
    5 - markedCols.length
  );
  randomIndices = [...randomIndices, ...markedCols];

  for (let col = 0; col < 9; col++) {
    if (randomIndices.includes(col)) {
      let currNumber = getRandomNumber(colNumbersPerIndex[col]);
      while (usedNumbers.includes(currNumber)) {
        currNumber = getRandomNumber(colNumbersPerIndex[col]);
      }
      rowArr[col] = currNumber;
      usedNumbers.push(rowArr[col]);
    }
  }

  ticket.push(rowArr);

  // sorting columns
  for (let col = 0; col < 9; col++) {
    [ticket[0][col], ticket[1][col], ticket[2][col]] = sortWithEmptyValues([
      ticket[0][col],
      ticket[1][col],
      ticket[2][col],
    ]);
  }

  return ticket;
};
