import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoodLevel, AnswerOption, Answer, QuestionnaireResult } from '@/types/wellness';
import { questions } from '@/data/questions';
import { getScoreForAnswer, calculateTotalScore, normalizeScore, getMoodResult } from '@/utils/scoring';
import MoodSelector from '@/components/wellness/MoodSelector';
import WelcomePopup from '@/components/wellness/WelcomePopup';
import ProgressBar from '@/components/wellness/ProgressBar';
import QuestionCard from '@/components/wellness/QuestionCard';
import SafetyAlert from '@/components/wellness/SafetyAlert';
import LoginPrompt from '@/components/wellness/LoginPrompt';
import ResultCard from '@/components/wellness/ResultCard';
import RecommendationList from '@/components/wellness/RecommendationList';
import FloatingShapes from '@/components/wellness/FloatingShapes';
import Header from '@/components/wellness/Header';
import { ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { Helmet } from 'react-helmet';

type AppState = 'landing' | 'welcome' | 'questionnaire' | 'safety-alert' | 'login-prompt' | 'results' | 'recommendations';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerOption>>({});
  const [result, setResult] = useState<QuestionnaireResult | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  const handleMoodSelect = (mood: MoodLevel) => {
    setSelectedMood(mood);
    setTimeout(() => setAppState('welcome'), 300);
  };

  const handleStartQuestionnaire = () => {
    setAppState('questionnaire');
  };

  const handleAnswer = useCallback((answer: AnswerOption) => {
    const question = questions[currentQuestionIndex];
    
    setAnswers(prev => ({
      ...prev,
      [question.id]: answer,
    }));

    // Check for sensitive question
    if (question.isSensitive && (answer === 'yes' || answer === 'mostly')) {
      setAppState('safety-alert');
      return;
    }

    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 300);
    } else {
      // Calculate final score
      const answerArray: Answer[] = Object.entries({ ...answers, [question.id]: answer }).map(
        ([questionId, ans]) => {
          const q = questions.find(q => q.id === questionId)!;
          return {
            questionId,
            answer: ans,
            score: getScoreForAnswer(ans, q.isSensitive || false),
          };
        }
      );
      
      const totalScore = calculateTotalScore(answerArray, questions);
      const normalized = normalizeScore(totalScore);
      
      setResult({
        totalScore,
        normalizedScore: normalized,
        mood: getMoodResult(normalized).mood,
        answers: answerArray,
        completedAt: new Date(),
      });
      
      setAppState('login-prompt');
    }
  }, [currentQuestionIndex, answers]);

  const handleSafetyAlertClose = () => {
    // Continue to next question after safety alert
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAppState('questionnaire');
    } else {
      // Calculate and show results
      const question = questions[currentQuestionIndex];
      const answerArray: Answer[] = Object.entries(answers).map(
        ([questionId, ans]) => {
          const q = questions.find(q => q.id === questionId)!;
          return {
            questionId,
            answer: ans,
            score: getScoreForAnswer(ans, q.isSensitive || false),
          };
        }
      );
      
      const totalScore = calculateTotalScore(answerArray, questions);
      const normalized = normalizeScore(totalScore);
      
      setResult({
        totalScore,
        normalizedScore: normalized,
        mood: getMoodResult(normalized).mood,
        answers: answerArray,
        completedAt: new Date(),
      });
      
      setAppState('login-prompt');
    }
  };

  const handleLogin = () => {
    // For now, just proceed to results
    // In a real app, this would open a login modal
    setAppState('results');
  };

  const handleContinueWithoutLogin = () => {
    setAppState('results');
  };

  const handleViewRecommendations = () => {
    setAppState('recommendations');
  };

  const handleBackToResults = () => {
    setAppState('results');
  };

  const handleRetake = () => {
    setSelectedMood(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setResult(null);
    setAppState('landing');
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const moodResult = result ? getMoodResult(result.normalizedScore) : null;

  return (
    <>
      <Helmet>
        <title>ARE YOU OK? | Mental Wellness Check-In</title>
        <meta name="description" content="A gentle self-check-in tool to understand your mental state. Track your emotional wellness with guided questions and personalized recommendations." />
      </Helmet>

      <div className="min-h-screen gradient-hero relative overflow-hidden">
        <FloatingShapes />
        <Header />

        <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
          <AnimatePresence mode="wait">
            {/* Landing State */}
            {appState === 'landing' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl w-full text-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-8"
                >
                  <motion.span
                    className="inline-block text-6xl md:text-7xl mb-4"
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    💭
                  </motion.span>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                    How do you feel <br />
                    <span className="text-primary">right now?</span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto">
                    Take a moment to check in with yourself. Select the emoji that best describes your current mood.
                  </p>
                </motion.div>

                <MoodSelector selectedMood={selectedMood} onSelect={handleMoodSelect} />
              </motion.div>
            )}

            {/* Questionnaire State */}
            {appState === 'questionnaire' && (
              <motion.div
                key="questionnaire"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-xl w-full"
              >
                <ProgressBar current={currentQuestionIndex + 1} total={questions.length} />
                
                <AnimatePresence mode="wait">
                  <QuestionCard
                    key={currentQuestion.id}
                    question={currentQuestion}
                    selectedAnswer={answers[currentQuestion.id] || null}
                    onAnswer={handleAnswer}
                  />
                </AnimatePresence>

                {/* Navigation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-between mt-6"
                >
                  <button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>
                  
                  {answers[currentQuestion.id] && currentQuestionIndex < questions.length - 1 && (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-primary hover:bg-primary/10 transition-all"
                    >
                      Next
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  )}
                </motion.div>
              </motion.div>
            )}

            {/* Results State */}
            {appState === 'results' && result && moodResult && (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full max-w-lg"
              >
                <ResultCard
                  normalizedScore={result.normalizedScore}
                  moodResult={moodResult}
                  onViewRecommendations={handleViewRecommendations}
                />
              </motion.div>
            )}

            {/* Recommendations State */}
            {appState === 'recommendations' && moodResult && (
              <motion.div
                key="recommendations"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <RecommendationList
                  mood={moodResult.mood}
                  onRetake={handleRetake}
                  onBack={handleBackToResults}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer for retake */}
        {(appState === 'results' || appState === 'recommendations') && (
          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent z-30"
          >
            <div className="max-w-4xl mx-auto flex justify-center">
              <button
                onClick={handleRetake}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-card shadow-soft text-foreground font-medium hover:shadow-glow transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                Check In Again
              </button>
            </div>
          </motion.footer>
        )}

        {/* Popups */}
        <WelcomePopup isOpen={appState === 'welcome'} onStart={handleStartQuestionnaire} />
        <SafetyAlert isOpen={appState === 'safety-alert'} onClose={handleSafetyAlertClose} />
        <LoginPrompt
          isOpen={appState === 'login-prompt'}
          onLogin={handleLogin}
          onContinueWithoutLogin={handleContinueWithoutLogin}
        />
      </div>
    </>
  );
};

export default Index;
