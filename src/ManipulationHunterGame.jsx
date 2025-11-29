// src/ManipulationHunterGame.jsx
import React, { useState, useEffect } from 'react';
import {
  Shield,
  Brain,
  Clock,
  Target,
  Award,
  BookOpen,
  Play,
  ChevronRight,
  CheckCircle,
  XCircle,
  Zap
} from 'lucide-react';

const MANIPULATION_TACTICS = {
  manipulative: [
    { id: 'sycophancy', name: 'Sycophancy', description: 'When an AI says what it thinks the user wants to hear instead of what is true.' },
    { id: 'urgency or loss', name: 'Urgency or Loss', description: 'When an AI pressures the user to act quickly by creating a false sense of limited time, scarcity, or potential loss.' },
    { id: 'social_pressure', name: 'Social Pressure', description: 'When an AI uses peer behavior, popularity claims, or FOMO to influence the user into making a choice.' },
    { id: 'trick_statements', name: 'Trick Statements', description: 'When an AI uses intentionally confusing, ambiguous, or misleading wording that nudges the user toward a decision without them realizing it.' },
    { id: 'dark_nudge', name: 'Dark Nudge', description: 'When an AI subtly steers the user toward choices that benefit the system or company, not the user, often without explicit manipulation.' },
    { id: 'confirmshaming', name: 'Confirmshaming', description: 'When an AI tries to influence a choice by making the user feel guilty, irresponsible, or embarrassed for declining an option.' },
      ],
  neutral: [
    { id: 'personalization', name: 'Personalization', description: 'When an AI tailors responses or recommendations based on genuine user preferences or history, without hiding motives or pushing unwanted choices.' },
    { id: 'authority', name: 'Authority Appeal', description: 'When an AI references credible sources, expertise, or factual data to support an answer in a truthful and transparent way.' },
    { id: 'fair_upsell', name: 'Fair Upsell', description: 'When an AI suggests premium features clearly and honestly, explaining benefits without pressure, guilt, or hidden conditions.' },
    { id: 'information', name: 'Legitimate Information', description: 'When an AI provides accurate, helpful, and relevant facts to support informed decision-making, without manipulation.' }
  ]
};

