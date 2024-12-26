document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------
    // Sección de Funcionalidad de Búsqueda de Derechos
    // ------------------------------------------------------------
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    const suggestionTags = document.querySelectorAll('.tag');

    const data = {
        'cobertura': [
            {
                title: 'Cobertura de obras sociales y prepagas',
                description: 'Información sobre los alcances de la cobertura de obras sociales y prepagas.',
                legislation: 'Ley de Obras Sociales, Ley de Medicina Prepaga',
                jurisprudence: 'Fallo "Asociación Benghalensis c/ Ministerio de Salud y Acción Social s/amparo" de la Corte Suprema, Fallo "Camusso, María Cristina c/ Estado Nacional - Ministerio de Salud y Acción Social s/amparo".',
            },
            {
                title: 'Cobertura de internación domiciliaria',
                description: 'Información sobre la cobertura obligatoria de internación domiciliaria, según las últimas reformas.',
                legislation: 'Resolución 2280/2021 del Ministerio de Salud y Acción Social',
                jurisprudence: '"A.S.B. y otros c/ Obra Social del Poder Judicial de la Nación s/amparo", "P., L. A. c/ Obra Social del Poder Judicial de la Nación s/amparo".',
            },
        ],
        'medicamentos oncologicos': [
            {
                title: 'Medicamentos oncológicos de alto costo',
                description: 'Información sobre la cobertura de medicamentos oncológicos de alto costo.',
                legislation: 'Ley 26.751',
                jurisprudence: '"G., E. M. y otros c/ Estado Nacional s/amparo" y "P. M. F. c/ OSDE s/ amparo"',
            },
        ],
        'fertilización asistida': [
            {
                title: 'Cobertura de tratamiento de fertilización asistida',
                description: 'Información sobre la cobertura integral de los tratamientos de fertilización asistida',
                legislation: 'Ley 26.862',
                jurisprudence: '"R.V. y otro c/ Obra Social del Poder Judicial de la Nación" de la Corte Suprema',
            },
        ],
    };

    function performSearch(searchTerm) {
        searchResults.innerHTML = '';
        const term = searchTerm.toLowerCase().trim();

        if (!term) {
            showMessage('Ingresa un término de búsqueda.');
            return;
        }

        let foundResults = false;

        for (const key in data) {
            if (key.includes(term)) {
                data[key].forEach(result => {
                    const resultCard = createResultCard(result);
                    searchResults.appendChild(resultCard);
                    foundResults = true;
                });
            }
        }

        if (!foundResults) {
            showMessage('No se encontraron resultados.');
        }

        searchResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
        observeResults();
    }

     function createResultCard(result) {
        const card = document.createElement('div');
        card.className = 'result-card';
        card.innerHTML = `
            <h3>${result.title}</h3>
            <p>${result.description}</p>
            <div class="metadata">
                <p><strong>Legislación:</strong> ${result.legislation}</p>
                <p><strong>Jurisprudencia relevante:</strong> ${result.jurisprudence}</p>
            </div>
        `;
        return card;
    }

    function showMessage(message) {
        searchResults.innerHTML = `
            <div class="no-results">
                <p>${message}</p>
            </div>
        `;
    }

    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });

    suggestionTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const searchTerm = tag.getAttribute('data-search');
            searchInput.value = searchTerm;
            performSearch(searchTerm);
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });


     function observeResults() {
      document.querySelectorAll('.result-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(card);
        });
     }
    
});