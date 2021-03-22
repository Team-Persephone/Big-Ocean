const { db } = require('../server/db');
const {
  PearlQuest,
  Level,
  GameRoom,
  ShrimpFact,
} = require('../server/db/models');

async function seed() {
  await db.sync({ force: true });
  console.log('db is synced!!');

  const questions = await Promise.all([
    Task.create({
      question: 'Simplify this big-O expression as much as possible: O(n + 10)',
      options: ['O(n)', 'O(n^2)', 'O(n log n)', 'O(n + 10)'],
      answer: 'O(n)',
      levelId: 1,
    }),
    Task.create({
      question:
        'Simplify this big-O expression as much as possible: O(100 * n)',
      options: ['O(100n)', 'O(n!)', 'O(n)', '100 * O(n)'],
      answer: 'O(n)',
      levelId: 1,
    }),
    Task.create({
      question: 'Simplify this big-O expression as much as possible: O(25)',
      options: ['O(1)', 'O(25n)', 'O(n)', 'O(25 + n)'],
      answer: 'O(1)',
      levelId: 1,
    }),
    Task.create({
      question:
        'Simplify this big-O expression as much as possible: O(n^2 + n^3)',
      options: ['O(n)', 'O(n^5)', 'O(n^3)', 'O(n^6)'],
      answer: 'O(n^3)',
      levelId: 1,
    }),
    Task.create({
      question:
        'Simplify this big-O expression as much as possible: O(n + n + n + n)',
      options: ['O(n)', 'O(4n)', 'O(n^4)', 'O(4^n)'],
      answer: 'O(n)',
      levelId: 1,
    }),
    Task.create({
      question: 'Which of the following represents quadratic time?',
      options: ['O(n^2)', 'O(n)', 'O(n log n)', 'O(4n)'],
      answer: 'O(n^2)',
      levelId: 2,
    }),
    Task.create({
      question: 'Which of the following represents linear time?',
      options: ['O(n)', 'O(n^2)', 'O(n log n)', 'O(n!)'],
      answer: 'O(n)',
      levelId: 2,
    }),
    Task.create({
      question: 'Which of the following represents factorial time?',
      options: ['O(n!)', 'O(n^2)', 'O(n log n)', 'O(n * 3 * 2 * 1)'],
      answer: 'O(n!)',
      levelId: 2,
    }),
    Task.create({
      question: 'Which of the following represents exponential time?',
      options: ['O(n!)', 'O(n^2) * O(n^O)', 'O(n log n)', 'O(2^n)'],
      answer: 'O(2^n)',
      levelId: 2,
    }),
    Task.create({
      question: 'Which of the following represents logarithmic time?',
      options: ['O(n^2)', 'O(n/2)', 'O(log n)', 'O(n!)'],
      answer: 'O(log n)',
      levelId: 2,
    }),
    Task.create({
      question:
        'Your function takes an array of 1000 elements, and prints each one. What is its time complexity?',
      options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(n!)'],
      answer: 'O(n)',
      levelId: 3,
    }),
    Task.create({
      question:
        'Your function takes an array of n elements. For each element, you must add each of the other elements in the array to it. What is its time complexity?',
      options: ['O(n)', 'O(n^2)', 'O(n log n)', 'O(n!)'],
      answer: 'O(n^2)',
      levelId: 3,
    }),
    Task.create({
      question:
        "Your function's runtime doubles with each addition to its input. What is its big-O?",
      options: ['O(2n)', 'O(n^2)', 'O(n log n)', 'O(2^n)'],
      answer: 'O(2^n)',
      levelId: 3,
    }),
    Task.create({
      question:
        'Your function takes the same amount of time to process 10 elements as it does 10,000 elements. What is its time complexity?',
      options: ['O(n)', 'O(1)', 'O(log n)', 'O(10n)'],
      answer: 'O(1)',
      levelId: 3,
    }),
    Task.create({
      question:
        "Your function splits an ordered array in half again and again until you reach the number you're looking for. What is its time complexity?",
      options: ['O(0.5n)', 'O(n/2)', 'O(log n)', 'O(n log n)'],
      answer: 'O(log n)',
      levelId: 3,
    }),
    Task.create({
      question: `What is the time complexity of the following code:
      const findThirdIndex = arr => {
        const thirdIndex = n[2]
        return thirdIndex
      };`,
      options: ['O(n)', 'O(n^2)', 'O(n log n)', 'O(1)'],
      answer: 'O(1)',
      levelId: 4,
    }),
    Task.create({
      question: `What is the time complexity of the following code:
      const findIndex = (items, match) => {
        for (let i = 0; i < items.length; i++)
          if (items[i] === match) {
            return i;
          }
         return -1;
      };`,
      options: ['O(n)', 'O(n^2)', 'O(n log n)', 'O(n + 10)'],
      answer: 'O(n)',
      levelId: 4,
    }),
    Task.create({
      question: `What is the time complexity of the following code:
      const buildSquareMatrix = items => {
        let matrix = [];
        for (let i = 0; i < items.length; i++){
          matrix[i] = [];
          for (let j = 0; j < items.length; j++)
            matrix[i].push(items[j]);
        }
        return matrix;
      };`,
      options: ['O(n)', 'O(n^2)', 'O(n log n)', 'O(n + 10)'],
      answer: 'O(n^2)',
      levelId: 4,
    }),
    Task.create({
      question: `What is the time complexity of the following code:
      const countOperations = num => {
        let operations = 0
        let i = 1
        while (i < num) {
          i = i * 2
          operations++
        }
        return operations;
      };`,
      options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(2n)'],
      answer: 'O(log n)',
      levelId: 4,
    }),
    Task.create({
      question: `What is the time complexity of the following code:
      const logEverythingTwice = arr => {
        for (let i = 0; i < items.length; i++){
          console.log(items[i])
        }
        for (let i = items.length; i > 0; i++){
          console.log(items[i])
        }
      };`,
      options: ['O(2n)', 'O(n^2)', 'O(n)', 'O(n^n)'],
      answer: 'O(n)',
      levelId: 4,
    }),
    Task.create({
      question:
        'What is the average time complexity of deleting a node in a binary search tree? What is the worst-case?',
      options: [
        'average: O(n), worst-case: 0(log n)',
        'average: O(log n), worst-case: 0(n)',
        'average: O(log), worst-case: 0(n!)',
        'average: O(n), worst-case: 0(n^2)',
      ],
      answer: 'average: O(log n), worst-case: 0(n)',
      levelId: 5,
    }),
    Task.create({
      question:
        'What is the worst-case time and space complexity of bubble sort?',
      options: [
        'time: O(n^2), space: O(1)',
        'time: O(n), space: O(1)',
        'time: O(n^2), space: O(log n)',
        'time: O(1), space: O(1)',
      ],
      answer: 'time: O(n^2), space: O(1)',
      levelId: 5,
    }),
    Task.create({
      question: 'What is the time + space complexity of merge sort?',
      options: [
        'time: O(n^2), space: O(1)',
        'time: O(n log n), space: O(1)',
        'time: O(n log n), space: O(n)',
        'time: O(log n), space: O(log n)',
      ],
      answer: 'time: O(n log n), space: O(n)',
      levelId: 5,
    }),
    Task.create({
      question: '',
      options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'],
      answer: 'O(n)',
      levelId: 5,
    }),
    Task.create({
      question: '',
      options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(n^n)'],
      answer: 'O(n)',
      levelId: 5,
    }),
  ]);
}

async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

if (module === require.main) {
  runSeed();
}

module.exports = seed;
