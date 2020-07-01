import Plate from './plate';
import { DateUtil } from '../utils/date.utils';
const CALENDAR_CONSTRAINTS = require('../constants/calendar.json');
const DAY_RESTRICTION = require('../constants/days.restriction.json');

class Predictor extends Plate {

  /*
  *
  * @class Predictor
  * Handle the prediction
  *
  * @constructor
  *   - plateNumber: string
  *
  */

  constructor(plateNumber) {
    super(plateNumber);
  }

  _getCurrentRestriction = (dayOfWeek) => {
    /*
    *
    * This method return the restriction to analyze according with the day
    *
    * arguments:
    *   - dataOfWeek: string
    *
    * return:
    *   - Object
    *
    */
    return CALENDAR_CONSTRAINTS.WEEKDAY.includes(dayOfWeek)
      ? CALENDAR_CONSTRAINTS.TIME_WEEKDAY
      : CALENDAR_CONSTRAINTS.TIME_WEEKEND;
  }
  
  _checkLowerBound = (currentHour, currentMinute, constraintHour, constraintMinute) => {
    /*
    *
    * This method check if a time es greater than lower bound constraint time
    *
    * arguments:
    *   - currentHour: Number
    *   - currentMinute: Number
    *   - constraintHour: Number
    *   - constraintMinute: Number
    *
    * return:
    *   - boolean
    *
    */
    return currentHour === constraintHour
      ? currentMinute >= constraintMinute
      : currentHour > constraintHour;
  }

  _checkUpperBound = (currentHour, currentMinute, constraintHour, constraintMinute) => {
    /*
    *
    * This method check if a time es smaller than upper bound constraint time
    *
    * arguments:
    *   - currentHour: Number
    *   - currentMinute: Number
    *   - constraintHour: Number
    *   - constraintMinute: Number
    *
    * return:
    *   - boolean
    *
    */
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
    /*
    *
    * This method check if a time es between bound constraint time
    *
    * arguments:
    *   - currentTime: Number[]
    *   - boundedConstraint: Object
    *
    * return:
    *   - boolean
    *
    */
    const [currentHour, currentMinute] = currentTime;
    const { start: boundConstraintStart, end: boundConstraintEnd } = boundedConstraint;
    const [constraintHourStart, constraintMinuteStart] = DateUtil.validateTime(boundConstraintStart);
    const [constraintHourEnd, constraintMinuteEnd] = DateUtil.validateTime(boundConstraintEnd);

    return [
      this._checkLowerBound(currentHour, currentMinute, constraintHourStart, constraintMinuteStart),
      this._checkUpperBound(currentHour, currentMinute, constraintHourEnd, constraintMinuteEnd)
    ].every(limit => !!limit);

  }

  isInsideOfTheRestriction = (time, timeConstraint) => {
    /*
    *
    * This method check if a time es between two bounded constraints time
    *
    * arguments:
    *   - time: Number[]
    *   - timeConstraint: Object
    *
    * return:
    *   - boolean
    *
    */
    const checkLowerBound = this.checkBounds(time, timeConstraint['lowerBoundRestriction']);
    const checkUpperBound = this.checkBounds(time, timeConstraint['upperBoundRestriction']);
    return checkUpperBound || checkLowerBound;
  }

  isOutOfTheRange = (time, constraintSet) => {
    /*
    *
    * This method validate if a time is valid and if is inside the constraint set
    *
    * arguments:
    *   - time: Number[]
    *   - constraintSet: Object
    *
    * return:
    *   - boolean
    *
    */
    const currentTime = DateUtil.validateTime(time);
    return this.isInsideOfTheRestriction(currentTime, constraintSet);
  }

  checkTimestamp = (date, time) => {
    /*
    *
    * This method validate if a date and time is valid and if is inside the constraints
    *
    * arguments:
    *   - date: string
    *   - time: string
    *
    * return:
    *   - boolean
    *
    */
    const currentRestriction = this._getCurrentRestriction(date.getDayOfTheWeek());

    return !this.isOutOfTheRange(time, currentRestriction);
  }

  checkPlate (plateNumber=this.getPlateNumber()) {
    /*
    *
    * This method validate the plate number
    *
    * arguments:
    *   - plateNumber: string
    *
    * return:
    *   - boolean
    *
    */
    this.setPlateNumber(plateNumber);
    return this.validatePlateNumber();
  }

  canCirculate = (plateNumber, date, time) => {
    /*
    *
    * This method validate if a place number can circulate in a data and time specified
    *
    * arguments:
    *   - plateNumber: string
    *   - date: string
    *   - time: string
    *
    * return:
    *   - boolean
    *
    */
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
