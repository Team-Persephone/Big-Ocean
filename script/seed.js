const { db } = require('../server/db');
const { PearlQuest, Level, ShrimpFact } = require('../server/db/models');

async function seed() {
  await db.sync({ force: true });
  console.log('db is synced!!');

  const levels = await Promise.all([
    Level.create(),
    Level.create(),
    Level.create(),
    Level.create(),
    Level.create(),
  ]);

  console.log(`${levels.length} levels seeded ✅`);

  const questions = await Promise.all([
    PearlQuest.create({
      question: 'Simplify this big-O expression as much as possible: O(n + 10)',
      options: ['O(n)', 'O(n^2)', 'O(n log n)', 'O(n + 10)'],
      answer: 'O(n)',
      levelId: 1,
    }),
    PearlQuest.create({
      question:
        'Simplify this big-O expression as much as possible: O(100 * n)',
      options: ['O(100n)', 'O(n!)', 'O(n)', '100 * O(n)'],
      answer: 'O(n)',
      levelId: 1,
    }),
    PearlQuest.create({
      question: 'Simplify this big-O expression as much as possible: O(25)',
      options: ['O(1)', 'O(25n)', 'O(n)', 'O(25 + n)'],
      answer: 'O(1)',
      levelId: 1,
    }),
    PearlQuest.create({
      question:
        'Simplify this big-O expression as much as possible: O(n^2 + n^3)',
      options: ['O(n)', 'O(n^5)', 'O(n^3)', 'O(n^6)'],
      answer: 'O(n^3)',
      levelId: 1,
    }),
    PearlQuest.create({
      question:
        'Simplify this big-O expression as much as possible: O(n + n + n + n)',
      options: ['O(n)', 'O(4n)', 'O(n^4)', 'O(4^n)'],
      answer: 'O(n)',
      levelId: 1,
    }),
    PearlQuest.create({
      question: 'Which of the following represents quadratic time?',
      options: ['O(n^2)', 'O(n)', 'O(n log n)', 'O(4n)'],
      answer: 'O(n^2)',
      levelId: 2,
    }),
    PearlQuest.create({
      question: 'Which of the following represents linear time?',
      options: ['O(n)', 'O(n^2)', 'O(n log n)', 'O(n!)'],
      answer: 'O(n)',
      levelId: 2,
    }),
    PearlQuest.create({
      question: 'Which of the following represents factorial time?',
      options: ['O(n!)', 'O(n^2)', 'O(n log n)', 'O(n * 3 * 2 * 1)'],
      answer: 'O(n!)',
      levelId: 2,
    }),
    PearlQuest.create({
      question: 'Which of the following represents exponential time?',
      options: ['O(n!)', 'O(n^2) * O(n^O)', 'O(n log n)', 'O(2^n)'],
      answer: 'O(2^n)',
      levelId: 2,
    }),
    PearlQuest.create({
      question: 'Which of the following represents logarithmic time?',
      options: ['O(n^2)', 'O(n/2)', 'O(log n)', 'O(n!)'],
      answer: 'O(log n)',
      levelId: 2,
    }),
    PearlQuest.create({
      question:
        'Your function takes an array of 1000 elements, and prints each one. What is its time complexity?',
      options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(n!)'],
      answer: 'O(n)',
      levelId: 3,
    }),
    PearlQuest.create({
      question:
        'Your function takes an array of n elements. For each element, you must add each of the other elements in the array to it. What is its time complexity?',
      options: ['O(n)', 'O(n^2)', 'O(n log n)', 'O(n!)'],
      answer: 'O(n^2)',
      levelId: 3,
    }),
    PearlQuest.create({
      question:
        "Your function's runtime doubles with each addition to its input. What is its big-O?",
      options: ['O(2n)', 'O(n^2)', 'O(n log n)', 'O(2^n)'],
      answer: 'O(2^n)',
      levelId: 3,
    }),
    PearlQuest.create({
      question:
        'Your function takes the same amount of time to process 10 elements as it does 10,000 elements. What is its time complexity?',
      options: ['O(n)', 'O(1)', 'O(log n)', 'O(10n)'],
      answer: 'O(1)',
      levelId: 3,
    }),
    PearlQuest.create({
      question:
        "Your function splits an ordered array in half again and again until you reach the number you're looking for. What is its time complexity?",
      options: ['O(0.5n)', 'O(n/2)', 'O(log n)', 'O(n log n)'],
      answer: 'O(log n)',
      levelId: 3,
    }),
    PearlQuest.create({
      question: `What is the time complexity of the following function:
      const findThirdIndex = arr => {
        const thirdIndex = n[2]
        return thirdIndex
      };`,
      options: ['O(n)', 'O(n^2)', 'O(n log n)', 'O(1)'],
      answer: 'O(1)',
      levelId: 4,
    }),
    PearlQuest.create({
      question: `What is the time complexity of the following function:
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
    PearlQuest.create({
      question: `What is the time complexity of the following function:
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
    PearlQuest.create({
      question: `What is the time complexity of the following function:
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
    PearlQuest.create({
      question: `What is the time complexity of the following function:
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
    PearlQuest.create({
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
    PearlQuest.create({
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
    PearlQuest.create({
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
    PearlQuest.create({
      question: `What is the time complexity of the following function:
      const sortedStrings = arr => {
        for (let i = 0; i < arr.length; i++){
          arr[i].sort()
        }
      }
      `,
      options: ['O(n)', 'O(n^2)', 'O(n * s log s)', 'O(s log s)'],
      answer: 'O(n * s log s)',
      levelId: 5,
    }),
    PearlQuest.create({
      question: `What are the time complexities of the following functions:
      const count 1 = n => {
        let count = 0;
        for (let i = 0; i < n; i++){
            count += 1;
        }
        for (let i = 0; i < 5*n; i++){
            count += 1;
        }
        return count;
    }

      const count2 = n => {
        let count =0;
        for (let i = 0; i < n; i++){
            count += 1;
            for (let i = 0; i < 5*n; i++){
                count += 1;
            }
        }
        return count;
    }`,
      options: [
        'count1: O(n) count2: O(n^2)',
        'count1: O(n^2) count2: O(n^2)',
        'count1: O(2n) count2: O(10n)',
        'count1: O(n * n) count2: O(n^2)',
      ],
      answer: 'count1: O(n) count2: O(n^2)',
      levelId: 5,
    }),
  ]);
  console.log(`${questions.length} questions seeded ✅`);

  const facts = await Promise.all([
    ShrimpFact.create({
      fact:
        'In big-O notation, the coefficient rule requires us to ignore any non-input-size-related constants because coefficients are negligible with large input sizes. For instance, O(5n) will always be simplified to O(n) complexity.',
      levelId: 1,
    }),
    ShrimpFact.create({
      fact:
        'Algorithms – which are what we are measuring with big-O – are sets of logical steps that act on an input to produce an output. You can think of "algorithm" as a fancy word for a function.',
      levelId: 1,
    }),
    ShrimpFact.create({
      fact:
        'There are many factors that could affect how long an algorithm takes to run in seconds, minutes, hours, etc. on a given computer. Instead of focusing on the actual time that an algorithm takes to run, big-O frames the run time in terms of the number of operations performed. Fewer operations equal a shorter running time (more efficient), whereas more operations equal a longer running time (less efficient).',
      levelId: 1,
    }),
    ShrimpFact.create({
      fact:
        'These are the seven examples of big-O that you will encounter most frequently, ranked from most efficient to least: O(1) — Constant, O(log n) — Logarithmic, O(n) — Linear, O(n log n) — Log-linear, O(nᵏ) — Polynomial, O(kⁿ) — Exponential, O(n!) — Factorial.',
      levelId: 2,
    }),
    ShrimpFact.create({
      fact:
        'When calculating big-O, think about the worst case scenario. For example, if we were to loop over an array and look for an item, it could be the first item or it could be the last. As we aren’t certain, we must assume O(n).',
      levelId: 2,
    }),
    ShrimpFact.create({
      fact:
        'O(1) is also known as constant time. In these algorithms, the time is consistent in each execution. A common operation of this nature is a value lookup by index in an array or key in a hash table.',
      levelId: 2,
    }),
    ShrimpFact.create({
      fact:
        'An algorithm has a cubic time – O(n^3) – when the number of operations grows in an cubic manner. This would mean that for any input number, n, you will have n^3 number of operations.',
      levelId: 3,
    }),
    ShrimpFact.create({
      fact:
        'A good rule of thumb is that if you see nested loops, use multiplication to work out the notation. For example, two nested loops would calculate to O(n * n), or O(n²)',
      levelId: 3,
    }),
    ShrimpFact.create({
      fact:
        'Big-O analysis is usually used to describe the dominant trend of an algorithm as the input gets very large. Thus, similar to coefficients, insignificant notations can be dropped if they are overpowered by more significant terms. For instance, an algorithm with a computed time complexity O(n² + n) would simply be referred to as O(n²) due to the effect of the n² term greatly outstrips that of the n term.',
      levelId: 3,
    }),
    ShrimpFact.create({
      fact:
        "Just as it takes different computers different times to run an algorithm, different languages may also yield different runtimes. An algorithm might take time n^2 microseconds when implemented in C++, but 1000n^2 + 1000n microseconds when implemented in Python. This is another reason we use big-O notation: so we can talk about an algorithm's growth rate agnostic of language.",
      levelId: 3,
    }),
    ShrimpFact.create({
      fact:
        'The classic logarithmic algorithm example is binary search, where we find a value in a sorted array by iteratively looking at the middle value, checking if the target value is less than or greater than the middle value, and then eliminating the half of the array in which we are certain that the value does not exist. Given that the size of the array yet to be searched is halved on each iteration, searching an array twice as large would only take one additional iteration!',
      levelId: 4,
    }),
    ShrimpFact.create({
      fact:
        "Big-O notation – O(n) – is the formal way to express the upper bound of an algorithm's running time. Omega notation – Ω(n) – is the formal way to express the lower bound of an algorithm's running time. Theta notation – θ(n) – is the formal way to express both the lower bound and the upper bound of an algorithm's running time.",
      levelId: 4,
    }),
    ShrimpFact.create({
      fact:
        'Log-linear complexity algorithms involve both a logarithmic and a linear component. The most common examples of these are sorting algorithms. “Merge sort” is one such algorithm for sorting an array in which the array is iteratively halved, sorted in pieces, and merged back together in sorted order.',
      levelId: 4,
    }),
    ShrimpFact.create({
      fact:
        'Saying that an algorithm is O(n²) doesn’t mean that it performs exactly n² operations for a given input of size n. Imagine that Algorithm A performs f(n)=2n²+n+1 operations. With this function, we drop its non-dominant terms (like +n and +1) and its constants (like the 2 in 2n²) to obtain its asymptotic notation O(n²). If there is an Algorithm B that always performs f(n)=4n²+3n+3 operations, it will also be described as O(n²), although it performs more than twice the operations as Algorithm A for any value of n.',
      levelId: 5,
    }),
    ShrimpFact.create({
      fact:
        'Big-O notation is also called Landau\'s symbol, after German number theoretician Edmund Landau who invented the notation. The letter "O" is used because the rate of growth of a function is also called its order.',
      levelId: 5,
    }),
    ShrimpFact.create({
      fact: `The big-O of recursive algorithms is trickier to identify since not only do we need to determine the complexity of our algorithm, we also need to keep in mind how many times recursion happens because that would contribute toward the overall complexity. Take a look at the following code:
        function rec1(array) {
           // O(1) operations
           if (array.length === 0) return;
           array.pop();
           return rec1(array);
        }
       Although our function only performs some O(1) operations, it constantly changes the input and calls itself until the size of the input array is zero. In the end, our method ends up executing n times, making the overall time complexity of O(n).`,
      levelId: 5,
    }),
  ]);

  console.log(`${facts.length} facts seeded ✅ `);
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
