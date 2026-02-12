
import React, { useState, useEffect, useRef } from 'react';
import styles from './EasterEgg.module.css';

interface EasterEggProps {
  onClose: () => void;
}

type HistoryItem = {
  guess: string[];
  feedback: ('correct' | 'present' | 'incorrect')[];
};

const EasterEgg: React.FC<EasterEggProps> = ({ onClose }) => {
  const [secret, setSecret] = useState<number[]>([]);
  const [guess, setGuess] = useState<string[]>(Array(4).fill(''));
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isWon, setIsWon] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [uniqueId, setUniqueId] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    generateSecret();
    inputRefs.current[0]?.focus();
  }, []);

  const getOrGenerateId = () => {
    let storedId = localStorage.getItem('creditEasterEggId');
    if (!storedId) {
      storedId = `CREDIT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      localStorage.setItem('creditEasterEggId', storedId);
    }
    return storedId;
  };

  const generateSecret = () => {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const newSecret: number[] = [];
    for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        newSecret.push(digits.splice(randomIndex, 1)[0]);
    }
    setSecret(newSecret);
  };

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newGuess = [...guess];
    newGuess[index] = value;
    setGuess(newGuess);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !guess[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    if (guess.some(digit => digit === '') || isWon || isLost) return;

    const guessAsNumbers = guess.map(Number);
    const feedback: ('correct' | 'present' | 'incorrect')[] = Array(4).fill('incorrect');
    const secretCopy = [...secret];

    // First pass: check for correct digits in correct positions (green)
    for (let i = 0; i < 4; i++) {
        if (guessAsNumbers[i] === secretCopy[i]) {
            feedback[i] = 'correct';
            secretCopy[i] = -1; // Mark as used for the next pass
        }
    }

    // Second pass: check for correct digits in wrong positions (yellow)
    for (let i = 0; i < 4; i++) {
        if (feedback[i] !== 'correct') { // Only check digits that are not already in the correct position
            const digitIndex = secretCopy.indexOf(guessAsNumbers[i]);
            if (digitIndex !== -1) {
                feedback[i] = 'present';
                secretCopy[digitIndex] = -1; // Mark as used to prevent matching the same secret digit twice
            }
        }
    }

    const newHistoryItem: HistoryItem = { guess, feedback };
    setHistory([newHistoryItem, ...history]);

    if (feedback.every(f => f === 'correct')) {
      setIsWon(true);
      const id = getOrGenerateId();
      setUniqueId(id);
    } else if (history.length + 1 >= 10) {
      setIsLost(true);
    }

    setGuess(Array(4).fill(''));
    inputRefs.current[0]?.focus();
  };
  
  const handleReset = () => {
      setGuess(Array(4).fill(''));
      setHistory([]);
      setIsWon(false);
      setIsLost(false);
      setUniqueId('');
      generateSecret();
      inputRefs.current[0]?.focus();
  }

  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if(isWon || isLost) {
            handleReset();
        } else {
            handleSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleEnter);
    return () => window.removeEventListener('keydown', handleEnter);
  }, [guess, history, isWon, isLost]);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.terminal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <h2 className={styles.title}>ACCESS TERMINAL</h2>

        {isWon && <div className={`${styles.message} ${styles.win}`}>ACCESS GRANTED<br/>Unique ID: {uniqueId}</div>}
        {isLost && <div className={`${styles.message} ${styles.lose}`}>{`LOCKDOWN INITIATED. CODE WAS: ${secret.join('')}`}</div>}

        <div className={styles.inputContainer}>
          {guess.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              className={styles.input}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={isWon || isLost}
              autoComplete="off"
            />
          ))}
        </div>
        
        <div className={styles.history}>
            {history.map((item, index) => (
                <div key={index} className={styles.historyRow}>
                    <span className={styles.historyGuess}>{item.guess.join(' ')}</span>
                    <div className={styles.historyFeedback}>
                        {item.feedback.map((fb, i) => (
                             <div key={i} className={`${styles.feedbackDot} ${styles[fb]}`}></div>
                        ))}
                    </div>
                </div>
            ))}
        </div>

        { (isWon || isLost) ? (
            <button className={styles.button} onClick={handleReset}>Play Again</button>
        ) : (
            <button className={styles.button} onClick={handleSubmit}>Execute</button>
        )
        }
      </div>
    </div>
  );
};

export default EasterEgg;
