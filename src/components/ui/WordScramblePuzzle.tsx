'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './WordScramblePuzzle.module.css';

const wordList = [
  // Very Easy (3-4 Letters)
  { scrambled: 'ODCE', correct: 'CODE' },
  { scrambled: 'ADAT', correct: 'DATA' },
  { scrambled: 'AJAV', correct: 'JAVA' },
  { scrambled: 'EWB', correct: 'WEB' },
  { scrambled: 'UGB', correct: 'BUG' },
  { scrambled: 'TEBY', correct: 'BYTE' },
  { scrambled: 'KINL', correct: 'LINK' },
  { scrambled: 'CETH', correct: 'TECH' },
  { scrambled: 'ODNE', correct: 'NODE' },

  // Easy (5 Letters)
  { scrambled: 'GOLIC', correct: 'LOGIC' },
  { scrambled: 'LCODU', correct: 'CLOUD' },
  { scrambled: 'XPELI', correct: 'PIXEL' },
  { scrambled: 'PNUTI', correct: 'INPUT' },
  { scrambled: 'MDOEL', correct: 'MODEL' },
  { scrambled: 'UEOSM', correct: 'MOUSE' },
  { scrambled: 'HCAEC', correct: 'CACHE' },

  // The "Boss" Level (Still recognizable)
  { scrambled: 'YPTNOH', correct: 'PYTHON' },
  { scrambled: 'SREVER', correct: 'SERVER' },
];

interface WordScramblePuzzleProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ---- Lightweight confetti burst ---- */
function launchConfetti(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#E50914', '#ff4d4d', '#ff8080', '#4dff88', '#ffcc00', '#E5E4E2'];
  const particles: {
    x: number; y: number; vx: number; vy: number;
    size: number; color: string; life: number; rotation: number; rv: number;
  }[] = [];

  for (let i = 0; i < 100; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -14 - 4,
      size: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      rotation: Math.random() * 360,
      rv: (Math.random() - 0.5) * 10,
    });
  }

  let frame = 0;
  const maxFrames = 90;

  function tick() {
    if (frame >= maxFrames) {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    ctx!.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;          // gravity
      p.life -= 1 / maxFrames;
      p.rotation += p.rv;

      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate((p.rotation * Math.PI) / 180);
      ctx!.globalAlpha = Math.max(0, p.life);
      ctx!.fillStyle = p.color;
      ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx!.restore();
    }

    frame++;
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

export default function WordScramblePuzzle({ isOpen, onClose }: WordScramblePuzzleProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [solved, setSolved] = useState(false);
  const [shaking, setShaking] = useState(false);
  const confettiRef = useRef<HTMLCanvasElement>(null);

  // Pick a new random word each time the popup opens
  useEffect(() => {
    if (isOpen) {
      setWordIndex(Math.floor(Math.random() * wordList.length));
      setUserInput('');
      setMessage('');
      setIsCorrect(false);
      setSolved(false);
      setShaking(false);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(() => {
    if (isCorrect) return;

    if (userInput.toUpperCase().trim() === wordList[wordIndex].correct) {
      setIsCorrect(true);
      setMessage('✅ Correct!');
      setTimeout(() => {
        setSolved(true);
        if (confettiRef.current) launchConfetti(confettiRef.current);
      }, 600);
    } else {
      setMessage('❌ Incorrect! Try again.');
      setUserInput('');
      // Trigger shake
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }, [userInput, wordIndex, isCorrect]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  if (!isOpen) return null;

  const { scrambled } = wordList[wordIndex];

  return (
    <>
      {/* Confetti canvas (always mounted when open) */}
      <canvas ref={confettiRef} className={styles.confettiCanvas} />

      <div className={styles.backdrop} onClick={onClose}>
        <div
          className={`${styles.card} ${shaking ? styles.shake : ''} ${solved ? styles.successGlow : ''}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>

          {!solved ? (
            <>
              <h3 className={styles.title}>WORD SCRAMBLE</h3>
              <p className={styles.subtitle}>
                Unscramble the letters to reveal a tech term.
              </p>

              {/* Letter Tiles */}
              <div className={styles.tilesContainer}>
                {scrambled.split('').map((letter, i) => (
                  <div className={styles.tile} key={i}>
                    {letter}
                  </div>
                ))}
              </div>

              {/* Input + Submit */}
              <div className={styles.inputContainer}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Type your answer..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  disabled={isCorrect}
                />
                <button
                  className={styles.submitBtn}
                  onClick={handleSubmit}
                  disabled={isCorrect}
                >
                  SUBMIT
                </button>
              </div>

              <p
                className={`${styles.message} ${
                  isCorrect ? styles.messageSuccess : styles.messageError
                }`}
              >
                {message}
              </p>
            </>
          ) : (
            <div className={styles.easterEggReveal}>
              <span className={styles.easterEggEmoji}>🥚</span>
              <div className={styles.easterEggText}>EASTER EGG</div>
              <p className={styles.easterEggHint}>
                You found the hidden secret — congrats!
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
