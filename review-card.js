'use strict';

function reviewLink(entry, claim) {
  const url = new URL(window.location.href);
  url.search = new URLSearchParams({case: entry.id, claim: claim.id}).toString();
  url.hash = 'lab';
  return url.href;
}

async function copyReviewText(value, status) {
  try {
    await navigator.clipboard.writeText(value);
    status.textContent = 'Copied.';
  } catch {
    const text = document.createElement('textarea');
    text.value = value;
    text.readOnly = true;
    text.setAttribute('aria-label', 'Text to copy');
    status.replaceChildren(document.createTextNode('Select and copy the text below.'), text);
    text.focus();
    text.select();
  }
}

function cardLines(context, value, width) {
  const lines = [];
  let line = '';
  for (const word of value.split(/\s+/)) {
    const next = line ? line + ' ' + word : word;
    if (line && context.measureText(next).width > width) {
      lines.push(line);
      line = '';
    }
    for (const character of (line ? ' ' : '') + word) {
      if (context.measureText(line + character).width > width && line) {
        lines.push(line);
        line = '';
      }
      line += character;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function downloadReviewCard(entry, claim, url, status) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  const context = canvas.getContext('2d');
  const blocks = [
    ['bold 28px system-ui', 42, 'CROIZIER.AI  /  SAVE OUR AI SOCIETY'],
    ['bold 50px Georgia', 64, claim.verdict + ' · Review Card'],
    ['bold 34px system-ui', 49, claim.text],
    ['28px system-ui', 42, claim.reason],
    ...(claim.verdict === 'Maybe' && claim.action ? [['28px system-ui', 42, 'Next check: ' + claim.action]] : []),
    ['24px system-ui', 38, 'Reviewed ' + entry.reviewed + ' · Follow the evidence'],
    ['20px system-ui', 34, url]
  ].map(([font, leading, text]) => {
    context.font = font;
    return {font, leading, lines: cardLines(context, text, 1040)};
  });
  canvas.height = blocks.reduce((sum, block) => sum + block.leading * block.lines.length + 18, 146);
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#145c46';
  context.fillRect(0, 0, canvas.width, 16);
  context.fillStyle = '#14352d';
  let y = 78;
  for (const block of blocks) {
    context.font = block.font;
    context.textBaseline = 'top';
    for (const line of block.lines) {
      context.fillText(line, 80, y);
      y += block.leading;
    }
    y += 18;
  }
  canvas.toBlob((blob) => {
    if (!blob) {
      status.textContent = 'The card could not be created. Try copying the reviewed result.';
      return;
    }
    const download = document.createElement('a');
    download.href = URL.createObjectURL(blob);
    download.download = 'Croizier-Review-' + claim.id + '.png';
    document.body.append(download);
    download.click();
    download.remove();
    const objectUrl = download.href;
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    status.textContent = 'Review Card downloaded.';
  }, 'image/png');
}

function addReviewActions(panel, entry, claim) {
  const url = reviewLink(entry, claim);
  const finding = [
    'Croizier.AI Review Card · ' + entry.reviewed,
    'Claim: ' + claim.text,
    'Finding: ' + claim.verdict + ' — ' + claim.reason,
    ...(claim.action ? [claim.action] : []),
    'Read the evidence: ' + url
  ].join('\n');
  const controls = element('div', '', 'review-actions');
  const status = element('div', '', 'muted');
  status.setAttribute('role', 'status');
  controls.append(
    button('Copy reviewed result', () => copyReviewText(finding, status)),
    button('Download card', () => downloadReviewCard(entry, claim, url, status)),
    button('Copy claim link', () => copyReviewText(url, status))
  );
  panel.append(element('h4', 'Share this finding'), controls, status);
}
