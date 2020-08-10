/**
 * @param {number} n
 * @return {number[][]}
 */
export const getFactors = (n) => {
  const factors = [];

  function findFactors(chain, num) {
    const upper = Math.sqrt(num);
    let i;

    for (i = 2; i <= upper; i++) {
        if (num % i === 0) {
          const factor = [...chain, i, num / i];
          factors[factor.sort().toString()] = [...chain, i, num / i];
          findFactors([...chain, i], num / i);
        }
    }
  }

  findFactors([], n);
  return Object.values(factors);
};
