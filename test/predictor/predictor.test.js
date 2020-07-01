const Predictor = require('../../src/predictor/index');
import { DateUtil } from '../../src/utils/date.utils';
const CALENDAR_CONSTRAINTS = require('../../src/constants/calendar.json');

describe('Validate Plate', () => {
  const originalPlateNumber = 'ABB-4567';
  const predictor = new Predictor(originalPlateNumber);

  test('should get weekday (Monday) restriction', () => {
    return expect(predictor.getCurrentRestriction('MO')).toStrictEqual(CALENDAR_CONSTRAINTS['TIME_WEEKDAY']);
  });

  test('should get weekday (Friday) restriction', () => {
    return expect(predictor.getCurrentRestriction('FR')).toStrictEqual(CALENDAR_CONSTRAINTS['TIME_WEEKDAY']);
  });

  test('should get weekend (sunday) restriction', () => {
    return expect(predictor.getCurrentRestriction('SU')).toStrictEqual(CALENDAR_CONSTRAINTS['TIME_WEEKEND']);
  });

  test('should verify if hour/minute is greater than the restriction in lower bound (true)', () => {
    return expect(predictor.checkLowerBound(7, 1, 7, 0)).toBeTruthy();
  });

  test('should verify if hour/minute is greater than the restriction in lower bound (false)', () => {
    return expect(predictor.checkLowerBound(7, 1, 7, 2)).toBeFalsy();
  });

  test('should verify if hour/minute is equal than the restriction in lower bound (false)', () => {
    return expect(predictor.checkLowerBound(7, 0, 7, 0)).toBeTruthy();
  });

  test('should verify if hour/minute is smaller than the restriction in upper bound (true)', () => {
    return expect(predictor.checkUpperBound(19, 29, 19, 30)).toBeTruthy();
  });

  test('should verify if hour/minute is smaller than the restriction in upper bound (true) 24h', () => {
    return expect(predictor.checkUpperBound(23, 29, 0, 30)).toBeTruthy();
  });

  test('should verify if hour/minute is smaller than the restriction in upper bound (false)', () => {
    return expect(predictor.checkUpperBound(19, 31, 19, 30)).toBeFalsy();
  });

  test('should verify if hour/minute is equal than the restriction in upper bound (false)', () => {
    return expect(predictor.checkUpperBound(19, 30, 19, 30)).toBeTruthy();
  });

  test('should verify if hour/minute is between bound (true)', () => {
    return expect(predictor.checkBounds([9, 30], { start: '07:00', end: '10:00' })).toBeTruthy();
  });

  test('should verify if hour/minute is between bound (false)', () => {
    return expect(predictor.checkBounds([6, 30], { start: '07:00', end: '10:00' })).toBeFalsy();
  });

  test('should verify if hour/minute is inside at least one bound (upper/true)', () => {
    return expect(predictor.isInsideOfTheRestriction([18, 30], CALENDAR_CONSTRAINTS['TIME_WEEKDAY'])).toBeTruthy();
  });

  test('should verify if hour/minute is inside at least one bound (lower/true)', () => {
    return expect(predictor.isInsideOfTheRestriction([8, 30], CALENDAR_CONSTRAINTS['TIME_WEEKDAY'])).toBeTruthy();
  });

  test('should verify if hour/minute is inside at least one bound (false)', () => {
    return expect(predictor.isInsideOfTheRestriction([12, 30], CALENDAR_CONSTRAINTS['TIME_WEEKDAY'])).toBeFalsy();
  });

  test('should verify if time is inside at least one bound (upper/false)', () => {
    return expect(predictor.isOutOfTheRange('18:30', CALENDAR_CONSTRAINTS['TIME_WEEKDAY'])).toBeTruthy();
  });

  test('should verify if time is inside at least one bound (lower/false)', () => {
    return expect(predictor.isOutOfTheRange('08:30', CALENDAR_CONSTRAINTS['TIME_WEEKDAY'])).toBeTruthy();
  });

  test('should verify if time is inside at least one bound (true)', () => {
    return expect(predictor.isOutOfTheRange('12:30', CALENDAR_CONSTRAINTS['TIME_WEEKDAY'])).toBeFalsy();
  });

  test('should verify if timestamp is inside at least one bound (true)', () => {
    const date = new DateUtil('2020/07/07');
    return expect(predictor.checkTimestamp(date, '12:30')).toBeTruthy();
  });

  test('should verify if timestamp is inside at least one bound (false)', () => {
    const date = new DateUtil('2020/07/08');
    return expect(predictor.checkTimestamp(date, '07:30')).toBeFalsy();
  });

  test('should validate the plate number (true)', () => {
    const plateNumber = 'ACC-1234';
    return expect(predictor.checkPlate(plateNumber)).toBeTruthy();
  });

  test('should validate the plate number (false)', () => {
    const plateNumber = 'ACC-12A4';
    return expect(predictor.checkPlate(plateNumber)).toBeFalsy();
  });
  
  test('should validate plate number (valid) and timestamp (valid)', () => {
    const plateNumber = 'ACC-1244';
    const date = '2020/07/07';
    const time = '12:30';
    return expect(predictor.canCirculate(plateNumber, date, time)).toBeTruthy();
  });

  test('should validate plate number (valid) and timestamp (invalid)', () => {
    const plateNumber = 'ACC-1244';
    const date = '2020/07/07';
    const time = '12:70';
    return expect(predictor.canCirculate(plateNumber, date, time)).toBeUndefined();
  });

  test('should validate plate number (invalid) and timestamp (valid)', () => {
    const plateNumber = 'ACC-12A4';
    const date = '2020/07/07';
    const time = '12:20';
    return expect(predictor.canCirculate(plateNumber, date, time)).toBeUndefined();
  });

  test('should validate plate number (invalid) and timestamp (invalid)', () => {
    const plateNumber = 'ACC-12A4';
    const date = '2020/07/07';
    const time = '12:70';
    return expect(predictor.canCirculate(plateNumber, date, time)).toBeUndefined();
  });

  test('should validate plate number (valid) and timestamp (valid) / (true)', () => {
    const plateNumber = 'ACC-1224';
    const date = '2020/07/07';
    const time = '07:30';
    return expect(predictor.canCirculate(plateNumber, date, time)).toBeTruthy();
  });

  test('should validate plate number (valid) and timestamp (valid) / (false)', () => {
    const plateNumber = 'ACC-1256';
    const date = '2020/07/07';
    const time = '17:30';
    return expect(predictor.canCirculate(plateNumber, date, time)).toBeFalsy();
  });

  test('should validate plate number (valid) and timestamp (valid) / (true/inside)', () => {
    const plateNumber = 'ACC-1256';
    const date = '2020/07/07';
    const time = '12:30';
    return expect(predictor.canCirculate(plateNumber, date, time)).toBeTruthy();
  });

  test('should validate plate number (valid) and timestamp (valid) / (true/weekend)', () => {
    const plateNumber = 'ACC-1256';
    const date = '2020/07/11';
    const time = '12:30';
    return expect(predictor.canCirculate(plateNumber, date, time)).toBeTruthy();
  });
});


