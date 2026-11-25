'use strict';

const backlogList = document.getElementById('backlog-list');
const projectSelect = document.getElementById('backlog-project');
projectSelect.add(new Option('Choose a project', ''));
for (const project of backlogProjects) {
  const card = document.createElement('article');
  card.className = 'panel project';
  const status = document.createElement('p');
  status.className = 'eyebrow';
  status.textContent = project.status;
  const title = document.createElement('h3');
  title.textContent = project.title;
  const summary = document.createElement('p');
  summary.textContent = project.summary;
  const help = document.createElement('p');
  help.textContent = project.open ? 'Ways to help: ' + project.collaboration : 'Collaboration closed.';
  card.append(status, title, summary, help);
  if (project.open) {
    projectSelect.add(new Option(project.title, project.id));
    const interest = document.createElement('a');
    interest.href = '#collaborate';
    interest.textContent = 'Express interest';
    interest.addEventListener('click', () => {
      projectSelect.value = project.id;
    });
    card.append(interest);
  }
  backlogList.append(card);
}
if (!backlogProjects.some((project) => project.open)) {
  document.getElementById('collaborate').hidden = true;
}
