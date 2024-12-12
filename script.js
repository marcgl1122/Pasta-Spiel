const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "pasta-sprite.png";

// Allgemeine Einstellungen
let gamePlaying = false;
const gravity = 0.5;
const speed = 6.2;
const size = [51, 36];
const jump = -11.5;
const cTenth = (canvas.width / 10);

let index = 0,
    bestScore = 0,
    flight,
    flyHeight,
    currentScore,
    pipes = [];

// Rohr-Einstellungen
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

const setup = () => {
  currentScore = 0;
  flight = jump;

  // Setze die Anfangsposition des Vogels
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  // Erstelle die ersten drei Rohre
  pipes = Array(3).fill().map((_, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

const render = () => {
  index++;

  // Hintergrund zeichnen (zwei Teile für endlose Schleife)
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width), 0, canvas.width, canvas.height);

  if (gamePlaying) {
    // Rohre bewegen und zeichnen
    pipes.forEach(pipe => {
      pipe[0] -= speed;

      // Obere Rohre
      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      // Untere Rohre
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      // Punktestand aktualisieren und neue Rohre hinzufügen
      if (pipe[0] <= -pipeWidth) {
        currentScore++;
        bestScore = Math.max(bestScore, currentScore);

        // Neues Rohr hinzufügen
        pipes = [...pipes.slice(1), [pipes[pipes.length - 1][0] + pipeGap + pipeWidth, pipeLoc()]];
      }

      // Kollisionserkennung
      if (
        pipe[0] <= cTenth + size[0] &&
        pipe[0] + pipeWidth >= cTenth &&
        (pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1])
      ) {
        gamePlaying = false;
        setup();
      }
    });

    // Vogel zeichnen
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1],
      ...size, cTenth, flyHeight, ...size);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    // Startbildschirm
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1],
      ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
    flyHeight = (canvas.height / 2) - (size[1] / 2);
    ctx.fillText(`Best score : ${bestScore}`, 85, 245);
    ctx.fillText('Klick, für Unterhaltig', 15, 535);
    ctx.font = "bold 30px Courier";
  }

  document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;

  // Nächsten Frame anfordern
  window.requestAnimationFrame(render);
}

// Spiel initialisieren
setup();
img.onload = render;

// Ereignisse hinzufügen
document.addEventListener('click', () => gamePlaying = true);
window.onclick = () => flight = jump;
