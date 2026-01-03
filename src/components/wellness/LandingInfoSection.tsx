import { motion } from 'framer-motion';
import { Heart, Brain, Sparkles, Users, ChevronRight } from 'lucide-react';

interface LandingInfoSectionProps {
  onStartQuestionnaire: () => void;
}

const scoreRanges = [
  {
    range: '0-25',
    label: 'Doing Great! 😊',
    description: 'You\'re in a positive mental state. Keep nurturing your wellness with fun activities!',
    color: 'hsl(150, 50%, 50%)',
    bgColor: 'bg-wellness-green/20',
    activities: [
      'Dance challenge / movement video',
      'Mini game / brain puzzle – challenge yourself',
      'Share a happy message → visual card + animation',
      'Invite a friend mini-challenge → send mood check link',
      'Confetti / fireworks animation for activity completion',
      'Create a gratitude card → save/share',
      'Emoji streak tracker → celebrate consistency',
      'Advanced doodle / creative mini challenge',
      'Quick quiz / fun fact game → collect points',
      'Hydration + walk combo challenge',
      'Positive affirmation clicker → reinforce happy mindset',
      'Mini mindfulness + visualization – 5 min calm exercise',
      'Share smile selfie / sticker – optional save/share',
      'Explore premium course suggestion – yoga, gym, counseling',
    ],
  },
  {
    range: '25-50',
    label: 'Feeling Okay 😐',
    description: 'You\'re doing alright but could use some gentle activities to boost your mood.',
    color: 'hsl(210, 70%, 65%)',
    bgColor: 'bg-wellness-blue/20',
    activities: [
      'Spin the activity wheel – yoga, doodle, walk, game',
      'Stretch + hydration combo – complete both to fill progress bar',
      'Play a memory game / matching game',
      'Breathing + visualization exercise – inhale → animated balloon rises',
      'Mini mindfulness quiz – answer 3 questions → get tip',
      'Virtual high-five – click → animation + points',
      'Mood tracker emoji selection – see trend graph',
      'Random fun challenge – "Try a new snack / drink water + stretch"',
      'Quick joke / laughter clip – click to reveal',
      'Gratitude reflection – pick 2 prompts → submit',
      'Short guided yoga video – 5–10 min',
      'Mini brain teaser – logic puzzle / riddle',
    ],
  },
  {
    range: '50-75',
    label: 'Needs Extra Care 🫂',
    description: 'You deserve some extra attention. Try calming activities to help you feel better.',
    color: 'hsl(255, 45%, 70%)',
    bgColor: 'bg-wellness-lavender/20',
    activities: [
      '5–10 min walk reminder → checkbox after done',
      'Guided mini yoga – animated video',
      'Music selection game – click song card → plays track',
      'Tiny doodle challenge – draw 1 item in 2 min',
      'Gratitude reflection – pick a prompt card → type answer',
      'Spin the wheel – random activity suggestion',
      'Breathing exercise with progress bar',
      'Virtual water bottle → fill as you drink',
      'Quick brain teaser / riddle',
      'Emoji mood diary → pick 3 emojis → summary animation',
      'Mini meditation animation → forest, beach, or clouds',
      'Random act of kindness suggestion → click "Done"',
      'Interactive quiz → "Which small habit boosts mood today?"',
    ],
  },
  {
    range: '75-100',
    label: 'Needs Support 💙',
    description: 'It\'s okay to not be okay. Here are gentle, soothing activities to help you through.',
    color: 'hsl(180, 40%, 55%)',
    bgColor: 'bg-wellness-teal/20',
    activities: [
      'Mini breathing exercise – follow circle animation for 5 min',
      'Gratitude card – type one thing you\'re thankful for → pop-up animation',
      'Hydration reminder – click glass icon → virtual bottle fills',
      'Tiny stretch challenge – 2–3 animated stretches',
      'Mood music – play calm, uplifting music clips',
      'Emoji picker – select mood emoji → get a tiny tip',
      'Positive quote slider – swipe to see 5 motivational quotes',
      'Virtual hug animation – click to see comforting visual',
      'Mini puzzle game – simple matching or jigsaw',
      'Random fun fact – click to reveal',
      'Compliment yourself challenge – type one thing you like about yourself',
    ],
  },
];

const getRandomActivities = (activities: string[], count: number = 3): string[] => {
  const shuffled = [...activities].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const LandingInfoSection = ({ onStartQuestionnaire }: LandingInfoSectionProps) => {
  return (
    <section id="info-section" className="min-h-screen bg-background py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Intro Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-apricots text-4xl md:text-5xl mb-4 text-primary">
            About Our Wellness System
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Our mental wellness check-in helps you understand your current emotional state through 
            simple, thoughtful questions. Based on your responses, we calculate a wellness score 
            and provide personalized activities to support your journey.
          </p>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
        >
          {[
            { icon: Heart, title: 'Check In', desc: 'Answer 11 simple questions about how you feel' },
            { icon: Brain, title: 'Get Your Score', desc: 'Receive a wellness score from 0-100' },
            { icon: Sparkles, title: 'Get Activities', desc: 'Personalized activities based on your mood' },
            { icon: Users, title: 'Track Progress', desc: 'Monitor your wellness journey over time' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className="wellness-card text-center p-6"
            >
              <div 
                className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: 'hsl(var(--primary) / 0.1)' }}
              >
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Score Meanings & Activities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="font-apricots text-3xl md:text-4xl text-center mb-10 text-primary">
            Score Meanings & Activities
          </h3>

          <div className="space-y-8">
            {scoreRanges.map((range, index) => {
              const randomActivities = getRandomActivities(range.activities);
              return (
                <motion.div
                  key={range.range}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className={`wellness-card p-6 md:p-8 ${range.bgColor}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Score Badge */}
                    <div className="flex-shrink-0">
                      <div 
                        className="w-24 h-24 rounded-full flex flex-col items-center justify-center text-white font-bold"
                        style={{ backgroundColor: range.color }}
                      >
                        <span className="text-xl">{range.range}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h4 className="text-xl md:text-2xl font-bold mb-2" style={{ color: range.color }}>
                        {range.label}
                      </h4>
                      <p className="text-muted-foreground mb-4">{range.description}</p>

                      {/* Activities Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-2 px-3 text-sm font-semibold text-muted-foreground">#</th>
                              <th className="text-left py-2 px-3 text-sm font-semibold text-muted-foreground">Suggested Activity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {randomActivities.map((activity, i) => (
                              <tr key={i} className="border-b border-border/50 last:border-0">
                                <td className="py-3 px-3 text-sm font-medium" style={{ color: range.color }}>{i + 1}</td>
                                <td className="py-3 px-3 text-sm">{activity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-muted-foreground text-lg mb-6">
            Ready to check in with yourself?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartQuestionnaire}
            className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-primary text-primary-foreground"
          >
            <span>Start Wellness Check</span>
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default LandingInfoSection;
