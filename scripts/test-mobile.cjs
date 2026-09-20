const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

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
      ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
      ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
      ws.send(JSON.stringify({ id: 3, method: 'Network.enable' }));

      // Emulate mobile device: Pixel 7 (412 x 915)
      ws.send(JSON.stringify({
        id: 4,
        method: 'Emulation.setDeviceMetricsOverride',
        params: {
          width: 412,
          height: 915,
          deviceScaleFactor: 2.625,
          mobile: true
        }
      }));

      // Emulate mobile user-agent
      ws.send(JSON.stringify({
        id: 5,
        method: 'Network.setUserAgentOverride',
        params: {
          userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36'
        }
      }));

      // Navigate to live site
      ws.send(JSON.stringify({
        id: 6,
        method: 'Page.navigate',
        params: { url: 'https://vidhyatutorials.in' }
      }));
    };

    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === 20) {
        fs.writeFileSync('scripts/mobile_capture.png', Buffer.from(msg.result.data, 'base64'));
        console.log('Saved scripts/mobile_capture.png! Size:', fs.statSync('scripts/mobile_capture.png').size);
      }
      if (msg.id === 21) {
        console.log('Mobile root content length:', msg.result?.result?.value?.length);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        console.error('MOBILE EXCEPTION:', msg.params.exceptionDetails);
      }
    };

    setTimeout(() => {
      ws.send(JSON.stringify({
        id: 21,
        method: 'Runtime.evaluate',
        params: { expression: 'document.getElementById("root")?.innerHTML' }
      }));
      ws.send(JSON.stringify({
        id: 20,
        method: 'Page.captureScreenshot',
        params: { format: 'png' }
      }));

      setTimeout(() => {
        ws.close();
        chrome.kill();
        process.exit(0);
      }, 2000);
    }, 7000);

  } catch(e) {
    console.error(e);
    chrome.kill();
    process.exit(1);
  }
}, 1500);
