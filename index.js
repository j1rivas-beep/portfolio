
console.log("index.js is running!");


import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

// Fetch GitHub profile data
const githubData = await fetchGitHubData('j1rivas-beep');

console.log('GitHub data:', githubData);

// Select the profile stats container
const profileStats = document.querySelector('#profile-stats');

// Display GitHub stats
if (profileStats) {
    profileStats.innerHTML = `
        <dl>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
        </dl>
    `;
}

// Fetch project data
const projects = await fetchJSON('./lib/projects.json');

const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector('.projects');

renderProjects(latestProjects, projectsContainer, 'h2');
