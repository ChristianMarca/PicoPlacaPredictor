const Predictor = require('./src/index');


const cases  = [
  ['AAC-0120', '2020/07/06', '19:30'],
  ['AVC-0123', '2020/09/18', '12:31'],
  ['DCF-1267', '2021/01/01', '16:01'],
  ['DCF-6565', '2020/12/16', '08:35']
];

const predictor = new Predictor();

for (const testCase in cases) {
  // eslint-disable-next-line no-prototype-builtins
  if (cases.hasOwnProperty(testCase)) {
    const canCirculate = predictor.canCirculate(...cases[testCase]);

    if(canCirculate) {
      console.log('Congratulations you can circulate');
    } else {
      console.log('Sorry you cannot circulate');
    }  
  }
}
