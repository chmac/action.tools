import { isEmpty, removeEmptyProperties } from './utils';

describe('utils', () => {
  describe('isEmpty()', () => {
    it('Returns true for undefined #82VIq2', () => {
      expect(isEmpty(undefined)).toEqual(true);
    });

    it('Returns false for true #0hctCT', () => {
      expect(isEmpty(true)).toEqual(false);
    });

    it('Returns false for false #KdAQrp', () => {
      expect(isEmpty(false)).toEqual(false);
    });

    it('Returns false for 0 #J2VJZJ', () => {
      expect(isEmpty(0)).toEqual(false);
    });

    it('Returns true for empty string #1yMx41', () => {
      expect(isEmpty('')).toEqual(true);
    });

    it('Returns false for non empty string #xllsRw', () => {
      expect(isEmpty('foo')).toEqual(false);
    });

    it('Returns true for null #vALatJ', () => {
      expect(isEmpty(null)).toEqual(true);
    });
  });

  describe('removeEmptyProperties()', () => {
    it('Removes an empty string #YYLC2L', () => {
      expect(removeEmptyProperties({ foo: 'bar', baz: '' })).toEqual({
        foo: 'bar',
      });
    });
    it('Removes an empty array #qVhe4I', () => {
      expect(removeEmptyProperties({ foo: 'bar', baz: [] })).toEqual({
        foo: 'bar',
      });
    });
    it('Removes a null value #gva17V', () => {
      expect(removeEmptyProperties({ foo: 'bar', baz: null })).toEqual({
        foo: 'bar',
      });
    });
    it('Removes an array of one empty string #wrFcCu', () => {
      expect(removeEmptyProperties({ foo: 'bar', baz: [''] })).toEqual({
        foo: 'bar',
      });
    });
    it('Removes undefined #XXdUhS', () => {
      expect(removeEmptyProperties({ foo: 'bar', baz: undefined })).toEqual({
        foo: 'bar',
      });
    });
  });
});
