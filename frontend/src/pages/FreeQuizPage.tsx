import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SEO from '../components/SEO';

// Sample questions hardcoded for each paper (no API call needed, no login required)
const FREE_QUESTIONS: Record<string, Array<{
  id: string;
  text: string;
  options: Record<string, string>;
  correct: string;
  explanation: string;
  topic: string;
}>> = {
  'ie-ifs': [
    { id: '1', text: 'Which of the following is the apex body for regulating the securities market in India?', options: { A: 'RBI', B: 'SEBI', C: 'IRDAI', D: 'NABARD' }, correct: 'B', explanation: 'SEBI (Securities and Exchange Board of India) is the apex regulatory body for the securities market, established in 1992 under the SEBI Act.', topic: 'SEBI' },
    { id: '2', text: 'The Cash Reserve Ratio (CRR) is maintained by scheduled commercial banks with:', options: { A: 'Government of India', B: 'NABARD', C: 'Reserve Bank of India', D: 'State Bank of India' }, correct: 'C', explanation: 'CRR is the percentage of NDTL that banks must maintain as cash balance with RBI. It is a monetary policy tool under Section 42 of the RBI Act 1934.', topic: 'RBI functions and role' },
    { id: '3', text: 'NITI Aayog was established in which year to replace the Planning Commission?', options: { A: '2012', B: '2014', C: '2015', D: '2016' }, correct: 'C', explanation: 'NITI Aayog (National Institution for Transforming India) was established on January 1, 2015 by a resolution of the Union Cabinet, replacing the Planning Commission.', topic: 'Economic planning' },
    { id: '4', text: 'Which of the following is NOT a component of India\'s Balance of Payments?', options: { A: 'Current Account', B: 'Capital Account', C: 'Revenue Account', D: 'Financial Account' }, correct: 'C', explanation: 'Balance of Payments has two main components: Current Account (trade in goods/services) and Capital/Financial Account (investments, loans). Revenue Account is a government budget concept, not BoP.', topic: 'Balance of payments' },
    { id: '5', text: 'Priority Sector Lending target for domestic commercial banks is what percentage of ANBC?', options: { A: '18%', B: '40%', C: '75%', D: '25%' }, correct: 'B', explanation: 'As per RBI Master Direction on PSL, domestic commercial banks must lend 40% of Adjusted Net Bank Credit (ANBC) to priority sectors including agriculture (18%), micro enterprises (7.5%), and weaker sections (12%).', topic: 'Priority Sector Lending' },
  ],
  'ppb': [
    { id: '1', text: 'Under the Negotiable Instruments Act 1881, which of the following is NOT a negotiable instrument?', options: { A: 'Promissory Note', B: 'Bill of Exchange', C: 'Cheque', D: 'Fixed Deposit Receipt' }, correct: 'D', explanation: 'Section 13 of NI Act defines negotiable instruments as Promissory Notes, Bills of Exchange, and Cheques. FDR is not a negotiable instrument.', topic: 'Negotiable Instruments Act 1881' },
    { id: '2', text: 'KYC periodic update for high-risk customers must be done every:', options: { A: '1 year', B: '2 years', C: '5 years', D: '10 years' }, correct: 'B', explanation: 'As per RBI KYC Master Direction, periodic KYC update timelines are: High risk - 2 years, Medium risk - 8 years, Low risk - 10 years.', topic: 'KYC norms' },
    { id: '3', text: 'An advance is classified as NPA when interest/principal remains overdue for more than:', options: { A: '30 days', B: '60 days', C: '90 days', D: '180 days' }, correct: 'C', explanation: 'As per RBI IRAC norms, an advance becomes NPA when interest/principal remains overdue for more than 90 days (for term loans) or the account remains out of order for 90 days (for OD/CC).', topic: 'NPA classification' },
    { id: '4', text: 'The Banking Ombudsman Scheme is now replaced by:', options: { A: 'Consumer Forum', B: 'RBI Integrated Ombudsman Scheme 2021', C: 'SEBI Grievance Redressal', D: 'Banking Codes Board' }, correct: 'B', explanation: 'The RBI Integrated Ombudsman Scheme 2021 replaced the earlier Banking Ombudsman Scheme, NBFC Ombudsman Scheme, and Digital Transactions Ombudsman Scheme into a single unified scheme.', topic: 'Banking ombudsman' },
    { id: '5', text: 'SARFAESI Act 2002 is applicable for secured loans above:', options: { A: '₹50,000', B: '₹1 lakh', C: '₹5 lakh', D: '₹20 lakh' }, correct: 'B', explanation: 'SARFAESI Act applies to secured debts of ₹1 lakh and above. It allows banks to enforce security interest without court intervention for NPA recovery.', topic: 'SARFAESI Act' },
  ],
  'afm': [
    { id: '1', text: 'Which depreciation method charges a fixed percentage on the reducing balance of an asset?', options: { A: 'Straight Line Method', B: 'Written Down Value Method', C: 'Sum of Years Digits', D: 'Units of Production' }, correct: 'B', explanation: 'Written Down Value (WDV) method charges depreciation as a fixed percentage on the reducing (written down) balance each year, resulting in higher depreciation in earlier years.', topic: 'Depreciation methods' },
    { id: '2', text: 'If NPV of a project is positive, it means:', options: { A: 'Project should be rejected', B: 'Project earns less than cost of capital', C: 'Project earns more than cost of capital', D: 'Project has zero return' }, correct: 'C', explanation: 'Positive NPV means the project generates returns above the required rate (cost of capital). The project adds value and should be accepted.', topic: 'Capital budgeting NPV IRR' },
    { id: '3', text: 'Current Ratio is calculated as:', options: { A: 'Fixed Assets / Current Liabilities', B: 'Current Assets / Current Liabilities', C: 'Quick Assets / Current Liabilities', D: 'Total Assets / Total Liabilities' }, correct: 'B', explanation: 'Current Ratio = Current Assets / Current Liabilities. It measures short-term liquidity. A ratio of 2:1 is generally considered ideal.', topic: 'Ratio analysis' },
    { id: '4', text: 'TDS on salary is deducted under which section of Income Tax Act?', options: { A: 'Section 192', B: 'Section 194A', C: 'Section 194C', D: 'Section 195' }, correct: 'A', explanation: 'Section 192 deals with TDS on salary. 194A is for interest other than securities, 194C is for contractor payments, and 195 is for payments to non-residents.', topic: 'TDS provisions' },
    { id: '5', text: 'Break-Even Point is reached when:', options: { A: 'Profit equals loss', B: 'Total revenue equals total cost', C: 'Fixed cost equals variable cost', D: 'Sales exceed budget' }, correct: 'B', explanation: 'Break-Even Point (BEP) is where Total Revenue = Total Cost (Fixed + Variable). At BEP, there is neither profit nor loss. BEP in units = Fixed Cost / Contribution per unit.', topic: 'Break even analysis' },
  ],
  'rbwm': [
    { id: '1', text: 'Under PMAY (Pradhan Mantri Awas Yojana), the interest subsidy for EWS/LIG category is:', options: { A: '3%', B: '4%', C: '6.5%', D: '5%' }, correct: 'C', explanation: 'Under PMAY-CLSS, EWS/LIG category gets 6.5% interest subsidy on home loans up to ₹6 lakh for a tenure of 20 years, translating to approximately ₹2.67 lakh subsidy.', topic: 'Home loans' },
    { id: '2', text: 'Which of the following is NOT a type of mutual fund based on structure?', options: { A: 'Open-ended fund', B: 'Close-ended fund', C: 'Interval fund', D: 'Index fund' }, correct: 'D', explanation: 'Based on structure, mutual funds are: Open-ended, Close-ended, and Interval funds. Index fund is classified based on investment strategy, not structure.', topic: 'Mutual funds types' },
    { id: '3', text: 'The maximum UPI transaction limit for person-to-person transfer is:', options: { A: '₹50,000', B: '₹1 lakh', C: '₹2 lakh', D: '₹5 lakh' }, correct: 'B', explanation: 'UPI transaction limit is ₹1 lakh for regular P2P transfers. Enhanced limits of ₹2 lakh apply for verified merchants and ₹5 lakh for capital market transactions.', topic: 'Payment systems' },
    { id: '4', text: 'MUDRA loans are categorized into three types. Which is the highest category?', options: { A: 'Shishu (up to ₹50,000)', B: 'Kishore (₹50,000 to ₹5 lakh)', C: 'Tarun (₹5 lakh to ₹10 lakh)', D: 'Yuva (₹10 lakh to ₹50 lakh)' }, correct: 'C', explanation: 'MUDRA (Micro Units Development and Refinance Agency) loans have 3 categories: Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 lakh), and Tarun (₹5 lakh to ₹10 lakh). Tarun is the highest.', topic: 'Financial inclusion' },
    { id: '5', text: 'Risk profiling of a wealth management client primarily assesses:', options: { A: 'Credit score only', B: 'Risk tolerance, time horizon, and financial goals', C: 'Annual income only', D: 'Number of bank accounts' }, correct: 'B', explanation: 'Risk profiling assesses the client\'s risk tolerance (ability and willingness to take risk), investment time horizon, and financial goals to recommend suitable investment products.', topic: 'Risk profiling' },
  ],
};

