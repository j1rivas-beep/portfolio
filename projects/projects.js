
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

document.querySelector('.projects-title').textContent =
    `Projects (${projects.length})`;

const projectsContainer = document.querySelector('.projects');

renderProjects(projects, projectsContainer, 'h2');
let selectedIndex = -1;
renderPieChart(projects);
let query = '';

let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
    query = event.target.value;

    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();

        return values.includes(query.toLowerCase());
    });

    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});

function renderPieChart(projectsGiven) {
    
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
    );

    
    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year };
    });

   
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);

    let newArcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(50);

    let newArcs = newArcData.map((d) => newArcGenerator(d));

    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    
    let newSVG = d3.select('#projects-plot');
    newSVG.selectAll('path').remove();

    let legend = d3.select('.legend');
    legend.selectAll('li').remove();

    
    newArcs.forEach((arc, i) => {
        newSVG.append('path')
            .attr('d', arc)
            .attr('fill', colors(i))
            .attr('class', i === selectedIndex ? 'selected' : '')
            .on('click', () => {
                selectedIndex = selectedIndex === i ? -1 : i;

                newSVG.selectAll('path')
                    .attr('class', (_, idx) => (
                        idx === selectedIndex ? 'selected' : ''
                    ));

                legend.selectAll('li')
                    .attr('class', (_, idx) => (
                        idx === selectedIndex ? 'legend-item selected' : 'legend-item'
                    ));

                // Filter the projects based on the selected wedge
                if (selectedIndex === -1) {
                    renderProjects(projectsGiven, projectsContainer, 'h2');
                } else {
                    let selectedYear = newData[selectedIndex].label;

                    let filteredProjects = projectsGiven.filter((project) =>
                        String(project.year) === String(selectedYear)
                    );

                    renderProjects(filteredProjects, projectsContainer, 'h2');
                }
            });
    });

    
    newData.forEach((d, idx) => {
        legend.append('li')
            .attr('style', `--color:${colors(idx)}`)
            .attr('class', 'legend-item')
            .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });
}