import { LatestJsonInterface } from '../interface/latest-json-interface';

const splitExtension = (latest: LatestJsonInterface) => {
  return latest.fileUrl.split('.').pop() || '';
};

export { splitExtension };
