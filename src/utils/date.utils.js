const dayConversion = require('../constants/days.conversion.json');

class DateUtil {

  /*
  *
  * @class DateUtil
  * Handle date validation and tools
  *
  * @constructor
  *   - date: string
  *
  */

  constructor(date) {
    this.date = this.validateDate(date);
  }

  validateDate = (date) => {
    /*
    *
    * This method validate the date string
    *
    * arguments:
    *   - data: string
    *
    * return:
    *   - Date object if is valid
    *   - null if is invalid
    *
    */
    return !isNaN(Date.parse(date)) ? new Date(date) : null;
  }

  getDayOfTheWeek = () => {
    /*
    *
    * This method return tha day for a specific date
    *
    * arguments:
    *
    * return:
    *   - string
    *
    */
    return dayConversion[this.date?.getDay()];
  }


  static validateTime = (time) => {
    /*
    *
    * This method validate a time string
    *
    * arguments:
    *   - time: string
    *
    * return:
    *   - array[2]
    *
    */
    const re = /[0-9]{2}[:\s.][0-9]{2}/gm;
    const [hour, minute] = re.test(time) ? time.split(/[:\s.]/) : [];
    const hourNumber = Number(hour);
    const minuteNumber = Number(minute);

    return hourNumber >= 0 && hourNumber < 24 && minuteNumber >= 0 && minuteNumber < 60
      ? [hourNumber, minuteNumber]
      : [];
  }

}

export { DateUtil };
