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
      ws.send(JSON.stringify({
        id: 3,
        method: 'Page.navigate',
        params: { url: 'https://vidhyatutorials.in' }
      }));
    };

    ws.onmessage = async (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === 10) {
        // Screenshot result
        const base64Data = msg.result.data;
        fs.writeFileSync('scripts/live_capture.png', Buffer.from(base64Data, 'base64'));
        console.log('Saved live_capture.png! Size:', fs.statSync('scripts/live_capture.png').size);
      }
      if (msg.id === 11) {
        console.log('Root innerHTML length:', msg.result?.result?.value?.length);
        console.log('Root snippet:', msg.result?.result?.value?.substring(0, 300));
      }
    };

    // Wait 5 seconds for React to paint
    setTimeout(() => {
      ws.send(JSON.stringify({
        id: 11,
        method: 'Runtime.evaluate',
        params: { expression: 'document.getElementById("root") ? document.getElementById("root").innerHTML : "NO ROOT"' }
      }));
      ws.send(JSON.stringify({
        id: 10,
        method: 'Page.captureScreenshot',
        params: { format: 'png' }
      }));

      setTimeout(() => {
        ws.close();
        chrome.kill();
        process.exit(0);
      }, 2000);
    }, 6000);

  } catch (e) {
    console.error(e);
    chrome.kill();
    process.exit(1);
  }
}, 1500);
