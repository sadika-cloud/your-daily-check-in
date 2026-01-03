import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnswerOption, Answer, QuestionnaireResult } from '@/types/wellness';
import { questions, motivationalQuotes } from '@/data/questions';
import { getScoreForAnswer, calculateTotalScore, normalizeScore, getMoodResult } from '@/utils/scoring';
import WelcomePopup from '@/components/wellness/WelcomePopup';
import ProgressBar from '@/components/wellness/ProgressBar';
import QuestionCard from '@/components/wellness/QuestionCard';
import SafetyAlert from '@/components/wellness/SafetyAlert';
import LoginPrompt from '@/components/wellness/LoginPrompt';
import ResultCard from '@/components/wellness/ResultCard';
import RecommendationList from '@/components/wellness/RecommendationList';
import Header from '@/components/wellness/Header';
import { ChevronRight, ChevronLeft, RotateCcw } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import landingBg from '@/assets/landing-bg.png';

type AppState = 'landing' | 'welcome' | 'questionnaire' | 'safety-alert' | 'login-prompt' | 'results' | 'recommendations';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerOption>>({});
  const [result, setResult] = useState<QuestionnaireResult | null>(null);
  const [lastCheckIn, setLastCheckIn] = useState<{ date: string; score: number } | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  const currentQuestion = questions[currentQuestionIndex];

  // Fetch last check-in for returning users
  useEffect(() => {
    if (user) {
      fetchLastCheckIn();
    }
  }, [user]);

  const fetchLastCheckIn = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('questionnaire_history')
      .select('created_at, score')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setLastCheckIn({
        date: new Date(data.created_at).toLocaleDateString(),
        score: data.score,
      });
    }
  };

  const saveQuestionnaireResult = async (normalizedScore: number, moodName: string, answerData: Answer[]) => {
    if (!user) return;

    try {
      // Save to questionnaire_history
      const { error: historyError } = await supabase.from('questionnaire_history').insert([
        {
          user_id: user.id,
          score: normalizedScore,
          mood: moodName,
          answers: JSON.parse(JSON.stringify(answerData)),
        }
      ]);

      if (historyError) throw historyError;

      // Update profile with last questionnaire info
      await supabase.from('profiles').update({
        last_questionnaire_date: new Date().toISOString(),
        last_score: normalizedScore,
      }).eq('user_id', user.id);

      toast({
        title: 'Progress saved! 💚',
        description: 'Your wellness check-in has been recorded.',
      });
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  const handleGetStarted = () => {
    setAppState('welcome');
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
      
      // If user is already logged in, skip login prompt
      if (user) {
        saveQuestionnaireResult(normalized, getMoodResult(normalized).mood, answerArray);
        setAppState('results');
      } else {
        setAppState('login-prompt');
      }
    }
  }, [currentQuestionIndex, answers, user]);

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
      
      // If user is already logged in, skip login prompt
      if (user) {
        saveQuestionnaireResult(normalized, getMoodResult(normalized).mood, answerArray);
        setAppState('results');
      } else {
        setAppState('login-prompt');
      }
    }
  };

  const handleLogin = () => {
    // Save result after login
    if (result) {
      saveQuestionnaireResult(result.normalizedScore, result.mood, result.answers);
    }
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

      <div className="min-h-screen relative overflow-hidden">
        {/* Landing State - Full Background Image */}
        {appState === 'landing' ? (
          <div 
            className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex flex-col"
            style={{ backgroundImage: `url(${landingBg})` }}
          >
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
              <motion.div
                key="landing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center max-w-xl"
              >
                {/* Quote */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg md:text-xl text-foreground/80 italic mb-10 leading-relaxed px-4"
                >
                  "{motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}"
                </motion.p>

                {/* Get Started Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetStarted}
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <span>Let's Get Started</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    💚
                  </motion.span>
                </motion.button>
              </motion.div>
            </main>
          </div>
        ) : (
          <>
            <div className="gradient-hero min-h-screen">
              <Header />
              <main className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
                <AnimatePresence mode="wait">

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
            </div>
          </>
        )}

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
