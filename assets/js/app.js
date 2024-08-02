//Adicionar Event Listener ao Botão Iniciar
document.getElementById("start").addEventListener("click", function () {
  let interval = document.getElementById("interval").value;
  if (interval && interval > 0) {
    startReminder(interval);
    toggleButtons();
  } else {
    alert("Por favor, insira um intervalo válido.");
  }
});

//Pegando os events de Click
document.getElementById("stop").addEventListener("click", function () {
  stopReminder();
  toggleButtons();
});

let countdownTimeout;
let notificationTimeout;

//Função de Iniciar o Lembrete
function startReminder(minutes) {
  let intervalMillis = minutes * 60 * 1000;

  const countdownElement = document.createElement("div");
  countdownElement.id = "countdown";
  document.getElementById("status").appendChild(countdownElement);

  function updateCountdown() {
    let countdownMillis = intervalMillis;

    // Atualizar contagem regressiva a cada segundo
    function countdown() {
      const minutesLeft = Math.floor(countdownMillis / (60 * 1000));
      const secondsLeft = Math.floor((countdownMillis % (60 * 1000)) / 1000);

      countdownElement.textContent = `Tempo restante: ${minutesLeft}m ${secondsLeft}s`;

      if (countdownMillis <= 0) {
        showNotification();
        countdownMillis = intervalMillis; // Reiniciar contagem regressiva após a notificação
      }

      countdownMillis -= 1000;
      countdownTimeout = setTimeout(countdown, 1000);
    }

    countdown();
  }

  // Iniciar contagem regressiva inicial
  updateCountdown();
}

//Função de Parar o Lembrete
function stopReminder() {
  clearTimeout(countdownTimeout);
  clearTimeout(notificationTimeout);
  document.getElementById("status").innerHTML = "";
}

//Função Para mostrar a notificação
function showNotification() {
  if (Notification.permission === "granted") {
    new Notification("DRINK WATER", {
      body: "É hora de beber água!",
      icon: "../assets/files/icons/icon-water.png",
    });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("DRINK WATER", {
          body: "É hora de beber água!",
          icon: "../assets/files/icons/icon-water.png",
        });
      }
    });
  }
}

//Função Para mostrar e não mostrar o button
function toggleButtons() {
  const startButton = document.getElementById("start");
  const stopButton = document.getElementById("stop");
  if (startButton.style.display === "none") {
    startButton.style.display = "inline";
    stopButton.style.display = "none";
  } else {
    startButton.style.display = "none";
    stopButton.style.display = "inline";
  }
}

// Solicitar Permissão de carregar Página.
document.addEventListener("DOMContentLoaded", () => {
  if (
    Notification.permission !== "granted" &&
    Notification.permission !== "denied"
  ) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Permissão para notificações concedida.");
      }
    });
  }
});

// Verificar a visibilidade da página
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    console.log("Página em segundo plano");
    startReminder();
  } else {
    console.log("Página ativa");
    startReminder();
  }
});
