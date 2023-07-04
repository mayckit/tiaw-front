document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio do formulário

    // Obtenha os valores dos campos do formulário
    var location = document.getElementById('location').value;
    var rating = document.getElementById('rating').value;

    // Carregue o arquivo JSON das barbearias
    fetch('barbearias.json')
      .then(response => response.json())
      .then(data => {
        // Filtrar as barbearias com base na localização e classificação mínima
        var filteredBarbearias = data.filter(function(barbearia) {
          return barbearia.localizacao.toLowerCase().includes(location.toLowerCase()) &&
                 barbearia.classificacao >= rating;
        });

        // Limpar os resultados anteriores
        var resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = '';

        // Exibir os resultados da pesquisa
        if (filteredBarbearias.length > 0) {
          filteredBarbearias.forEach(function(barbearia) {
            var resultItem = document.createElement('div');
            resultItem.innerHTML = '<h3>' + barbearia.nome + '</h3>' +
                                   '<p>Localização: ' + barbearia.localizacao + '</p>' +
                                   '<p>Classificação: ' + barbearia.classificacao + '</p>';
            resultsContainer.appendChild(resultItem);
          });
        } else {
          resultsContainer.innerHTML = '<p>Nenhuma barbearia encontrada.</p>';
        }
      });
});
