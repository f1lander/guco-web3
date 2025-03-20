import * as Tone from "tone";

// Initialize audio context on user interaction
export const initAudio = async () => {
  if (typeof window === 'undefined') return;
  
  try {
    await Tone.start();
    console.log("Audio context started");
    
    // Start background music
    playBackgroundMusic();
  } catch (error) {
    console.error("Failed to initialize audio:", error);
  }
};

// Sound Effects
let fxSynth: Tone.Synth | null = null;
let jumpSynth: Tone.Synth | null = null;
let collectSynth: Tone.PolySynth | null = null;
let goalSynth: Tone.PolySynth | null = null;
let errorSynth: Tone.PolySynth | null = null;
let backgroundSynth: Tone.PolySynth | null = null;

// Initialize synths only on client side
const initSynths = () => {
  if (typeof window === 'undefined') return;
  
  fxSynth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.01, decay: 0.1, sustain: 0.1, release: 0.1 }
  }).toDestination();

  jumpSynth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.3, sustain: 0.1, release: 0.1 }
  }).toDestination();

  collectSynth = new Tone.PolySynth(Tone.Synth).toDestination();
  goalSynth = new Tone.PolySynth(Tone.Synth).toDestination();
  
  errorSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.2 }
  }).toDestination();
  
  backgroundSynth = new Tone.PolySynth(Tone.Synth).toDestination();
};

// Robot power on sound
export const playRobotOnSound = () => {
  if (typeof window === 'undefined' || !fxSynth) return;
  
  const now = Tone.now();
  fxSynth.volume.value = -10;
  fxSynth.triggerAttackRelease("C5", "16n", now);
  fxSynth.triggerAttackRelease("E5", "16n", now + 0.05);
  fxSynth.triggerAttackRelease("G5", "16n", now + 0.1);
};

// Robot movement sound
export const playMoveSound = () => {
  if (typeof window === 'undefined' || !fxSynth) return;
  
  fxSynth.volume.value = -20;
  fxSynth.triggerAttackRelease("G4", "32n");
};

// Robot jump sound
export const playJumpSound = () => {
  if (typeof window === 'undefined' || !jumpSynth) return;
  
  jumpSynth.volume.value = -15;
  jumpSynth.triggerAttackRelease("C6", "8n");
  jumpSynth.frequency.rampTo("G6", 0.1);
};

// Collect item sound
export const playCollectSound = () => {
  if (typeof window === 'undefined' || !collectSynth) return;
  
  collectSynth.volume.value = -10;
  collectSynth.triggerAttackRelease(["C6", "E6"], "16n");
};

// Goal reached sound
export const playGoalSound = () => {
  if (typeof window === 'undefined' || !goalSynth) return;
  
  const now = Tone.now();
  goalSynth.volume.value = -5;
  goalSynth.triggerAttackRelease(["C5", "E5", "G5"], "8n", now);
  goalSynth.triggerAttackRelease(["D5", "F5", "A5"], "8n", now + 0.2);
  goalSynth.triggerAttackRelease(["E5", "G5", "B5"], "8n", now + 0.4);
  goalSynth.triggerAttackRelease(["C6", "E6", "G6"], "4n", now + 0.6);
};

// Robot error/crash sound
export const playErrorSound = () => {
  if (typeof window === 'undefined' || !errorSynth) return;
  
  const now = Tone.now();
  errorSynth.volume.value = -8;
  
  // Play dissonant notes for error effect
  errorSynth.triggerAttackRelease("C4", "16n", now);
  errorSynth.triggerAttackRelease("C#4", "16n", now + 0.05);
  errorSynth.triggerAttackRelease("B3", "8n", now + 0.1);
  
  // Add distortion effect for crash feeling
  const distortion = new Tone.Distortion(0.8).toDestination();
  const noiseSynth = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 }
  }).connect(distortion);
  
  noiseSynth.volume.value = -15;
  noiseSynth.triggerAttackRelease("16n", now + 0.1);
};

// Background Music
let bgMusicPlaying = false;

export const playBackgroundMusic = () => {
  if (typeof window === 'undefined' || !backgroundSynth || bgMusicPlaying) return;
  
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
      backgroundSynth?.triggerAttackRelease(note, duration, time);
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
  if (typeof window === 'undefined' || !bgMusicPlaying) return;
  
  Tone.Transport.stop();
  Tone.Transport.cancel();
  bgMusicPlaying = false;
};

// Initialize synths when the module is loaded
if (typeof window !== 'undefined') {
  initSynths();
} 