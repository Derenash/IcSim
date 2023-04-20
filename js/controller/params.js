export let param = {
  // Repulsion Strength
  rep_str:     25,
  // Repulsion Exponent
  rep_exp:     2, 
  // Attraction Strength
  att_str:     25,
  // Atraction Exponent
  att_exp:     1,
  // Rotation Strength
  rot_str:     0.003,
  // Speed Maintained each frame
  friction:    0.5,
  // If reductions should be done or not
  reductions: "Off"
};

export const tickInterval = 16; // in milliseconds

const two = "λf.λx.(f (f x))"
const two_exp_two = "(λfλx(f (f x)) λaλb(a (a b)))"
export const startingTerm = two_exp_two;