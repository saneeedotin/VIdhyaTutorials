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
    if (!target) {
      console.log('No page target found');
      chrome.kill();
      return;
    }

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    ws.onopen = () => {
      console.log('Connected to CDP!');
      // Enable Page, Runtime, Log, Network
      ws.send(JSON.stringify({ id: 1, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Log.enable' }));
      ws.send(JSON.stringify({ id: 4, method: 'Network.enable' }));

      // Navigate
      ws.send(JSON.stringify({
        id: 5,
        method: 'Page.navigate',
        params: { url: 'https://vidhyatutorials.in' }
      }));
    };

    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        console.error('🔥 RUNTIME EXCEPTION:', JSON.stringify(msg.params.exceptionDetails, null, 2));
      } else if (msg.method === 'Runtime.consoleAPICalled') {
        console.log('📢 CONSOLE:', msg.params.type, msg.params.args.map(a => a.value || a.description).join(' '));
      } else if (msg.method === 'Log.entryAdded') {
        console.log('📋 LOG:', msg.params.entry.level, msg.params.entry.text);
      } else if (msg.method === 'Network.loadingFailed') {
        console.log('❌ NETWORK FAILED:', msg.params.errorText, msg.params.type);
      } else if (msg.method === 'Network.responseReceived') {
        const res = msg.params.response;
        if (res.status >= 400 || res.url.includes('.js')) {
          console.log('🌐 NET RESPONSE:', res.status, res.url, res.mimeType);
        }
      }
    };

    setTimeout(() => {
      console.log('--- Done inspecting ---');
      ws.close();
      chrome.kill();
      process.exit(0);
    }, 6000);

  } catch (e) {
    console.error('Error:', e);
    chrome.kill();
    process.exit(1);
  }
}, 1500);
