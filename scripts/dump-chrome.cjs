const { execFile } = require('child_process');
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

execFile(chromePath, [
  '--headless=new',
  '--disable-gpu',
  '--virtual-time-budget=5000',
  '--dump-dom',
  'https://vidhyatutorials.in'
], { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log('DOM length:', stdout.length);
  console.log('Contains <div id="root"></div> (empty)?:', stdout.includes('<div id="root"></div>'));
  const rootIndex = stdout.indexOf('id="root"');
  console.log('Root snippet:', stdout.substring(rootIndex, rootIndex + 400));
});
