'use strict';

let currentCase = cases[0];
const byId = (id) => document.getElementById(id);
const outcomes = ['Yes', 'No', 'Maybe'];
const filter = byId('filter');
const votes = new Map();
let active = currentCase.claims[0];
let mode = 'review';

function element(tag, value, className) {
  const item = document.createElement(tag);
  if (value) item.textContent = value;
  if (className) item.className = className;
  return item;
}

function button(label, action, className) {
  const item = element('button', label, className);
  item.type = 'button';
  item.addEventListener('click', action);
  return item;
}

function renderResult() {
  const panel = byId('result');
  const vote = votes.get(active.id);
  panel.replaceChildren(element('h3', 'Evidence review'), element('p', active.text, 'claim-title'));

  if (mode === 'society' && !vote) {
    panel.append(element('p', 'Make your call before you open the bottle.'));
    const controls = element('div', '', 'votes');
    for (const outcome of outcomes) {
      controls.append(button(outcome, () => {
        votes.set(active.id, outcome);
        render();
        panel.querySelector('h3').focus();
      }));
    }
    panel.append(controls);
    panel.querySelector('h3').tabIndex = -1;
    return;
  }

  panel.querySelector('h3').tabIndex = -1;
  if (mode === 'society') panel.append(element('p', 'Your vote: ' + vote, 'muted'));
  panel.append(element('span', active.verdict, 'verdict ' + active.verdict.toLowerCase()));
  panel.append(element('p', active.scope + ' · ' + currentCase.reviewed, 'muted'));
  panel.append(element('p', active.reason));

  const evidence = element('div', '', 'evidence');
  for (const source of active.sources) {
    const card = element('article');
    const link = element('a', source.title);
    link.href = source.url;
    card.append(link, element('blockquote', source.passage));
    card.append(element('p', 'Source found: ' + source.found + ' · Claim support: ' + source.support, 'muted'));
    evidence.append(card);
  }
  panel.append(evidence);

  if (active.action) {
    panel.append(element('h4', active.verdict === 'Maybe' ? 'Next check' : 'Proposed review rule'));
    panel.append(element('p', active.action));
  }
  addReviewActions(panel, currentCase, active);
  if (mode === 'society') {
    panel.append(button('Vote again', () => {
      votes.delete(active.id);
      render();
      panel.querySelector('.votes button').focus();
    }));
  }
}

function render() {
  const visible = currentCase.claims.filter((claim) => !filter.value || claim.type === filter.value);
  const navigator = byId('claims');
  const excerpt = byId('excerpt');

  navigator.replaceChildren();
  excerpt.replaceChildren();
  for (const claim of currentCase.claims) {
    const marker = button(claim.text, () => selectClaim(claim, 'excerpt'), 'marker');
    marker.dataset.claim = claim.id;
    marker.setAttribute('aria-pressed', String(active === claim));
    excerpt.append(element('p'));
    excerpt.lastElementChild.append(marker);
  }
  for (const claim of visible) {
    const status = mode === 'review' || votes.has(claim.id) ? claim.verdict : 'Vote';
    const item = button(status + ' · ' + claim.text, () => selectClaim(claim, 'claims'), 'claim');
    item.dataset.claim = claim.id;
    item.setAttribute('aria-pressed', String(active === claim));
    navigator.append(item);
  }

  const revealed = visible.filter((claim) => mode === 'review' || votes.has(claim.id));
  const summary = outcomes.map((outcome) => revealed.filter((claim) => claim.verdict === outcome).length);
  byId('summary').textContent = mode === 'society'
    ? revealed.length + ' of ' + visible.length + ' reviewed'
    : summary[0] + ' supported · ' + summary[1] + ' contradicted · ' + summary[2] + ' unresolved';
  renderResult();
}

function selectClaim(claim, source) {
  if (filter.value && filter.value !== claim.type) filter.value = '';
  active = claim;
  render();
  byId(source).querySelector('[data-claim="' + claim.id + '"]').focus();
}

function openCase(selectedCase, claimId) {
  currentCase = selectedCase;
  active = currentCase.claims.find((claim) => claim.id === claimId) || currentCase.claims[0];
  votes.clear();
  byId('case-title').textContent = currentCase.title;
  byId('case-context').textContent = currentCase.context;
  byId('review-date').dateTime = currentCase.reviewed;
  byId('review-date').textContent = currentCase.reviewed;
  filter.replaceChildren(new Option('All types', ''));
  for (const type of new Set(currentCase.claims.map((claim) => claim.type))) {
    filter.add(new Option(type, type));
  }
  render();
}

const caseSelect = byId('case-select');
for (const entry of cases) {
  caseSelect.add(new Option(entry.title, entry.id));
}
byId('case-picker').hidden = cases.length < 2;
caseSelect.addEventListener('change', () => {
  const entry = cases.find((candidate) => candidate.id === caseSelect.value);
  if (entry) openCase(entry);
});

filter.addEventListener('change', () => {
  if (filter.value && filter.value !== active.type) {
    active = currentCase.claims.find((claim) => claim.type === filter.value);
  }
  render();
});
document.querySelectorAll('[name="mode"]').forEach((input) => {
  input.addEventListener('change', () => {
    mode = input.value;
    render();
  });
});
const requested = new URLSearchParams(window.location.search);
const linkedCase = cases.find((entry) => entry.id === requested.get('case')) || currentCase;
caseSelect.value = linkedCase.id;
openCase(linkedCase, requested.get('claim'));

byId('open-bottle').addEventListener('click', () => {
  document.querySelector('[name="mode"][value="society"]').checked = true;
  mode = 'society';
  votes.delete(active.id);
  render();
});

if (requested.has('case') && window.location.hash === '#lab') {
  byId('lab').scrollIntoView();
}