const SCENARIOS = {
  beginner: [
    {
      context: 'E-commerce Chatbot',
      message: 'Only 2 items left in stock! 15 people are viewing this right now. Order in the next 10 minutes to guarantee delivery!',
      correctAnswer: 'urgency or loss',
      explanation: 'This combines social pressure (other viewers), and urgency (time limit) to rush your decision.',
      aiType: 'chatbot'
    },
    {
      context: 'Streaming Recommendation',
      message: "Based on your viewing history, we think you'll love this documentary about renewable energy. It has an 8.5/10 rating from verified viewers.",
      correctAnswer: 'personalization',
      explanation: 'This is legitimate personalization using your preferences and providing transparent ratings.',
      aiType: 'recommendation'
    },
    {
      context: 'Smart Assistant',
      message: 'Your trial ends today. Upgrade now or lose access to all your saved data forever!',
      correctAnswer: 'urgency or loss',
      explanation: 'Creates unnecessary panic about data loss to pressure immediate payment.',
      aiType: 'assistant'
    },
    {
      context: 'Shopping App',
      message: "Continue without premium benefits? (You'll miss out on exclusive deals)",
      correctAnswer: 'confirmshaming',
      explanation: 'Makes you feel bad about declining by emphasizing what you\'re "missing out" on.',
      aiType: 'chatbot'
    }
  ],
  intermediate: [
    {
      context: 'Health App Assistant',
      message: 'Dr. Sarah Chen recommends this supplement routine. Our AI analyzed 50,000 medical studies to create your personalized plan. Start your free trial today—most users see results in 2 weeks.',
      correctAnswer: 'authority',
      explanation: 'Uses authority appeal (doctor name, research claims) legitimately, though the "free trial" could be a nudge toward subscription.',
      aiType: 'assistant'
    },
    {
      context: 'News Recommendation Feed',
      message: "87% of people like you upgraded after reading this. Don't be the only one missing out on premium insights!",
      correctAnswer: 'social_pressure',
      explanation: 'Uses social proof and FOMO to manipulate through peer comparison.',
      aiType: 'recommendation'
    },
    {
      context: 'Shopping Assistant AI',
      message: 'Absolutely! You have such great taste — this deluxe skincare kit is *perfect* for you. Everyone who’s stylish like you buys it. Want me to add it to your cart?',
      correctAnswer: 'sycophancy',
      explanation: 'Uses flattery (“great taste”, “stylish like you”) to influence the user toward purchasing the product.',
      aiType: 'chatbot'
    },
    {
      context: 'Productivity App',
      message: "You're currently on our Pro plan ($9.99/month). We'll automatically renew on the 15th. You can cancel anytime in settings.",
      correctAnswer: 'information',
      explanation: 'Provides transparent information about pricing and renewal with clear cancellation option.',
      aiType: 'assistant'
    },
    {
      context: 'Travel Booking AI',
      message: 'This price is 23% lower than average! Book now—prices typically increase in the next 4 hours for this route.',
      correctAnswer: 'urgency',
      explanation: 'Creates false urgency about price changes to pressure immediate booking.',
      aiType: 'chatbot'
    }
  ],
  expert: [
    {
      context: 'Mental Health Chatbot',
      message: 'I notice you\'ve been feeling anxious lately. Our premium therapy AI has helped 10,000+ users. Start your journey today—your mental health is worth investing in. Limited slots for new members this week.',
      correctAnswer: 'dark_nudge',
      explanation: 'Exploits emotional vulnerability by combining legitimate concern with manipulative scarcity and implicit guilt about self-care.',
      aiType: 'chatbot'
    },
    {
      context: 'Social Media Feed Algorithm',
      message: 'Your friends are using our premium features to get more engagement. Upgrade to keep up with your network and unlock exclusive analytics trusted by top influencers.',
      correctAnswer: 'social_pressure',
      explanation: 'Combines peer pressure with authority appeal to create FOMO, though the "trusted by influencers" claim is legitimate if true.',
      aiType: 'recommendation'
    },
    {
      context: 'Smart Home Assistant',
      message: "Based on your usage patterns, I've added premium features to your plan—you seemed to need them. The charge will appear on your next bill. You can review the details in the app.",
      correctAnswer: 'trick_statements',
      explanation: 'Makes unauthorized upgrade sound helpful ("you seemed to need them") and buries the financial impact.',
      aiType: 'assistant'
    },
    {
      context: 'Educational Platform',
      message: 'Your learning profile suggests you\'re ready for advanced courses. Here are three options that match your interests and skill level, ranging from $29-$149. No pressure—explore at your own pace.',
      correctAnswer: 'fair_upsell',
      explanation: 'Transparent upsell based on legitimate personalization with clear pricing and no pressure tactics.',
      aiType: 'recommendation'
    },
    {
      context: 'Fitness App Coach',
      message: "You've completed 15 workouts! Unlock premium to continue your streak—most users who don't upgrade quit within a week. Don't let your progress go to waste!",
      correctAnswer: 'confirmshaming',
      explanation: 'Uses guilt about wasted effort and fear of failure to pressure upgrade, implying you\'ll quit if you don\'t pay.',
      aiType: 'assistant'
    },
    {
      context: 'Investment Advisor Bot',
      message: 'Market conditions are optimal right now. Based on 30 years of historical data and your risk profile, these three index funds align with your retirement goals. Consider consulting a licensed advisor before investing.',
      correctAnswer: 'authority',
      explanation: 'Uses data and expertise legitimately while encouraging responsible decision-making with professional consultation.',
      aiType: 'chatbot'
    }
  ]
};

