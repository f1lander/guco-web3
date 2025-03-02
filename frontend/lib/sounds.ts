import * as Tone from "tone";

// Initialize audio context on user interaction
export const initAudio = async () => {
  await Tone.start();
  console.log("Audio context started");
  
  // Start background music
  playBackgroundMusic();
};

// Sound Effects
const fxSynth = new Tone.Synth({
  oscillator: { type: "sine" },
  envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.1 }
}).toDestination();

const jumpSynth = new Tone.Synth({
  oscillator: { type: "triangle" },
  envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.1 }
}).toDestination();

const collectSynth = new Tone.PolySynth(Tone.Synth).toDestination();

const goalSynth = new Tone.PolySynth(Tone.Synth).toDestination();

// Robot power on sound
export const playRobotOnSound = () => {
  const now = Tone.now();
  fxSynth.volume.value = -10;
  fxSynth.triggerAttackRelease("C5", "16n", now);
  fxSynth.triggerAttackRelease("E5", "16n", now + 0.05);
  fxSynth.triggerAttackRelease("G5", "16n", now + 0.1);
};

// Robot movement sound
export const playMoveSound = () => {
  fxSynth.volume.value = -20;
  fxSynth.triggerAttackRelease("G4", "32n");
};

// Robot jump sound
export const playJumpSound = () => {
  jumpSynth.volume.value = -15;
  jumpSynth.triggerAttackRelease("C6", "8n");
  jumpSynth.frequency.rampTo("G6", 0.1);
};

// Collect item sound
export const playCollectSound = () => {
  collectSynth.volume.value = -10;
  collectSynth.triggerAttackRelease(["C6", "E6"], "16n");
};

// Goal reached sound
export const playGoalSound = () => {
  const now = Tone.now();
  goalSynth.volume.value = -5;
  goalSynth.triggerAttackRelease(["C5", "E5", "G5"], "8n", now);
  goalSynth.triggerAttackRelease(["D5", "F5", "A5"], "8n", now + 0.2);
  goalSynth.triggerAttackRelease(["E5", "G5", "B5"], "8n", now + 0.4);
  goalSynth.triggerAttackRelease(["C6", "E6", "G6"], "4n", now + 0.6);
};

// Background Music
let bgMusicPlaying = false;
const backgroundSynth = new Tone.PolySynth(Tone.Synth).toDestination();

export const playBackgroundMusic = () => {
  if (bgMusicPlaying) return;
  
  backgroundSynth.volume.value = -20;
  
  // Create a simple sequence for background music
  const melody = [
    { note: "C4", duration: "8n", time: 0 },
    { note: "E4", duration: "8n", time: "0:0:2" },
    { note: "G4", duration: "8n", time: "0:1:0" },
    { note: "E4", duration: "8n", time: "0:1:2" },
    { note: "C4", duration: "8n", time: "0:2:0" },
    { note: "D4", duration: "8n", time: "0:2:2" },
    { note: "F4", duration: "8n", time: "0:3:0" },
    { note: "D4", duration: "8n", time: "0:3:2" },
  ];
  
  // Create a sequence
  const sequence = new Tone.Sequence(
    (time, { note, duration }) => {
      backgroundSynth.triggerAttackRelease(note, duration, time);
    },
    melody.map(event => ({ ...event })),
    "8n"
  );
  
  // Set sequence to loop
  sequence.loop = true;
  
  // Start the sequence
  sequence.start(0);
  Tone.Transport.start();
  
  bgMusicPlaying = true;
};

export const stopBackgroundMusic = () => {
  if (!bgMusicPlaying) return;
  
  Tone.Transport.stop();
  Tone.Transport.cancel();
  bgMusicPlaying = false;
}; 