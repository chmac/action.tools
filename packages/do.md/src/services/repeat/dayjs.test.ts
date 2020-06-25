import dayjs from 'dayjs';

// Found some weirdnesses and wondered how dayjs actually works, which dates
// come first, etc, hence why these tests exist. Needless to say, dayjs was in
// fact working as expected and the errors were mine.

describe('dayjs', () => {
  describe('diff', () => {
    it('Counts days between dates #3ASANT', () => {
      expect(dayjs('2020-01-10').diff('2020-01-08', 'day')).toEqual(2);
      expect(dayjs('2020-02-28').diff('2020-01-01', 'day')).toEqual(58);
      expect(dayjs('2020-05-28').diff('2020-04-01', 'day')).toEqual(57);
    });
  });

  describe('subtract', () => {
    it('Subtracts correctly', () => {
      expect(dayjs('2020-02-28').subtract(58, 'day')).toEqual(
        dayjs('2020-01-01')
      );
      expect(dayjs('2020-02-28').subtract(58, 'day')).toEqual(
        dayjs('2020-01-01')
      );
      expect(dayjs('2020-05-28').subtract(57, 'day')).toEqual(
        dayjs('2020-04-01')
      );
    });
  });
});
