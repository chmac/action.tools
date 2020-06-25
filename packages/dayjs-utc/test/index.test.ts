import dayjs from '../src';

describe('dayjs', () => {
  it('has utc enabled #CezfZh', () => {
    expect(typeof dayjs.utc).not.toEqual('undefined');
  });
});
