'use strict';

const followUps = new Map([
    ['reviewed', 'Choose a follow-up to continue this investigation.'],
    ['sources', 'The newer notice wins because it names the exact date and explicitly overrides regular hours. Recency alone would not decide the question.'],
    ['next', 'A later notice from the library reopening the branch on November 30 would change the answer. Compare the branch, date, and issuing authority.']
]);

const byId = (id) => document.getElementById(id);
const link = byId('resume-link');
const status = byId('share-status');
const qrArea = byId('qr-area');
const qrButton = byId('show-qr');

function hideQr() {
    qrArea.hidden = true;
    qrButton.textContent = 'Show QR';
    qrButton.setAttribute('aria-expanded', 'false');
}

function showStep(step, updateAddress) {
    const url = new URL(window.location.href);
    url.search = '';
    url.searchParams.set('step', step);
    url.hash = '';
    if (updateAddress) history.replaceState(null, '', url.href);
    link.value = url.href;
    byId('result').hidden = false;
    byId('sharing').hidden = false;
    byId('process').hidden = true;
    byId('follow-up').textContent = followUps.get(step);
    for (const button of document.querySelectorAll('[data-step]')) {
        button.setAttribute('aria-pressed', String(button.dataset.step === step));
    }
    hideQr();
    status.textContent = '';
}

byId('process').addEventListener('click', () => {
    showStep('reviewed', true);
    document.querySelector('[data-step]').focus();
});
for (const button of document.querySelectorAll('[data-step]')) {
    button.addEventListener('click', () => showStep(button.dataset.step, true));
}
byId('copy-link').addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(link.value);
        status.textContent = 'Link copied.';
    } catch {
        link.focus();
        link.select();
        status.textContent = 'Select Copy in your browser to copy the link.';
    }
});
qrButton.addEventListener('click', () => {
    if (!qrArea.hidden) {
        hideQr();
        return;
    }
    if (!/^https?:/.test(link.value)) {
        status.textContent = 'Open the site from a web address to create a scannable link.';
        return;
    }
    try {
        const matrix = window.CroizierQRCode(link.value);
        const canvas = byId('qr');
        const scale = 6;
        const margin = 4;
        canvas.width = canvas.height = (matrix.length + 2 * margin) * scale;
        const context = canvas.getContext('2d');
        context.fillStyle = '#fff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#000';
        matrix.forEach((row, y) => row.forEach((dark, x) => {
            if (dark) context.fillRect((x + margin) * scale, (y + margin) * scale, scale, scale);
        }));
        qrArea.hidden = false;
        qrButton.textContent = 'Hide QR';
        qrButton.setAttribute('aria-expanded', 'true');
        status.textContent = '';
    } catch {
        status.textContent = 'Could not make this QR code. You can still copy the link.';
    }
});

const initialStep = new URLSearchParams(location.search).get('step');
if (followUps.has(initialStep)) showStep(initialStep, false);
