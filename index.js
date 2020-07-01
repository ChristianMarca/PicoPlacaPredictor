const readline = require('readline');
const Predictor = require('./src/index');

const inputInterface = readline.createInterface( process.stdin, process.stdout );

console.info('ENTER YOUR PLATE');

const picoPlacaPredictor = new Predictor();

const question = (q) => {
  return new Promise( (resolve, reject) => {
    inputInterface.question( q, answer => {
      resolve(answer);
    });
  });
};

(async function main() {
  let continueExecution;
  while ( continueExecution !== 'n' ) {
    const data = await question('Plate number, date, time\n');
    const dataConverted = data.split(',').map(item => item.trim());
    const canCirculate = picoPlacaPredictor.canCirculate(...dataConverted);
    
    if(canCirculate) {
      console.log('Congratulations you can circulate');
    } else {
      console.log('Sorry you cannot circulate');
    }

    continueExecution = await question('Do you want try again (y)/(n)?');
  }
  console.log( 'Tank you!');
  process.exit(0);
})();
