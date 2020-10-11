// This class is not used in the project yet.
class Sound {
    constructor(root, soundSrc) {
      const audio = document.createElement('audio');
     
      audio.src = `${soundSrc}`;
      audio.setAttribute("preload", "auto");
      audio.setAttribute("controls", "none");
      audio.style.display = 'none';

      root.appendChild(audio);
      this.domElement = audio;

    }
  
    play() {
      this.domElement.play();
    }
   
  }
  