import Plate from './plate';
import { DateUtil } from '../utils/date.utils';
const CALENDAR_CONSTRAINTS = require('../constants/calendar.json');
const DAY_RESTRICTION = require('../constants/days.restriction.json');

class Predictor extends Plate {
  constructor(plateNumber) {
    super(plateNumber);
  }

  getCurrentRestriction = (dayOfWeek) => {
    return CALENDAR_CONSTRAINTS.WEEKDAY.includes(dayOfWeek)
      ? CALENDAR_CONSTRAINTS.TIME_WEEKDAY
      : CALENDAR_CONSTRAINTS.TIME_WEEKEND;
  }
  
  checkLowerBound = (currentHour, currentMinute, constraintHour, constraintMinute) => {
    return currentHour === constraintHour
      ? currentMinute >= constraintMinute
      : currentHour > constraintHour;
  }

  checkUpperBound = (currentHour, currentMinute, constraintHour, constraintMinute) => {
    if (currentHour === constraintHour) {
      return currentMinute !== 0 && currentMinute <= constraintMinute;
    } else if (constraintHour === 0) {
      if (currentHour < 24) {
        return true;
      }
    }

    return currentHour < constraintHour;

  }

  checkBounds = (currentTime, boundedConstraint) => {
    const [currentHour, currentMinute] = currentTime;
    const { start: boundConstraintStart, end: boundConstraintEnd } = boundedConstraint;
    const [constraintHourStart, constraintMinuteStart] = DateUtil.validateTime(boundConstraintStart);
    const [constraintHourEnd, constraintMinuteEnd] = DateUtil.validateTime(boundConstraintEnd);

    return [
      this.checkLowerBound(currentHour, currentMinute, constraintHourStart, constraintMinuteStart),
      this.checkUpperBound(currentHour, currentMinute, constraintHourEnd, constraintMinuteEnd)
    ].every(limit => !!limit);

  }

  isInsideOfTheRestriction = (time, timeConstraint) => {
    const checkLowerBound = this.checkBounds(time, timeConstraint['lowerBoundRestriction']);
    const checkUpperBound = this.checkBounds(time, timeConstraint['upperBoundRestriction']);
    return checkUpperBound || checkLowerBound;
  }

  isOutOfTheRange = (time, constraintSet) => {
    const currentTime = DateUtil.validateTime(time);
    return this.isInsideOfTheRestriction(currentTime, constraintSet);
  }

  checkTimestamp = (date, time) => {
    const currentRestriction = this.getCurrentRestriction(date.getDayOfTheWeek());

    return !this.isOutOfTheRange(time, currentRestriction);
  }

  checkPlate (plateNumber=this.getPlateNumber()) {
    this.setPlateNumber(plateNumber);
    return this.validatePlateNumber();
  }

  canCirculate = (plateNumber, date, time) => {
    const dateObj = new DateUtil(date);
    const plateValidated = this.checkPlate(plateNumber);

    if (plateValidated && dateObj.validateDate(date) && DateUtil.validateTime(time).length) {
      const lastDigitNumber = this.getLastDigitOfPlate();
      const dayInTheDate = dateObj.getDayOfTheWeek();

      if (CALENDAR_CONSTRAINTS.WEEKEND.includes(dayInTheDate)){
        return true;
      }

      const canCirculate = DAY_RESTRICTION[dayInTheDate]?.includes(lastDigitNumber);
      const canCirculateAtThisTime = this.checkTimestamp(dateObj, time);

      return canCirculateAtThisTime || ( canCirculateAtThisTime || canCirculate);
    }
  }
}

module.exports = Predictor;
