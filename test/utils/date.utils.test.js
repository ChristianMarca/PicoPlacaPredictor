import { DateUtil } from '../../src/utils/date.utils';

describe('Validate date', () => {
  const dateUtil = new DateUtil();

  test('should validate a valid date with - format', () => {
    return expect(dateUtil.validateDate('2020-12-10')).toBeTruthy();
  });

  test('should validate a valid date with / format', () => {
    return expect(dateUtil.validateDate('2020/12/10')).toBeTruthy();
  });

  test('should validate a date with . format', () => {
    return expect(dateUtil.validateDate('2020.12.10')).toBeTruthy();
  });

  test('should validate a invalid date', () => {
    return expect(dateUtil.validateDate('20201210')).toBeNull();
  });
  
  test('should get the monday day', () => {
    const dateUtilMonday = new DateUtil('2020/07/06');
    return expect(dateUtilMonday.getDayOfTheWeek()).toBe('MO');
  });

  test('should get the sunday day', () => {
    const dateUtilMonday = new DateUtil('2020/08/23');
    return expect(dateUtilMonday.getDayOfTheWeek()).toBe('SU');
  });

  test('should get invalid day', () => {
    const dateUtilMonday = new DateUtil('2020/08/233');
    return expect(dateUtilMonday.getDayOfTheWeek()).toBeFalsy();
  });

  test('should validate time valid date format', () => {
    return expect(DateUtil.validateTime('12:00')).toStrictEqual([12, 0]);
  });

  test('should validate time invalid date format', () => {
    return expect(DateUtil.validateTime('12:60')).toStrictEqual([]);
  });

  test('should validate time invalid date format', () => {
    return expect(DateUtil.validateTime('12-60')).toStrictEqual([]);
  });
});



