# Croizier.AI V1.6

A self-contained static GitHub Pages site for the Save Our AI Society. Open
index.html locally to preview the portfolio. The submission page requires a Formspree form ID to accept submissions. The Gemini case includes an annotated excerpt,
filters, source passages, Yes / No / Maybe decisions, and a Society voting mode.

## V1.6 release

- Media & Stories includes the original First Visit walkthrough, campaign teaser,
  bottle poster, score, and continuation architecture drawing.
- Continue an Investigation uses prepared fictional evidence. Process the
  sample, choose a follow-up, and use Copy link or Show QR. Opening that URL
  on another device reopens the selected step.
- The demo is public and stateless. Private user accounts, model processing,
  stored conversations and delivery automation are future backend work.
- Campaign copy, narrative and rollout are in campaign-notes.md.

Preserve the currently deployed revision before uploading. For an existing
site, use its configured publication branch and folder. For a new Pages site,
see the instructions below. Include the assets and vendor folders and keep
the .nojekyll file. Use the generated Pages URL before changing DNS. Visit
the homepage, Media & Stories, Claim Review Lab and Backlog, and test both
videos plus a cross-device QR scan from the deployed address. If the live
release fails, redeploy the previous working revision.

## Publish to GitHub Pages

1. Unzip the package. Upload its **contents** to the root of your GitHub
   repository so index.html is at the root. Use a new repository to stage the
   release if the current domain already serves a site and you want an independent preview. For GitHub Free, use a
   public repository containing only public material.
2. In the repository, open **Settings → Pages**. Set **Source** to **Deploy
   from a branch**, choose **main** and **/(root)**, and save.
3. Open the GitHub Pages URL shown on that screen. Check the claim filters,
   source links, Society voting, and the Architecture page.

## Connect croizier.ai through Porkbun

1. Verify domain ownership in your GitHub account or organization Pages
   settings using the TXT record GitHub provides.
2. Set **Settings → Pages → Custom domain** to **croizier.ai** on the
   repository. GitHub creates the CNAME file for a branch deployment.
3. If Porkbun hosts the authoritative DNS, open **Domain Management → DNS**
   for croizier.ai. Save a copy of the existing web records before cutover.
   Set the apex using GitHub’s current A records shown below, and add the www
   CNAME if you want that address to work too. If a different provider hosts
   authoritative DNS, make the same edits there.
4. Replace conflicting web records for the apex and www when you are ready
   to switch traffic. Keep existing MX, mail-related TXT records, and any
   ownership-verification records. After GitHub passes the DNS check, enable
   **Enforce HTTPS** when available. Test the apex and www over HTTPS.

| Type | Host in Porkbun | Answer |
| --- | --- | --- |
| A | Blank (apex) | 185.199.108.153 |
| A | Blank (apex) | 185.199.109.153 |
| A | Blank (apex) | 185.199.110.153 |
| A | Blank (apex) | 185.199.111.153 |
| CNAME | www | YOUR-GITHUB-OWNER.github.io |

Use the GitHub user or organization that owns the repository in the www
target. Omit the protocol and repository path.

- [GitHub custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
- [Porkbun GitHub Pages instructions](https://kb.porkbun.com/article/64-how-to-connect-your-domain-to-github-pages)

## Enable private submissions

1. Create a form in [Formspree](https://formspree.io/) and set its notification
   recipient to your private review inbox. Complete any recipient verification
   shown by Formspree.
2. Copy the ID from the form endpoint (the final part of
   `https://formspree.io/f/YOUR_FORM_ID`) into `submissionFormId` in
   `submission-config.js`. Commit that file. The public form ID is enough.
3. After GitHub Pages publishes the change, open **Submit a Claim** and submit a
   harmless test case. Confirm the provider's success screen, the submission
   record, and the notification in your inbox. With the ID blank, visitors see
   an unavailable message and cannot enter or submit data.

## Review and publish

Review each submission in the private inbox. Confirm the exact claim, check
primary sources, and decide Yes, No, or Maybe. For Maybe, record the next
check. Publish an excerpt only when permission was provided and the excerpt
is de-identified. Leave the raw intake and private correspondence out of GitHub.

Copy the structure of the Gemini case in `cases.js` into a new entry in the
`cases` array. Give the case and its claims unique IDs, set the review date,
and enter the verdict, rationale, and checked source excerpts. Test Review and
Society modes locally, then commit the edited file. Check the published case
selector and evidence after GitHub Pages redeploys.

## Edit the case

Edit cases.js to update the launch case. Keep claim IDs unique, update the case
revision and review date when evidence changes, and record a next check for
every Maybe. The Truth Register offers a case selector as soon as the dataset includes a second case. The report excerpt
is condensed and the source links point to vendor pages that can change.

Review mode opens with all three verdicts accounted for. Society mode reveals
each verdict after a visitor votes. Test the Typeahead No and GetSolved Maybe
when updating the case. Refreshing the page resets votes.

## V1.4 portfolio map

- `index.html` is the portfolio homepage.
- `orchestration.html` describes the engine blueprint.
- `it-service-delivery.html` describes service intake through closure.
- `incident-response.html` describes planned defensive response.
- `forensic-investigations.html` describes defensive evidence review.
- `thread-1.html` describes single-thread summaries.
- `thread-2.html` describes periodic summaries and scoped handoffs.
- `lab.html` is the interactive Claim Review Lab and Truth Register.
- `architecture.html` describes the Claim Review Lab methodology.
- `submit.html` offers private submissions after setup.

The project pages describe design concepts and use fictional examples.
Before adapting an example for publication, confirm you own or have permission
to publish the material. Keep client documents, identifiers, and operational
records out of the repository and package.

### Updating an existing installation

Keep the repository's existing Pages source and custom-domain CNAME.
Keep the configured `submission-config.js` or copy its existing public
Formspree ID into this release's file before uploading it. If people have
bookmarked `croizier.ai/#lab`, the homepage automatically forwards that
specific fragment to the moved lab page.

## Message in a bottle

The lab's sample bottle opens Society mode. The public form still routes to
the private Formspree inbox once configured. Mercury describes the review
handoff. Review and publication are handled by a person.

Review Cards are available next to a revealed finding. A copied claim link
includes the case and claim IDs. Keep those IDs stable when revising evidence.
Share links from the deployed site so recipients can open them. The PNG
includes the reviewed date and evidence URL. Sharing is initiated by visitors.

## V1.5 showcase and public backlog

The homepage and two related project pages link to the AI IT Director
walkthrough. The Backlog is available in the main navigation.

To publish a backlog item, edit backlog-data.js, assign a unique stable ID,
write a public summary, and specify how people can contribute. The starter
items are ideas. Set open to false to keep an item visible while closing its
interest form option. Keep private projects and client material out of this
public list.

The Backlog form uses the same private Formspree endpoint configured in
submission-config.js. Its request_type is backlog_collaboration, and the
project field contains the selected backlog ID. To test after deployment,
choose a project, send a harmless interest note, and confirm that the
notification includes the project ID. With no endpoint configured, the
backlog remains readable and the interest form is unavailable.
