import { cli } from '@lemon-sour/cli';
console.log(cli());

const s: string = 'lemon-sour';
console.log(s);

const lemonSour = () => {
  return 'calling lemonSour' as string;
};

export { lemonSour };
