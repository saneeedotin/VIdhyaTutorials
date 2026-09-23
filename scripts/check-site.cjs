const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const testUrl = process.argv[2] || 'http://localhost:3000';
console.log('Testing URL:', testUrl);

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  'about:blank'
]);

setTimeout(async () => {
  try {
    const list = await new Promise((res, rej) => {
      http.get('http://127.0.0.1:9222/json', r => {
        let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
      }).on('error', rej);
    });

    const target = list.find(t => t.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Network.enable' }));
      ws.send(JSON.stringify({ id: 4, method: 'Log.enable' }));
      ws.send(JSON.stringify({
        id: 5,
        method: 'Network.setUserAgentOverride',
        params: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'
        }
      }));
      ws.send(JSON.stringify({ id: 6, method: 'Page.navigate', params: { url: testUrl } }));
    };

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.method === 'Runtime.exceptionThrown') {
        console.error('BROWSER JS EXCEPTION:', JSON.stringify(msg.params.exceptionDetails, null, 2));
      }
      if (msg.method === 'Log.entryAdded') {
        console.log('LOG ENTRY:', msg.params.entry);
      }
      if (msg.method === 'Network.loadingFailed') {
        console.error('NETWORK FAILED:', msg.params.requestId, msg.params.errorText, msg.params.type);
      }
      if (msg.method === 'Network.responseReceived') {
        if (msg.params.response.status >= 400) {
          console.error('HTTP ERROR:', msg.params.response.status, msg.params.response.url);
        }
      }
      if (msg.method === 'Runtime.consoleAPICalled') {
        console.log('CONSOLE [' + msg.params.type + ']:', msg.params.args?.map(a => a.value || a.description).join(' '));
      }
      if (msg.id === 10) {
        console.log('PAGE EVAL RESULT:', JSON.stringify(msg.result?.result?.value, null, 2));
      }
      if (msg.id === 20) {
        fs.writeFileSync('scripts/site_screenshot.png', Buffer.from(msg.result.data, 'base64'));
        console.log('Screenshot saved to scripts/site_screenshot.png');
      }
    };

    setTimeout(() => {
      ws.send(JSON.stringify({
        id: 10,
        method: 'Runtime.evaluate',
        params: {
          expression: 'JSON.stringify({ title: document.title, rootHTML: document.getElementById("root")?.innerHTML?.slice(0, 300), bodyText: document.body?.innerText?.slice(0, 300) })',
          returnByValue: true
        }
      }));
      ws.send(JSON.stringify({
        id: 20,
        method: 'Page.captureScreenshot',
        params: { format: 'png' }
      }));
    }, 4000);

    setTimeout(() => {
      ws.close();
      chrome.kill();
      process.exit(0);
    }, 6000);

  } catch(err) {
    console.error('Error:', err);
    chrome.kill();
    process.exit(1);
  }
}, 1500);
