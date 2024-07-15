document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    if (query) {
        fetchResults(query);
    }
});

async function fetchResults(query) {
    const response = await fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${query}`);
    const data = await response.json();
    displayResults(data.results);
}

function displayResults(products) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';
    products.forEach(product => {
        const formattedPrice = formatPrice(product.price);
        const productCard = `
            <div class="col-md-3 d-flex align-items-stretch">
                <div class="card">
                    <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.title}</h5>
                        <p class="card-text">${formattedPrice}</p>
                        <a href="${product.permalink}" target="_blank" class="btn btn-ver-producto mt-auto">Ver producto</a>
                    </div>
                </div>
            </div>
        `;
        resultsDiv.insertAdjacentHTML('beforeend', productCard);
    });
}

function formatPrice(price) {
    return `$${price.toLocaleString('es-AR')}`;
}
