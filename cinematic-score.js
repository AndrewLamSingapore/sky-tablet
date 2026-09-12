// The Sky Tablet — original generative cinematic score, desktop + iOS safe.
let ctx = null;
let master = null;
let active = [];
let finishTimer = null;

function report(state, message) {
  window.dispatchEvent(new CustomEvent('sky-tablet:audio-state', { detail: { state, message } }));
}

function clearNodes(list) {
  for (const node of list) {
    try { node.stop?.(); } catch {}
    try { node.disconnect?.(); } catch {}
  }
}

function stop(fade = 1, notify = true) {
  clearTimeout(finishTimer);
  finishTimer = null;
  if (!ctx || !master) {
    if (notify) report('ready', 'Cinematic score is ready to play.');
    return;
  }
  const oldMaster = master;
  const oldNodes = active;
  master = null;
  active = [];
  const time = ctx.currentTime;
  try {
    oldMaster.gain.cancelScheduledValues(time);
    oldMaster.gain.setValueAtTime(Math.max(oldMaster.gain.value, 0.0001), time);
    oldMaster.gain.exponentialRampToValueAtTime(0.0001, time + fade);
  } catch {}
  setTimeout(() => clearNodes(oldNodes), (fade + 0.12) * 1000);
  if (notify) report('ready', 'Cinematic score stopped. Select SOUND READY to replay it.');
}

function ensureContext() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!ctx) ctx = new AudioContextClass();
  return ctx;
}

function start() {
  const context = ensureContext();
  if (!context) {
    report('unavailable', 'Web Audio is unavailable in this browser.');
    return false;
  }

  const build = () => {
    if (context.state !== 'running') {
      report('blocked', 'The browser blocked sound. Select SOUND READY to try again.');
      return false;
    }
    if (master) stop(0.03, false);
    const now = context.currentTime;
    const output = context.createGain();
    const compressor = context.createDynamicsCompressor();
    const reverb = context.createConvolver();
    const local = [];
    master = output;
    active = local;
    output.gain.setValueAtTime(0.0001, now);
    output.gain.exponentialRampToValueAtTime(0.9, now + 0.22);
    output.gain.setValueAtTime(0.9, now + 48);
    output.gain.exponentialRampToValueAtTime(0.0001, now + 55);
    output.connect(compressor);
    compressor.connect(context.destination);
    compressor.threshold.value = -10;
    compressor.knee.value = 12;
    compressor.ratio.value = 2.2;
    compressor.attack.value = 0.01;
    compressor.release.value = 0.55;

    const impulse = context.createBuffer(2, context.sampleRate * 3, context.sampleRate);
    for (let channel = 0; channel < 2; channel += 1) {
      const samples = impulse.getChannelData(channel);
      for (let index = 0; index < samples.length; index += 1) {
        samples[index] = (Math.random() * 2 - 1) * Math.pow(1 - index / samples.length, 2.8);
      }
    }
    reverb.buffer = impulse;
    const wet = context.createGain();
    wet.gain.value = 0.18;
    reverb.connect(wet);
    wet.connect(compressor);
    local.push(reverb, wet, compressor, output);

    function tone(frequency, at, duration, gainValue = 0.1, type = 'sine', detune = 0) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      oscillator.detune.value = detune;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(gainValue, at + Math.min(0.65, duration * 0.14));
      gain.gain.setValueAtTime(gainValue, at + duration * 0.62);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
      oscillator.connect(gain);
      gain.connect(output);
      gain.connect(reverb);
      oscillator.start(at);
      oscillator.stop(at + duration + 0.05);
      local.push(oscillator, gain);
    }

    // Immediate speaker-friendly confirmation: no user waits for the score's first bell.
    [523.25, 659.25, 783.99].forEach((frequency, index) => {
      tone(frequency, now + 0.03 + index * 0.2, 0.34, 0.16);
    });

    [55, 73.42, 110, 146.83, 220, 293.66].forEach((frequency, index) => {
      const gains = [0.16, 0.14, 0.12, 0.1, 0.075, 0.05];
      tone(frequency, now + 0.01, 54, gains[index], index < 2 ? 'sine' : 'triangle', -3);
      tone(frequency, now + 0.01, 54, gains[index] * 0.65, index < 2 ? 'sine' : 'triangle', 3);
    });
    const chords = [
      [146.83, 174.61, 220], [130.81, 164.81, 220], [146.83, 185, 246.94],
      [110, 146.83, 220], [123.47, 164.81, 246.94], [146.83, 196, 293.66]
    ];
    [1, 9, 17, 26, 34, 42].forEach((start, chordIndex) => {
      chords[chordIndex].forEach((frequency, noteIndex) => {
        tone(frequency, now + start, 9, 0.075 - noteIndex * 0.01, 'sawtooth', (noteIndex - 1) * 3);
      });
    });

    function drum(at, amount) {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.frequency.setValueAtTime(165, at);
      oscillator.frequency.exponentialRampToValueAtTime(55, at + 0.3);
      gain.gain.setValueAtTime(amount, at);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.9);
      oscillator.connect(gain);
      gain.connect(output);
      gain.connect(reverb);
      oscillator.start(at);
      oscillator.stop(at + 0.95);
      local.push(oscillator, gain);
    }
    [2.5, 6, 10, 14, 18, 22, 25, 28, 30.5, 33, 35.3, 37.5, 39.5, 41.5, 43.3, 45, 46.8, 48.5, 50]
      .forEach((offset, index) => drum(now + offset, 0.28 + Math.min(index, 12) * 0.014));

    function bell(frequency, at, amount) {
      [1, 2.01, 3.97].forEach((ratio, index) => tone(frequency * ratio, at, 4.8, amount / (index + 1)));
    }
    [[329.63, 30], [392, 33], [493.88, 36], [659.25, 39], [783.99, 42], [987.77, 45]]
      .forEach(([frequency, offset], index) => bell(frequency, now + offset, 0.08 + index * 0.006));

    const noiseBuffer = context.createBuffer(1, context.sampleRate * 56, context.sampleRate);
    const noiseSamples = noiseBuffer.getChannelData(0);
    for (let index = 0; index < noiseSamples.length; index += 1) noiseSamples[index] = Math.random() * 2 - 1;
    const noise = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const noiseGain = context.createGain();
    noise.buffer = noiseBuffer;
    filter.type = 'bandpass';
    filter.frequency.value = 700;
    filter.Q.value = 0.35;
    noiseGain.gain.setValueAtTime(0.02, now);
    noiseGain.gain.linearRampToValueAtTime(0.06, now + 38);
    noiseGain.gain.linearRampToValueAtTime(0.012, now + 54);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(output);
    noiseGain.connect(reverb);
    noise.start(now);
    noise.stop(now + 55);
    local.push(noise, filter, noiseGain);

    report('playing', 'Cinematic score is playing.');
    finishTimer = setTimeout(() => {
      clearNodes(local);
      if (active === local) {
        active = [];
        master = null;
      }
      report('ready', 'Cinematic score finished. Select SOUND READY to replay it.');
    }, 55200);
    return true;
  };

  // resume() is initiated synchronously inside the user gesture for mobile browsers.
  if (context.state === 'running') return build();
  const resumed = context.resume();
  if (resumed && typeof resumed.then === 'function') {
    resumed.then(build).catch(() => report('blocked', 'The browser blocked sound. Select SOUND READY to try again.'));
    return true;
  }
  return build();
}

window.SkyTabletScore = { start, stop };
