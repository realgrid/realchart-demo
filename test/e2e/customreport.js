const FgGreen = '\x1b[32m';
const FgRed = '\x1b[31m';

class MyReporter {
    // onBegin(config, suite) {
    //   console.log(`Starting the run with ${suite.allTests().length} tests`);
    // }
  
    // onTestBegin(test) {
    //   console.log(`Starting test ${test.title}`);
    // }
  
    onTestEnd(test, result) {
        let title = test.title;
        if (result.status === 'failed') {
            const diffPixels = result.errors[0].message.match(/[0-9]{0,} pixels/)[0];
            test.title = diffPixels ? `[${diffPixels}] ${title}` : title;
        }
    //   console.log(`Finished test ${test.title}: ${result.status}`);
    }
  
    // onEnd(result) {
    //   console.log(`Finished the run: ${result.status}`);
    // }
  }
  
  export default MyReporter;