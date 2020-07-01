import Plate from '../../src/predictor/plate';

describe('Validate Plate', () => {
  const originalPlateNumber = 'ABB-4567';
  const plate = new Plate(originalPlateNumber);

  test('should get the plate number', () => {
    return expect(plate.getPlateNumber()).toBe(originalPlateNumber);
  });

  test('should set a new plate number', () => {
    const newPlateNumber = 'ACC-1234';
    plate.setPlateNumber(newPlateNumber);
    return expect(plate.getPlateNumber()).toBe(newPlateNumber);
  });

  test('should validate a valid plate format', () => {
    plate.setPlateNumber('ACC-1234');
    return expect(plate._validateRegexPlateNumber()).toBeTruthy();
  });

  test('should validate a invalid plate format', () => {
    plate.setPlateNumber('ACC-12A4');
    return expect(plate._validateRegexPlateNumber()).toBeFalsy();
  });

  test('should validate a valid plate', () => {
    plate.setPlateNumber('ACC-1244');
    return expect(plate.validatePlateNumber()).toBeTruthy();
  });

  test('should validate a invalid plate', () => {
    plate.setPlateNumber('ACC-12A4');
    return expect(plate.validatePlateNumber()).toBeFalsy();
  });

  test('should get last digit of the a valid plate number', () => {
    plate.setPlateNumber('ACC-1244');
    return expect(plate.getLastDigitOfPlate()).toBe(4);
  });

  test('should get last digit of the a invalid plate number', () => {
    plate.setPlateNumber('ACC-12C4');
    return expect(plate.getLastDigitOfPlate()).toBeNull();
  });
    
});



