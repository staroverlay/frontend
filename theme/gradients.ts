export type Gradient = 'jodhpur' | 'love' | 'orca' | 'venice' | 'turquoise';

export const Gradients: Record<Gradient, string> = {
  jodhpur: 'linear-gradient(to right, #65C7F7 0%, #0052D4 100%)',
  love: 'linear-gradient(to right, #4568DC 0%, #B06AB3 100%)',
  orca: 'linear-gradient(to right, #44A08D 0%, #093637 100%)',
  venice: 'linear-gradient(to right, #6190E8 0%, #A7BFE8 100%)',
  turquoise: 'linear-gradient(to right, #136a8a, #267871)',
};

export const getGradient = (gradient: Gradient) => Gradients[gradient];
