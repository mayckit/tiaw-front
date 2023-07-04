let selectedRating = 0;

function rate(rating) {
  selectedRating = rating;
  highlightStars(rating);
}

function highlightStars(rating) {
  const stars = document.getElementsByClassName("star");
  for (let i = 0; i < stars.length; i++) {
    if (i < rating) {
      stars[i].style.color = "gold";
    } else {
      stars[i].style.color = "gray";
    }
  }
}

function submitRating() {
  if (selectedRating > 0) {
    const review = {
      rating: selectedRating,
      timestamp: new Date().toISOString()
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/save-review", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        alert("Obrigado por avaliar nossa barbearia!");
      } else {
        alert("Erro ao enviar a avaliação. Tente novamente mais tarde.");
      }
    };
    xhr.send(JSON.stringify(review));
  } else {
    alert("Por favor, selecione uma avaliação antes de enviar.");
  }
}
const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());

app.post('/save-review', (req, res) => {
  const review = req.body;

  // Carrega as avaliações existentes do arquivo reviews.json
  const reviews = loadReviews();

  // Adiciona a nova avaliação ao array de reviews
  reviews.push(review);

  // Salva as avaliações atualizadas no arquivo reviews.json
  saveReviews(reviews);

  res.sendStatus(200);
});

// Função para carregar as avaliações do arquivo reviews.json
function loadReviews() {
  try {
    const data = fs.readFileSync('reviews.json');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao carregar as avaliações:', error);
    return [];
  }
}

// Função para salvar as avaliações no arquivo reviews.json
function saveReviews(reviews) {
  try {
    fs.writeFileSync('reviews.json', JSON.stringify(reviews, null, 2));
    console.log('Avaliação salva com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar a avaliação:', error);
  }
}

app.listen(3000, () => {
  console.log('Servidor em execução na porta 3000');
});
