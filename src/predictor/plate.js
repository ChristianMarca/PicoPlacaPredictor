class Plate {

  constructor(plateNumber) {
    this.plateNumber = plateNumber;
  }

    _validateRegexPlateNumber = () => {
      const re = /[a-zA-Z]{3}[-\s.][0-9]{4}/gm;
      return re.test(this.plateNumber);
    }

    validatePlateNumber = () => {
      return typeof this.getPlateNumber() === 'string' && this._validateRegexPlateNumber();
    }

    getPlateNumber = () => {
      return this._validateRegexPlateNumber()
        ? this.plateNumber
        : null;
    }

    getLastDigitOfPlate = () => {
      return this.validatePlateNumber()
        ? Number(this.plateNumber.slice(-1))
        : null;
    }

     setPlateNumber = (plateNumber) => {
       this.plateNumber = plateNumber;
     }


}

export default Plate;
