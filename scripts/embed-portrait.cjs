const fs = require('fs');
const portraitBuf = fs.readFileSync('public/vikas-sir-ai-portrait.jpg');
const base64Data = 'data:image/jpeg;base64,' + portraitBuf.toString('base64');

let html = fs.readFileSync('VIdhya_Tutorials_Client_Presentation.html', 'utf8');

// Replace relative img src or any old src with base64
html = html.replace('src="vikas-sir-ai-portrait.jpg"', `src="${base64Data}"`);

// Also add a large Director Showcase on Slide 1 & Slide 2
fs.writeFileSync('VIdhya_Tutorials_Client_Presentation.html', html, 'utf8');
console.log('Updated VIdhya_Tutorials_Client_Presentation.html successfully with base64 image! Length: ' + html.length);
