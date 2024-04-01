let listaExercicios = JSON.parse(localStorage.getItem('listaExercicios') || '[]');
let exercicioAtual = parseInt(localStorage.getItem('exercicioAtual') || '0', 10);
let exerciciosRealizados = JSON.parse(localStorage.getItem('exerciciosRealizados') || '[]');
let isTimerRunning = false;
let countdown;
let tempoRestante = 1500;
let alongamentosConcluidos = 0;
let pauseCountdown;


function getExercises() {
 fetch("https://api.api-ninjas.com/v1/exercises?type=stretching", {
     method: 'GET',
     headers: {
         'X-Api-Key': 'insira sua chave aqui',
         'Content-Type': 'application/json'
     }
 })
 .then(response => response.json())
 .then(dados => {
     listaExercicios = dados;
 })
 .catch(error => console.error('Erro ao buscar exercício:', error));
}


function startPauseTimer(duration = 300) {
   if (pauseCountdown) {
       clearInterval(pauseCountdown);
   }
   let tempoRestantePausa = duration;
   document.getElementById('pause-timer-display').style.display = "block";
   pauseCountdown = setInterval(() => {
       let minutos = Math.floor(tempoRestantePausa / 60);
       let segundos = tempoRestantePausa % 60;
       document.getElementById('pause-timer-display').textContent = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;


       if (tempoRestantePausa <= 0) {
           clearInterval(pauseCountdown);
           document.getElementById('pause-timer-display').style.display = "none";
       } else {
           tempoRestantePausa--;
       }
   }, 1000);
}




function exibirExercicio() {
  if (listaExercicios.length > 0) {
     
      let exercicio = listaExercicios[exercicioAtual % listaExercicios.length];


      const nameExercicio = document.getElementById('name-exercicio');
      const dificuldadeExercicio = document.getElementById('dificuldade-exercicio');
      const descricaoExercicio = document.getElementById('descricao-exercicio');


      nameExercicio.innerText = exercicio.name;
      dificuldadeExercicio.innerText = exercicio.difficulty;
      descricaoExercicio.innerText = exercicio.instructions;


      exercicioAtual++;
      exerciciosRealizados.push(exercicioAtual);
      alongamentosConcluidos++;
    
      localStorage.setItem('exercicioAtual', exercicioAtual.toString());
      localStorage.setItem('exerciciosRealizados', JSON.stringify(exerciciosRealizados));
      localStorage.setItem('alongamentosConcluidos', alongamentosConcluidos.toString());




      document.getElementById('exercise-display').style.display = "block";
      document.getElementById('pause-timer-display').textContent = "5:00";
      document.getElementById('pause-timer-display').style.display = "block";


      if (alongamentosConcluidos >= 9) {
          getExercises(true);
          alongamentosConcluidos = 0;
      }
  }
  startPauseTimer(300);
}


function startPomodoro(duration = 1500) {
 if (!isTimerRunning) {
     if (tempoRestante === null) {
         tempoRestante = duration;
     }
     isTimerRunning = true;
     document.getElementById('start-stop-timer').textContent = "Parar";
     updateTimer();
 } else {
     clearInterval(countdown);
     isTimerRunning = false;
     document.getElementById('start-stop-timer').textContent = "Iniciar Foco";
 }
}


function updateTimer() {
 countdown = setInterval(() => {
     const minutos = Math.floor(tempoRestante / 60);
     const segundos = tempoRestante % 60;
     document.getElementById('timer-display').textContent = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
  
     if (tempoRestante <= 0) {
         clearInterval(countdown);
         isTimerRunning = false;
         document.getElementById('start-stop-timer').textContent = "Iniciar Foco";
         tempoRestante = null;
         exibirExercicio();
     } else {
         tempoRestante--;
     }
 }, 1000);
}


document.getElementById('exercise-done').addEventListener('click', () => {
   document.getElementById('exercise-display').style.display = "none";
   clearInterval(countdown);
   tempoRestante = 1500;
   document.getElementById('timer-display').textContent = "25:00";
   document.getElementById('start-stop-timer').textContent = "Iniciar Foco";
   isTimerRunning = false;
 });
getExercises();


document.getElementById('start-stop-timer').addEventListener('click', () => startPomodoro(1500));


window.onload = () => {
  getExercises();
  exercicioAtual = parseInt(localStorage.getItem('exercicioAtual') || '0', 10);
  exerciciosRealizados = JSON.parse(localStorage.getItem('exerciciosRealizados') || '[]');
  alongamentosConcluidos = parseInt(localStorage.getItem('alongamentosConcluidos') || '0', 10);
};
