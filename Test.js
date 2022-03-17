const { spawn } = require('child_process');
const childPython = spawn('python',['test.py']);
childPython.stdout.on('data',(data) => {
    let m = data.toString();
    m = m.split();
    console.log(m);
    console.log(`The data that is : ${data}`);
});
childPython.stderr.on('data',(data) => {
    console.log(`The error found : ${data}`);
})
childPython.on('close',(close) => {
    console.log('Closed properly')
})
// console.log(childPython)