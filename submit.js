'use strict';

const form = document.getElementById('submission');
const status = document.getElementById('submission-status');
const formId = submissionFormId.trim();

if (/^[a-zA-Z0-9]+$/.test(formId)) {
  form.action = 'https://formspree.io/f/' + formId;
  form.hidden = false;
  form.querySelector('button[type="submit"]').disabled = false;
  status.hidden = true;

  for (const field of form.querySelectorAll('textarea[required]')) {
    field.addEventListener('input', () => {
      field.setCustomValidity(field.value.trim() ? '' : 'Enter text in this field.');
    });
    form.addEventListener('submit', (event) => {
      if (!field.value.trim()) {
        event.preventDefault();
        field.setCustomValidity('Enter text in this field.');
        field.reportValidity();
      }
    });
  }
}
