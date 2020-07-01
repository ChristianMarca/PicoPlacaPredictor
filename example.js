const Predictor = require('./src/index');


const cases  = [['AAC-0120', '2020-07-06', '19:31'], ['AVC-0123', '2020-09-18', '12:31'], ['DCF-1267', '2021-01-01', '16:01']];

const predictor = new Predictor();

for (const testCase in cases) {
  if (cases.hasOwnProperty(testCase)) {
    const canCirculate = predictor.canCirculate(...cases[testCase]);

    if(canCirculate) {
      console.log('Congratulations you can circulate');
    } else {
      console.log('Sorry you cannot circulate');
    }  
  }
}
