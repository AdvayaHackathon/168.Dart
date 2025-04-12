let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

function startQuiz() {
  const category = document.getElementById('category').value;
  fetch(`https://opentdb.com/api.php?amount=5&category=${category}&type=multiple`)
    .then(response => response.json())
    .then(data => {
      questions = data.results;
      currentQuestionIndex = 0;
      score = 0;
      document.querySelector('.selector').style.display = 'none';
      document.getElementById('question-box').classList.remove('hidden');
      loadQuestion();
    })
    .catch(error => {
      console.error("Error fetching quiz:", error);
    });
}

function loadQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  document.getElementById('timer').textContent = `⏳ ${timeLeft}`;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').textContent = `⏳ ${timeLeft}`;
    if (timeLeft === 0) {
      clearInterval(timer);
      showCorrectAnswer(null);
    }
  }, 1000);

  const questionData = questions[currentQuestionIndex];
  document.getElementById('question').innerHTML = decodeHTML(questionData.question);

  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';

  const options = [...questionData.incorrect_answers, questionData.correct_answer];
  shuffle(options);

  options.forEach(option => {
    const btn = document.createElement('button');
    btn.innerHTML = decodeHTML(option);
    btn.onclick = () => checkAnswer(btn, decodeHTML(questionData.correct_answer));
    optionsContainer.appendChild(btn);
  });

  document.getElementById('next-btn').style.display = 'none';
}

function checkAnswer(button, correctAnswer) {
  clearInterval(timer);
  const buttons = document.querySelectorAll('#options button');
  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correctAnswer) {
      btn.classList.add('correct');
    } else if (btn === button) {
      btn.classList.add('wrong');
    }
  });

  if (button.textContent === correctAnswer) {
    score++;
  }

  document.getElementById('next-btn').style.display = 'inline-block';
  currentQuestionIndex++;

  if (currentQuestionIndex >= questions.length) {
    document.getElementById('next-btn').onclick = showResults;
  } else {
    document.getElementById('next-btn').onclick = loadQuestion;
  }
}

function showResults() {
  document.getElementById('question-box').classList.add('hidden');
  document.getElementById('result-box').classList.remove('hidden');
  document.getElementById('score-text').textContent = `You scored ${score} out of ${questions.length}`;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function decodeHTML(html) {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function submitQuestion() {
  const questionText = document.getElementById('user-question').value.trim();
  if (!questionText) return;

  const questionBox = document.createElement('div');
  questionBox.classList.add('qa-item');

  const qTitle = document.createElement('p');
  qTitle.innerHTML = `<strong>Q:</strong> ${questionText}`;
  questionBox.appendChild(qTitle);

  // Answer input and button
  const answerInput = document.createElement('input');
  answerInput.type = "text";
  answerInput.placeholder = "Type your answer...";
  answerInput.classList.add('answer-input');

  const answerBtn = document.createElement('button');
  answerBtn.textContent = "Submit Answer";
  answerBtn.onclick = () => {
    const answer = answerInput.value.trim();
    if (answer) {
      const answerPara = document.createElement('p');
      answerPara.innerHTML = `<strong>A:</strong> ${answer}`;
      questionBox.appendChild(answerPara);
      answerInput.remove();
      answerBtn.remove();
    }
  };

  questionBox.appendChild(answerInput);
  questionBox.appendChild(answerBtn);

  document.getElementById('qa-display').prepend(questionBox);
  document.getElementById('user-question').value = '';
}