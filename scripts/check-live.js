async function inspect() {
  const html = await (await fetch('https://vidhyatutorials.in/')).text();
  console.log('--- FULL LIVE HTML ---');
  console.log(html);
}
inspect();
