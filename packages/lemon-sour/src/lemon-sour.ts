import { CliArgsInterface } from '@lemon-sour/cli';

class LemonSour {
  constructor() {}

  run(args: CliArgsInterface) {
    console.log(args.x);
  }
}

const lemonSour = new LemonSour();
export { lemonSour };
