class Plate {

  /*
  *
  * @class Plate
  * Handle the plate number
  *
  * @constructor
  *   - plateNumber: string
  *
  */

  constructor(plateNumber) {
    this.plateNumber = plateNumber;
  }

    _validateRegexPlateNumber = () => {
      /*
      *
      * This method validate the plate number string
      *
      * arguments:
      *
      * return:
      *   - boolean
      *
      */
      const re = /[a-zA-Z]{3}[-\s.][0-9]{4}/gm;
      return re.test(this.plateNumber);
    }

    validatePlateNumber = () => {
      /*
      *
      * This method validate the plate number datatype
      *
      * arguments:
      *
      * return:
      *   - boolean
      *
      */
      return typeof this.getPlateNumber() === 'string' && this._validateRegexPlateNumber();
    }

    getPlateNumber = () => {
      /*
      *
      * This method return the plate number if it is valid
      *
      * arguments:
      *
      * return:
      *   - string if is valid
      *   - null if is invalid
      *
      */
      return this._validateRegexPlateNumber()
        ? this.plateNumber
        : null;
    }

    getLastDigitOfPlate = () => {
      /*
       *
       * This method return the last digit of a plate number if it is valid
       *
       * arguments:
       *
       * return:
       *   - string if is valid
       *   - null if is invalid
       *
       */
      return this.validatePlateNumber()
        ? Number(this.plateNumber.slice(-1))
        : null;
    }

     setPlateNumber = (plateNumber) => {
       /*
        *
        * This method update the place number state
        *
        * arguments:
        *   - plateNumber: string
        *
        * return:
        *   - void
        *
        */
       this.plateNumber = plateNumber;
     }


}

export default Plate;
