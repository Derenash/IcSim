export const physicsParams = {
  repulsion: 25,
  attraction: 25,
  cooling: 99.5
};

export const tickInterval = 16; // in milliseconds

export const reductionStart = "Off";

const two = "λf.λx.(f (f x))"
const two_exp_two = "(λfλx(f (f x)) λaλb(a (a b)))"
export const startingTerm = two_exp_two;