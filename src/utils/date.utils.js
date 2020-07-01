const dayConversion = require('../constants/days.conversion.json');

class DateUtil {

  constructor(date) {
    this.date = this.validateDate(date);
  }

  validateDate = (date) => {
    return !isNaN(Date.parse(date)) ? new Date(date) : null;
  }

  getDayOfTheWeek = () => {
    return dayConversion[this.date?.getDay()];
  }


  static validateTime = (time) => {
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