const PAPER_NAMES: Record<string, string> = {
  'ie-ifs': 'IE & IFS — Indian Economy & Indian Financial System',
  'ppb': 'PPB — Principles & Practices of Banking',
  'afm': 'AFM — Accounting & Financial Management',
  'rbwm': 'RBWM — Retail Banking & Wealth Management',
};

const FreeQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const questions = slug ? FREE_QUESTIONS[slug] || [] : [];
  const paperName = slug ? PAPER_NAMES[slug] || '' : '';

  if (!slug || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Quiz Not Found</h1>
          <button onClick={() => navigate('/practice-tests')} className="text-blue-600 hover:underline">← Back to Practice Tests</button>
        </div>
      </div>
    );
  }

  const question = questions[currentQ];
  const selectedAnswer = answers[question.id];
  const isAnswered = !!selectedAnswer;
  const isCorrect = selectedAnswer === question.correct;
  const totalCorrect = Object.entries(answers).filter(([id, ans]) => {
    const q = questions.find(qq => qq.id === id);
    return q && ans === q.correct;
  }).length;

  const handleSelect = (key: string) => {
    if (isAnswered) return; // can't change after answering
    setAnswers({ ...answers, [question.id]: key });
    setShowExplanation(true);
  };

  const handleNext = () => {
    setShowExplanation(false);
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowResult(true);
    }
  };

  // Results screen
  if (showResult) {
    const score = Math.round((totalCorrect / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <SEO
          title={`Free ${slug?.toUpperCase()} Quiz Result | MockMaster`}
          description={`You scored ${score}% on the free ${paperName} quiz. Sign up to access 3000+ questions.`}
          canonical={`https://mockmaster.fun/free-quiz/${slug}`}
        />
        <div className="max-w-lg mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${score >= 60 ? 'bg-green-100' : 'bg-red-100'}`}>
              <span className="text-4xl">{score >= 60 ? '🎉' : '📚'}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
            <p className="text-gray-600 mb-6">{paperName}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-blue-600">{score}%</p>
                <p className="text-xs text-gray-600">Score</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-green-600">{totalCorrect}/{questions.length}</p>
                <p className="text-xs text-gray-600">Correct</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-2xl font-bold text-purple-600">5</p>
                <p className="text-xs text-gray-600">Questions</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white mb-6">
              <h3 className="font-bold text-lg mb-2">Want more practice?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Sign up free to access 3000+ questions with AI explanations, performance tracking, and exam readiness scores.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="w-full py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Sign Up Free — Unlock All Questions
              </button>
            </div>

            <button
              onClick={() => { setCurrentQ(0); setAnswers({}); setShowResult(false); }}
              className="text-gray-600 text-sm hover:underline"
            >
              Retake this quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz interface
  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={`Free ${paperName.split('—')[0].trim()} Quiz — Try Before Signup | MockMaster`}
        description={`Try 5 free ${paperName} practice questions. No signup required. Test your JAIIB knowledge now.`}
        canonical={`https://mockmaster.fun/free-quiz/${slug}`}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(`/practice-tests/${slug}`)}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">JC</span>
            </div>
            <span className="text-sm font-bold text-gray-900">MockMaster</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">FREE QUIZ</span>
            <span className="text-sm text-gray-600 font-medium">
              {currentQ + 1} / {questions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-gray-200 h-1.5">
        <div
          className="bg-blue-600 h-1.5 transition-all duration-300"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8">
          <p className="text-xs text-blue-600 font-medium mb-2">{question.topic}</p>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 leading-relaxed">
            {question.text}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {Object.entries(question.options).map(([key, value]) => {
              let style = 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer';
              if (isAnswered) {
                if (key === question.correct) {
                  style = 'border-green-400 bg-green-50';
                } else if (key === selectedAnswer && key !== question.correct) {
                  style = 'border-red-400 bg-red-50';
                } else {
                  style = 'border-gray-200 opacity-60 cursor-default';
                }
              } else if (key === selectedAnswer) {
                style = 'border-blue-500 bg-blue-50';
              }

              return (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  disabled={isAnswered}
                  className={`w-full flex items-start gap-3 p-4 border-2 rounded-xl text-left transition-all ${style}`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                    isAnswered && key === question.correct ? 'bg-green-500 text-white' :
                    isAnswered && key === selectedAnswer ? 'bg-red-500 text-white' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {key}
                  </span>
                  <span className="text-sm sm:text-base text-gray-800 pt-1">{value}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className={`mt-6 p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`font-semibold text-sm mb-1 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? '✅ Correct!' : `❌ Incorrect — Answer is ${question.correct}`}
              </p>
              <p className="text-sm text-gray-700">{question.explanation}</p>
            </div>
          )}

          {/* Next button */}
          {isAnswered && (
            <button
              onClick={handleNext}
              className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
            >
              {currentQ < questions.length - 1 ? 'Next Question →' : 'See Results'}
            </button>
          )}
        </div>

        {/* Bottom CTA */}
        <p className="text-center text-xs text-gray-500 mt-6">
          This is a free sample. <button onClick={() => navigate('/register')} className="text-blue-600 font-medium hover:underline">Sign up</button> to access 3000+ questions.
        </p>
      </div>
    </div>
  );
};

export default FreeQuizPage;