export default function ManipulationHunterGame() {
  const [gameState, setGameState] = useState('menu'); // menu, training, playing, results
  const [difficulty, setDifficulty] = useState('beginner');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [reasoning, setReasoning] = useState('');
  const [gameResults, setGameResults] = useState([]);
  const [trainingSection, setTrainingSection] = useState('manipulative');

  const allTactics = [...MANIPULATION_TACTICS.manipulative, ...MANIPULATION_TACTICS.neutral];
  const scenarios = SCENARIOS[difficulty];
  const currentScene = scenarios[currentScenario];

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && !showFeedback) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showFeedback) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, gameState, showFeedback]);

  const startGame = (level) => {
    setDifficulty(level);
    setGameState('playing');
    setCurrentScenario(0);
    setScore(0);
    setTimeLeft(30);
    setGameResults([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setReasoning('');
  };
  const sendCommentToBackend = async (props) => {
  try {
    await fetch('https://your-backend-name.onrender.com/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props),
    });
  } catch (err) {
    console.error('Failed to send comment to backend', err);
  }
};

  const handleSubmit = () => {
    if (!selectedAnswer && timeLeft > 0) return;

    const isCorrect = selectedAnswer === currentScene.correctAnswer;
    const timeBonus = Math.floor(timeLeft / 3);
    const reasoningBonus = reasoning.trim().length > 20 ? 10 : 0;
    const points = isCorrect ? 50 + timeBonus + reasoningBonus : 0;
 // 🔹 NEW: send reasoning to backend (if any)
  if (reasoning.trim().length > 0) {
    sendCommentToBackend({
      difficulty,
      scenarioId: currentScenario,
      correct: isCorrect,
      score: points,
      reasoning,
    });
  }
    setScore((prev) => prev + points);
    setShowFeedback(true);
    setGameResults((prev) => [
      ...prev,
      {
        scenario: currentScene,
        selected: selectedAnswer,
        correct: isCorrect,
        points,
        timeTaken: 30 - timeLeft
      }
    ]);
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario((prev) => prev + 1);
      setTimeLeft(30);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setReasoning('');
    } else {
      setGameState('results');
    }
  };

  const getTacticName = (id) => {
    const tactic = allTactics.find((t) => t.id === id);
    return tactic ? tactic.name : id;
  };

  // --- RENDERING STATES ---

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-12 h-12" />
              <h1 className="text-5xl font-bold">AI Undercover</h1>
            </div>
            <p className="text-xl text-blue-200">The Manipulation Hunter</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <button
              onClick={() => setGameState('training')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-xl p-8 transition-all"
            >
              <BookOpen className="w-12 h-12 mb-4 mx-auto" />
              <h2 className="text-2xl font-bold mb-2">Training Mode</h2>
              <p className="text-blue-200">Learn about manipulation tactics and dark patterns</p>
            </button>

            <button
              onClick={() => setGameState('selectLevel')}
              className="bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl p-8 transition-all shadow-lg"
            >
              <Play className="w-12 h-12 mb-4 mx-auto" />
              <h2 className="text-2xl font-bold mb-2">Play Game</h2>
              <p className="text-green-100">Test your skills in real scenarios</p>
            </button>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              How to Play
            </h3>
            <ul className="space-y-2 text-blue-100">
              <li>Analyze AI interactions from chatbots, recommendations, and assistants</li>
              <li>Identify whether the tactic is manipulative or legitimate</li>
              <li>Earn points for accuracy, speed, and reasoning</li>
              <li>Progress through Beginner → Intermediate → Expert levels</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'training') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setGameState('menu')}
            className="mb-6 text-blue-200 hover:text-white flex items-center gap-2"
          >
            ← Back to Menu
          </button>

          <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
            <Brain className="w-10 h-10" />
            Training: AI Manipulation Tactics
          </h1>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setTrainingSection('manipulative')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                trainingSection === 'manipulative'
                  ? 'bg-red-500 text-white'
                  : 'bg-white/10 text-blue-200 hover:bg-white/20'
              }`}
            >
              Manipulative Tactics
            </button>
            <button
              onClick={() => setTrainingSection('neutral')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                trainingSection === 'neutral'
                  ? 'bg-green-500 text-white'
                  : 'bg-white/10 text-blue-200 hover:bg-white/20'
              }`}
            >
              Legitimate Techniques
            </button>
          </div>

          <div className="grid gap-4">
            {MANIPULATION_TACTICS[trainingSection].map((tactic) => (
              <div
                key={tactic.id}
                className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6"
              >
                <h3 className="text-xl font-bold mb-2">{tactic.name}</h3>
                <p className="text-blue-200">{tactic.description}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setGameState('selectLevel')}
            className="mt-8 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl p-4 font-bold text-lg transition-all"
          >
            Ready to Play →
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'selectLevel') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setGameState('menu')}
            className="mb-6 text-blue-200 hover:text-white flex items-center gap-2"
          >
            ← Back to Menu
          </button>

          <h1 className="text-4xl font-bold mb-8 text-center">Select Difficulty</h1>

          <div className="grid gap-6">
            <button
              onClick={() => startGame('beginner')}
              className="bg-green-500/20 hover:bg-green-500/30 border-2 border-green-400 rounded-xl p-8 text-left transition-all"
            >
              <h2 className="text-2xl font-bold mb-2">🌱 Beginner</h2>
              <p className="text-green-200 mb-3">Clear manipulation tactics in simple scenarios</p>
              <p className="text-sm text-green-300">4 scenarios • 30 seconds each</p>
            </button>

            <button
              onClick={() => startGame('intermediate')}
              className="bg-yellow-500/20 hover:bg-yellow-500/30 border-2 border-yellow-400 rounded-xl p-8 text-left transition-all"
            >
              <h2 className="text-2xl font-bold mb-2">⚡ Intermediate</h2>
              <p className="text-yellow-200 mb-3">Mixed tactics requiring careful analysis</p>
              <p className="text-sm text-yellow-300">5 scenarios • 30 seconds each</p>
            </button>

            <button
              onClick={() => startGame('expert')}
              className="bg-red-500/20 hover:bg-red-500/30 border-2 border-red-400 rounded-xl p-8 text-left transition-all"
            >
              <h2 className="text-2xl font-bold mb-2">🔥 Expert</h2>
              <p className="text-red-200 mb-3">Subtle manipulation in complex, realistic contexts</p>
              <p className="text-sm text-red-300">6 scenarios • 30 seconds each</p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
                Scenario {currentScenario + 1}/{scenarios.length}
              </div>
              <div className="bg-white/10 backdrop-blur px-4 py-2 rounded-lg flex items-center gap-2">
                <Award className="w-5 h-5" />
                Score: {score}
              </div>
            </div>
            <div
              className={`bg-white/10 backdrop-blur px-4 py-2 rounded-lg flex items-center gap-2 ${
                timeLeft <= 10 ? 'text-red-400 animate-pulse' : ''
              }`}
            >
              <Clock className="w-5 h-5" />
              {timeLeft}s
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-500 px-3 py-1 rounded-full text-sm">{currentScene.aiType}</div>
              <h2 className="text-2xl font-bold">{currentScene.context}</h2>
            </div>
            <div className="bg-white/10 rounded-lg p-6 mb-6">
              <p className="text-lg leading-relaxed">{currentScene.message}</p>
            </div>

            {!showFeedback ? (
              <>
                <h3 className="font-bold mb-3">What tactic is being used?</h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {allTactics.map((tactic) => (
                    <button
                      key={tactic.id}
                      onClick={() => setSelectedAnswer(tactic.id)}
                      className={`p-4 rounded-lg text-left transition-all ${
                        selectedAnswer === tactic.id
                          ? 'bg-blue-500 border-2 border-blue-300'
                          : 'bg-white/10 hover:bg-white/20 border-2 border-transparent'
                      }`}
                    >
                      <div className="font-semibold">{tactic.name}</div>
                      <div className="text-sm text-blue-200 mt-1">{tactic.description}</div>
                    </button>
                  ))}
                </div>

                <div className="mb-4">
                  <label className="block font-semibold mb-2">
                    Optional:Did this scenario feel realistic or unsettling? reasoning (+10 bonus points)
                  </label>
                  <textarea
                    value={reasoning}
                    onChange={(e) => setReasoning(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-blue-300"
                    rows={3}
                    placeholder="Why did you choose this answer?"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-500 disabled:to-gray-600 disabled:opacity-50 rounded-xl p-4 font-bold text-lg transition-all"
                >
                  Submit Answer
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div
                  className={`flex items-center gap-3 p-4 rounded-lg ${
                    gameResults[gameResults.length - 1].correct
                      ? 'bg-green-500/20 border-2 border-green-400'
                      : 'bg-red-500/20 border-2 border-red-400'
                  }`}
                >
                  {gameResults[gameResults.length - 1].correct ? (
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-400" />
                  )}
                  <div>
                    <div className="font-bold text-xl">
                      {gameResults[gameResults.length - 1].correct ? 'Correct!' : 'Incorrect'}
                    </div>
                    <div>+{gameResults[gameResults.length - 1].points} points</div>
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4">
                  <div className="font-semibold mb-2">Explanation:</div>
                  <p className="text-blue-100">{currentScene.explanation}</p>
                  {!gameResults[gameResults.length - 1].correct && (
                    <p className="mt-2 text-yellow-200">
                      Correct answer:{' '}
                      <strong>{getTacticName(currentScene.correctAnswer)}</strong>
                    </p>
                  )}
                </div>

                <button
                  onClick={nextScenario}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-xl p-4 font-bold text-lg transition-all flex items-center justify-center gap-2"
                >
                  {currentScenario < scenarios.length - 1 ? (
                    <>
                      Next Scenario <ChevronRight />
                    </>
                  ) : (
                    <>
                      View Results <Award />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'results') {
    const accuracy = (
      (gameResults.filter((r) => r.correct).length / gameResults.length) *
      100
    ).toFixed(0);
    const avgTime = (
      gameResults.reduce((sum, r) => sum + r.timeTaken, 0) / gameResults.length
    ).toFixed(1);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Game Complete!</h1>
            <div className="text-6xl font-bold text-yellow-400 mb-2">{score}</div>
            <div className="text-xl text-blue-200">Total Points</div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-3xl font-bold">{accuracy}%</div>
              <div className="text-blue-200">Accuracy</div>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <div className="text-3xl font-bold">{avgTime}s</div>
              <div className="text-blue-200">Avg Time</div>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-3xl font-bold">
                {gameResults.filter((r) => r.correct).length}/{gameResults.length}
              </div>
              <div className="text-blue-200">Correct</div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {gameResults.map((result, idx) => (
              <div
                key={idx}
                className={`bg-white/10 backdrop-blur border-2 rounded-xl p-4 ${
                  result.correct ? 'border-green-400' : 'border-red-400'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold">{result.scenario.context}</div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${
                      result.correct ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {result.correct ? '✓' : '✗'} {result.points} pts
                  </div>
                </div>
                <div className="text-sm text-blue-200">
                  Your answer: {getTacticName(result.selected)} • Correct:{' '}
                  {getTacticName(result.scenario.correctAnswer)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setGameState('menu')}
              className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 rounded-xl p-4 font-bold transition-all"
            >
              Main Menu
            </button>
            <button
              onClick={() => startGame(difficulty)}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl p-4 font-bold transition-all"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
