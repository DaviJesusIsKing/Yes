(function() {
  const multiplicadorDeVolume = 3.0; // 3.0 = 300% do volume original (ajuste se precisar)
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Guarda a função original de play() do navegador
  const playOriginal = HTMLMediaElement.prototype.play;

  // Intercepta toda vez que o Dropdesk tentar tocar um som
  HTMLMediaElement.prototype.play = function() {
    if (!this._amplificado) {
      try {
        this.crossOrigin = "anonymous";
        const source = audioCtx.createMediaElementSource(this);
        const gainNode = audioCtx.createGain();
        
        gainNode.gain.value = multiplicadorDeVolume;
        
        source.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        this._amplificado = true;
      } catch (erro) {
        // Caso o servidor bloqueie a amplificação, garante ao menos o volume máximo padrão
        this.volume = 1.0;
      }
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    return playOriginal.apply(this, arguments);
  };

  console.log("Amplificador de notificações ativado!");
})();
