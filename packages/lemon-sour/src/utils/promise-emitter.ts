import { EventEmitter, ListenerFn } from 'eventemitter3';

class PromiseEmitter extends EventEmitter {
  // @ts-ignore: Unreachable code error
  emit(event: string, ...args: Array<any>): Promise<any> {
    let promises: any[] = [];

    this.listeners(event).forEach((listener: ListenerFn) => {
      promises.push(listener(...(args as Array<any>)));
    });

    return Promise.all(promises);
  }
}

export default PromiseEmitter;
