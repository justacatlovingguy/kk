'use strict';

const cases = [{
  id: 'gemini-hallucination-checkers',
  revision: 1,
  title: 'The Gemini market report',
  context: 'Review assertions about free online hallucination checkers. The original Gemini prompt was unavailable.',
  reviewed: '2026-11-24',
  claims: [
    {
      id: 'textsight',
      type: 'Usage allowance',
      text: 'TextSight allows three free daily checks without signup.',
      verdict: 'Yes',
      scope: 'Public no-account allowance',
      reason: 'The vendor confirms three checks per day and limits each check to 30–200 words.',
      sources: [{
        title: 'TextSight detector documentation',
        url: 'https://www.textsight.ai/what-is-an-ai-hallucination-detector/',
        passage: 'Yes, with no account: three checks a day at up to 200 words each, minimum thirty words, resetting daily.',
        found: 'Yes',
        support: 'Supports'
      }]
    },
    {
      id: 'typeahead',
      type: 'Usage allowance',
      text: 'Typeahead has no daily limit.',
      verdict: 'No',
      scope: 'Public no-account checker',
      reason: 'The FAQ explicitly says the checker has a per-visitor daily limit.',
      action: 'Require current first-party evidence before publishing a quota claim.',
      sources: [{
        title: 'Typeahead checker FAQ',
        url: 'https://www.typeahead.ai/tools/hallucination-detector',
        passage: 'You can check up to 1,500 characters per run, and a per-visitor daily limit keeps the tool affordable for us to run.',
        found: 'Yes',
        support: 'Contradicts'
      }]
    },
    {
      id: 'getsolved',
      type: 'Plan availability',
      text: 'GetSolved offers free full-document scans.',
      verdict: 'Maybe',
      scope: 'Full document scan on the free offering',
      reason: 'The report lists the checker among free tools and mentions uploads. The vendor confirms supported formats and describes limited free access for some tools. Those pages leave the full-document free allowance unresolved.',
      action: 'Find plan terms that explicitly cover full-document hallucination checks or test a non-sensitive document under the free plan.',
      sources: [{
        title: 'GetSolved hallucination detector',
        url: 'https://getsolved.ai/hallucination-detector',
        passage: 'DOC, DOCX, TXT, PDF, ODT, RTF, HTM.',
        found: 'Yes',
        support: 'Partial · confirms file formats'
      }, {
        title: 'GetSolved pricing FAQ',
        url: 'https://getsolved.ai/faq',
        passage: 'Yes, you can try a limited version of some tools, like the AI Detector, for free and without signing up.',
        found: 'Yes',
        support: 'Partial · describes free access generally'
      }]
    }
  ]
}];
