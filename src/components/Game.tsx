import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, RotateCcw, Trophy, Skull } from 'lucide-react';
import './Game.css';

type Choice = 'rock' | 'paper' | 'scissors';
type GameResult = 'win' | 'lose' | 'draw' | null;

const CHOICES: Choice[] = ['rock', 'paper', 'scissors'];

const HANDS = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️',
};

const COLORS = {
    rock: 'var(--secondary)',
    paper: 'var(--accent)',
    scissors: 'var(--primary)',
};

export default function Game() {
    const [userChoice, setUserChoice] = useState<Choice | null>(null);
    const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
    const [result, setResult] = useState<GameResult>(null);
    const [score, setScore] = useState({ wins: 0, losses: 0 });
    const [gameState, setGameState] = useState<'picking' | 'battling' | 'result'>('picking');

    const handleChoice = (choice: Choice) => {
        setUserChoice(choice);
        setGameState('battling');

        // Simulate computer thinking/battling time
        setTimeout(() => {
            const randomChoice = CHOICES[Math.floor(Math.random() * CHOICES.length)];
            setComputerChoice(randomChoice);
            determineWinner(choice, randomChoice);
            setGameState('result');
        }, 1500); // 1.5s battle animation
    };

    const determineWinner = (user: Choice, computer: Choice) => {
        if (user === computer) {
            setResult('draw');
        } else if (
            (user === 'rock' && computer === 'scissors') ||
            (user === 'paper' && computer === 'rock') ||
            (user === 'scissors' && computer === 'paper')
        ) {
            setResult('win');
            setScore(s => ({ ...s, wins: s.wins + 1 }));
        } else {
            setResult('lose');
            setScore(s => ({ ...s, losses: s.losses + 1 }));
        }
    };

    const resetGame = () => {
        setUserChoice(null);
        setComputerChoice(null);
        setResult(null);
        setGameState('picking');
    };

    return (
        <div className="game-container">
            <header className="game-header">
                <h1>Rock Paper Scissors</h1>
                <div className="score-board">
                    <div className="score-item">
                        <span className="label"><Trophy size={16} /> Wins</span>
                        <span className="value win">{score.wins}</span>
                    </div>
                    <div className="vs">vs</div>
                    <div className="score-item">
                        <span className="label"><Skull size={16} /> Losses</span>
                        <span className="value lose">{score.losses}</span>
                    </div>
                </div>
                <button className="reset-score-btn" onClick={() => setScore({ wins: 0, losses: 0 })}>
                    <RotateCcw size={18} /> Reset Score
                </button>
            </header>

            <main className="game-arena">
                <AnimatePresence mode="wait">
                    {gameState === 'picking' && (
                        <motion.div
                            key="picking"
                            className="picking-phase"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                        >
                            <div className="choices-grid">
                                {CHOICES.map((choice) => (
                                    <motion.button
                                        key={choice}
                                        className="choice-card"
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleChoice(choice)}
                                        style={{ '--card-color': COLORS[choice] } as React.CSSProperties}
                                    >
                                        <div className="icon">{HANDS[choice]}</div>
                                        <span className="name">{choice}</span>
                                    </motion.button>
                                ))}
                            </div>
                            <p className="instruction-text">Choose one option</p>
                        </motion.div>
                    )}

                    {gameState === 'battling' && (
                        <motion.div
                            key="battling"
                            className="battle-arena"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div className="battle-hand player-hand shaking">✊</div>
                            <div className="battle-text">Battling...</div>
                            <div className="battle-hand computer-hand shaking">✊</div>
                        </motion.div>
                    )}

                    {gameState === 'result' && userChoice && computerChoice && (
                        <motion.div
                            key="result"
                            className="result-arena"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className={`result-card ${result === 'win' ? 'winner' : ''}`}>
                                <div className="label">You Picked</div>
                                <div className="icon">{HANDS[userChoice]}</div>
                            </div>

                            <div className="result-info">
                                <motion.h2
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                >
                                    {result === 'win' ? 'You Win!' : result === 'lose' ? 'You Lose!' : 'Draw!'}
                                </motion.h2>
                                <button className="play-again-btn" onClick={resetGame}>
                                    <RefreshCw size={20} /> Play Again
                                </button>
                            </div>

                            <div className={`result-card ${result === 'lose' ? 'winner' : ''}`}>
                                <div className="label">Computer Picked</div>
                                <div className="icon">{HANDS[computerChoice]}</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
