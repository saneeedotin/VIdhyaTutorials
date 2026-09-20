const { spawn } = require('child_process');
const http = require('http');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const port = 9222;

const chrome = spawn(chromePath, [
  '--headless=new',
  '--disable-gpu',
  `--remote-debugging-port=${port}`,
  'about:blank'
]);

setTimeout(async () => {
  try {
    const list = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${port}/json`, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => resolve(JSON.parse(d)));
      }).on('error', reject);
    });

    const target = list.find(t => t.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Log.enable' }));
      ws.send(JSON.stringify({ id: 4, method: 'Network.enable' }));
      ws.send(JSON.stringify({
        id: 5,
        method: 'Page.navigate',
        params: { url: 'https://vidhyatutorials.in' }
      }));
    };

    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Network.responseReceived') {
        const res = msg.params.response;
        console.log('RES:', res.status, res.url);
      }
      if (msg.method === 'Network.loadingFailed') {
        console.log('FAIL:', msg.params.errorText, msg.params.canceled);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.error('EXCEPTION:', msg.params.exceptionDetails);
      }
      if (msg.method === 'Runtime.consoleAPICalled') {
        console.log('CONSOLE:', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
      }
    };

    setTimeout(() => {
      ws.close();
      chrome.kill();
      process.exit(0);
    }, 6000);

  } catch (e) {
    console.error(e);
    chrome.kill();
    process.exit(1);
  }
}, 1500);
