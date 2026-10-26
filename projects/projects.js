
import { fetchJSON, renderProjects } from '../global.js';


const projects = await fetchJSON('../lib/projects.json');


document.querySelector('.projects-title').textContent =
    `Projects (${projects.length})`;

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');

