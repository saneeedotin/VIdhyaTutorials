const { execFile } = require('child_process');
const bravePath = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';

execFile(bravePath, [
  '--headless=new',
  '--disable-gpu',
  '--virtual-time-budget=6000',
  '--dump-dom',
  'https://vidhyatutorials.in'
], { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
  if (err) {
    console.error('Brave error:', err);
    return;
  }
  console.log('Brave DOM length:', stdout.length);
  console.log('Empty root?:', stdout.includes('<div id="root"></div>'));
  console.log('Contains Creators of Creative Minds?:', stdout.includes('Creators of Creative Minds') || stdout.includes('Vidhya Tutorials'));
});
