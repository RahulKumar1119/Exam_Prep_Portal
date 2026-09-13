import React from 'react';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  coverImage: string;
  content: React.ReactNode;
}

const ADDITIONAL_BLOG_POSTS: BlogPost[] = [
  {
    slug: 'jaiib-ie-ifs-important-topics-2026',
    title: 'JAIIB IE & IFS Important Topics 2026 — Module-Wise High-Priority Areas',
    description: 'JAIIB IE & IFS important topics 2026 explained module-wise. Learn high-priority areas, key concepts and a smart 30-day study plan to score 50+ with ease.',
    date: '2026-09-13',
    readTime: '10 min read',
    category: 'Study Strategy',
    coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">If you are preparing for JAIIB 2026, Indian Economy and Indian Financial System, popularly called IE and IFS, is the paper that sets the tone for your whole attempt. It connects basic economics with the day-to-day working of banks, so officers who understand concepts can score quickly without lengthy calculations. This guide breaks down module-wise high-priority areas, explains why each topic matters, and shows how to finish the syllabus in a focused and practical way.</p>
        <div className="not-prose bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 my-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div><div className="text-2xl font-bold text-blue-900">1,161</div><div className="text-sm text-gray-600">Practice Questions</div></div>
            <div><div className="text-2xl font-bold text-blue-900">4</div><div className="text-sm text-gray-600">Modules Covered</div></div>
            <div><div className="text-2xl font-bold text-blue-900">100</div><div className="text-sm text-gray-600">Total Marks</div></div>
            <div><div className="text-2xl font-bold text-blue-900">50</div><div className="text-sm text-gray-600">Marks to Pass</div></div>
          </div>
        </div>
        <h2>Paper Overview: What IE and IFS Really Tests</h2>
        <p>IE and IFS is Paper 1 of JAIIB. It has four modules covering the Indian economic structure, core economic ideas linked to banking, the Indian financial architecture, and the financial products and services banks offer. The paper carries 100 marks and you need 50 marks to pass. Questions are objective in nature and mostly test clarity of concepts, functions of institutions, and awareness of how policy connects to banking business.</p>
        <p>Unlike accounting or legal papers, this subject does not demand working out long problems. It rewards regular reading, logical linking, and revision of definitions and roles. For example, once you understand why the Reserve Bank changes policy rates, you can answer questions on deposits, credit growth, and bond prices together. Bankers who relate every chapter to branch-level work find this paper scoring and interesting rather than theoretical.</p>
        <h2>High-Priority Topics for 2026</h2>
        <p>These ten areas appear again and again in mock tests and past sessions. Start here if your time is limited, then expand module by module.</p>
        <ul>
          <li><strong>RBI functions and role:</strong> why the central bank matters for note issue, banker to banks, and financial stability</li>
          <li><strong>Money supply and monetary policy:</strong> why measures of money and tools like repo rate influence credit and liquidity</li>
          <li><strong>GDP and National Income:</strong> why growth concepts help you interpret economic performance and banking demand</li>
          <li><strong>SEBI and market regulation:</strong> why investor protection and market supervision support healthy capital markets</li>
          <li><strong>Banking Regulation Act 1949:</strong> why licensing, management, and powers under the Act shape bank working</li>
          <li><strong>Financial markets overview:</strong> why money market and capital market differences are frequently tested</li>
          <li><strong>Inflation indices:</strong> why CPI, WPI, and their uses matter for policy and depositors</li>
          <li><strong>Fiscal policy and Union Budget:</strong> why deficits, taxation, and spending link the government to banks</li>
          <li><strong>Forex and FEMA basics:</strong> why exchange rates and foreign exchange rules affect trade and remittances</li>
          <li><strong>NITI Aayog and planning:</strong> why the shift from planning era to policy think-tank changed development strategy</li>
        </ul>
        <p>Master these first with short notes and one-line revisions. They form nearly half of the direct questions and also help you understand the remaining modules faster.</p>
        <h2>Module A: Indian Economic Architecture</h2>
        <p>Module A builds your foundation about how the Indian economy is organised. Focus on structure and trends rather than memorising every year and figure.</p>
        <ul>
          <li><strong>Nature and sectors of the economy:</strong> primary, secondary, and services sectors and their contribution to jobs and output</li>
          <li><strong>Economic planning history:</strong> objectives of five-year plans and lessons that still guide policy thinking</li>
          <li><strong>NITI Aayog structure and role:</strong> cooperative federalism, indices, and support to states</li>
          <li><strong>Demographics and employment:</strong> population trends, workforce participation, and skill development needs</li>
          <li><strong>Infrastructure and growth link:</strong> transport, energy, and digital infrastructure as drivers of credit demand</li>
          <li><strong>Key economic reforms:</strong> liberalisation, privatisation, and recent structural changes in simple terms</li>
        </ul>
        <h2>Module B: Economic Concepts Related to Banking</h2>
        <p>Module B connects textbook economics to banking decisions. Read slowly and link every concept to interest rates, deposits, or loans.</p>
        <ul>
          <li><strong>National income aggregates:</strong> GDP, GNP, per capita income, and nominal versus real growth</li>
          <li><strong>Business cycles and growth:</strong> expansion, slowdown, and how banks adjust lending through cycles</li>
          <li><strong>Money supply and credit creation:</strong> how deposits multiply and why reserve ratios matter</li>
          <li><strong>Monetary policy tools:</strong> repo, reverse repo, CRR, SLR, and open market operations in plain language</li>
          <li><strong>Inflation and its control:</strong> causes, effects on savers and borrowers, and policy response</li>
          <li><strong>Fiscal policy essentials:</strong> revenue and capital budgets, deficits, and public debt basics</li>
        </ul>
        <h2>Module C: Indian Financial Architecture</h2>
        <p>Module C is the heart of the paper for bankers. It covers regulators, laws, and markets that govern your daily work.</p>
        <ul>
          <li><strong>Reserve Bank organisation and functions:</strong> monetary authority, currency management, and supervision</li>
          <li><strong>Banking Regulation Act 1949:</strong> licensing, shareholding, management, and powers to inspect and direct banks</li>
          <li><strong>Commercial banks, RRBs, and cooperative banks:</strong> structure, ownership, and distinct roles in inclusion</li>
          <li><strong>Development and specialised institutions:</strong> NABARD, SIDBI, EXIM Bank, and NHB support to priority sectors</li>
          <li><strong>SEBI, IRDAI, and PFRDA:</strong> who regulates securities, insurance, and pensions and why it matters</li>
          <li><strong>Money and capital markets:</strong> call money, treasury bills, shares, bonds, and mutual fund channels</li>
        </ul>
        <h2>Module D: Financial Products and Services</h2>
        <p>Module D is the most practical and scoring section. Most questions come directly from products you see at the branch or on mobile banking.</p>
        <ul>
          <li><strong>Deposit products:</strong> savings, current, term deposits, and special schemes for seniors and youth</li>
          <li><strong>Loan products:</strong> home, personal, vehicle, education, and MSME loans with basic features</li>
          <li><strong>Mutual funds and insurance:</strong> types of funds, risk levels, life and general insurance basics</li>
          <li><strong>Digital banking services:</strong> UPI, mobile banking, cards, and doorstep banking use cases</li>
          <li><strong>Remittance and forex services:</strong> inward and outward transfers, cards for travel, and exchange basics</li>
          <li><strong>Government schemes through banks:</strong> Jan Dhan, Mudra, Stand-Up India, and pension and insurance schemes</li>
        </ul>
        <h2>Latest Developments to Track in 2026</h2>
        <p>Current updates can turn a borderline score into a clear pass. Spend thirty minutes every week on these three streams and note one line for each news item.</p>
        <ul>
          <li><strong>RBI monetary policy:</strong> follow repo rate decisions, inflation remarks, and liquidity measures and link them to deposit and loan rates</li>
          <li><strong>UPI and digital banking:</strong> track new features in payments, CBDC pilots, fraud prevention steps, and financial inclusion drives</li>
          <li><strong>Union Budget and economic survey:</strong> note fiscal deficit targets, tax changes, capex push, and support for MSMEs and agriculture</li>
        </ul>
        <p>Do not chase daily market noise. Focus on stable concepts first, then add current facts as examples. In the final ten days, revise only your short notes and attempted mock questions.</p>
        <div className="not-prose bg-indigo-50 rounded-xl p-6 border border-indigo-200 my-6">
          <h3 className="text-lg font-bold text-indigo-900 mb-2">Practice These Topics Free</h3>
          <p className="text-gray-700 mb-4">Attempt module-wise IE and IFS quizzes with answers and explanations. Identify weak chapters and improve speed before the exam.</p>
          <a href="/practice-tests/ie-ifs" className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg">Start IE and IFS Practice →</a>
        </div>
        <h2>FAQs</h2>
        <h3>Which module of IE and IFS is the toughest?</h3>
        <p>Most learners find Module B tough at first because it has economic terms and policy tools. Once you link each tool to deposits and lending with simple examples, it becomes scoring. Module C is lengthy but familiar to bankers, so regular revision makes it manageable.</p>
        <h3>How much current affairs is needed for IE and IFS?</h3>
        <p>Concepts carry the highest weight, while current updates help in fifteen to twenty percent of questions. Cover the last six months of RBI policy, Budget highlights, and major digital banking developments. Avoid deep data and focus on roles, reasons, and implications.</p>
        <h3>Is IE and IFS numericals-heavy?</h3>
        <p>No, it is not calculation-heavy. You may see a few simple questions on GDP growth, inflation rates, or money concepts, but they test understanding rather than formulas. Practice basic interpretations and read tables carefully instead of memorising complex derivations.</p>
        <h3>What is a smart pass strategy for 30 days?</h3>
        <p>Give ten days each to Modules A and B plus C, and seven days to Module D with daily quizzes. Keep three days for full mocks and revision of short notes. Study two hours daily, revise previous topics every Sunday, and practise at least 50 questions per module each week.</p>
        <h3>Where can I practice IE and IFS topics for free?</h3>
        <p>You can start with free module-wise practice sets that cover all four modules with explanations. Attempt topic tests after each chapter, review mistakes in a notebook, and finish with timed mocks to build confidence for the final paper.</p>
      </div>
    ),
  },
  {
    slug: 'jaiib-ppb-important-topics-2026',
    title: 'JAIIB PPB Important Topics 2026 — Module-Wise High-Priority Areas',
    description: 'Explore JAIIB PPB important topics 2026 module-wise. Master NI Act, KYC, NPAs and banking tech with smart tips to clear Principles and Practices easily.',
    date: '2026-09-13',
    readTime: '10 min read',
    category: 'Study Strategy',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6e?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">Principles and Practices of Banking, known as PPB, is the most practical paper of JAIIB 2026. It reflects what you do at the counter, in the credit section, and on digital channels every day. If you organise your study around real branch situations, Acts, and processes, you can convert experience into marks. This guide lists high-priority topics and module-wise areas to help you plan smartly and pass with confidence.</p>
        <div className="not-prose bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 my-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div><div className="text-2xl font-bold text-blue-900">760</div><div className="text-sm text-gray-600">Practice Questions</div></div>
            <div><div className="text-2xl font-bold text-blue-900">4</div><div className="text-sm text-gray-600">Modules Covered</div></div>
            <div><div className="text-2xl font-bold text-blue-900">100</div><div className="text-sm text-gray-600">Total Marks</div></div>
            <div><div className="text-2xl font-bold text-blue-900">50</div><div className="text-sm text-gray-600">Marks to Pass</div></div>
          </div>
        </div>
        <h2>Paper Overview: What PPB Really Tests</h2>
        <p>PPB is Paper 2 of JAIIB. It carries 100 marks with 50 marks needed to pass and covers four modules on banking operations, functions of banks, banking technology, and ethics. Questions are objective and often framed as small case studies from branch working, such as account opening, cheque payment, loan documentation, or digital transactions.</p>
        <p>The paper rewards bankers who know procedures, precautions, and customer rights clearly. Mugging up sections rarely helps unless you understand the logic behind each rule. For example, KYC norms exist to verify identity and track risk, while crossing of cheques exists to ensure safe payment. When you study with this cause-and-effect view, answers become intuitive even under exam pressure.</p>
        <h2>High-Priority Topics for 2026</h2>
        <p>Start with these eleven areas. They cover the core of operations, credit, technology, and compliance that examiners favour every session.</p>
        <ul>
          <li><strong>KYC norms:</strong> why identity and address verification protects banks and customers from fraud</li>
          <li><strong>NI Act 1881 essentials:</strong> why cheques, crossing, and endorsement rules ensure safe and valid payment</li>
          <li><strong>Banker-customer relationship:</strong> why debtor-creditor and agent roles decide rights and duties</li>
          <li><strong>Loans and advances:</strong> why mortgage, pledge, and hypothecation differ in possession and security</li>
          <li><strong>Priority sector lending:</strong> why targets for agriculture and MSMEs guide inclusive credit flow</li>
          <li><strong>NPA classification and SARFAESI:</strong> why asset norms and recovery powers keep bank balance sheets healthy</li>
          <li><strong>Core banking and CBS:</strong> why centralised processing changed service delivery and controls</li>
          <li><strong>RTGS, NEFT, IMPS, and UPI:</strong> why each payment system suits different speed and value needs</li>
          <li><strong>Cyber security and IT Act:</strong> why safe digital practices and legal backing matter for banks</li>
          <li><strong>Banking Ombudsman scheme:</strong> why grievance redressal builds trust and accountability</li>
          <li><strong>PMLA and AML-KYC compliance:</strong> why reporting and monitoring duties prevent misuse of banking channels</li>
        </ul>
        <p>Revise these with real examples from your branch. Write one practical instance for each rule and you will recall it faster in the exam hall.</p>
        <h2>Module A: General Banking Operations</h2>
        <p>Module A covers deposits, account handling, and payment instruments. Accuracy and procedure are the key themes here.</p>
        <ul>
          <li><strong>Types of customers and accounts:</strong> individuals, minors, joint holders, firms, companies, and trusts with opening rules</li>
          <li><strong>KYC and account opening:</strong> documents, risk categories, periodic updation, and simplified norms for small accounts</li>
          <li><strong>Banker-customer relationship:</strong> general and special relations, lien, set-off, and confidentiality duties</li>
          <li><strong>Cheques under NI Act:</strong> essentials of valid cheques, crossing types, endorsement, and dishonour procedures</li>
          <li><strong>Payment and collection duties:</strong> precautions for paying and collecting bankers and protection available</li>
          <li><strong>Grievance handling basics:</strong> complaint registration, resolution timelines, and escalation channels</li>
        </ul>
        <h2>Module B: Functions of Banks</h2>
        <p>Module B focuses on lending, credit monitoring, and support services. It is high-scoring if you master security types and recovery steps.</p>
        <ul>
          <li><strong>Principles of lending:</strong> safety, liquidity, profitability, and appraisal of character and cash flows</li>
          <li><strong>Types of charges:</strong> pledge, hypothecation, mortgage, assignment, and lien with practical differences</li>
          <li><strong>Documentation and monitoring:</strong> key loan documents, inspection, stock statements, and end-use checks</li>
          <li><strong>Priority sector norms:</strong> categories, sub-targets, and weaker section provisions in simple form</li>
          <li><strong>NPA norms and provisioning:</strong> classification, upgradation, and basic provisioning logic</li>
          <li><strong>Recovery tools including SARFAESI:</strong> notices, possession steps, Lok Adalats, and one-time settlement basics</li>
        </ul>
        <h2>Module C: Banking Technology</h2>
        <p>Module C covers digital systems that power modern banking. Focus on use cases, limits, and safety rather than technical depth.</p>
        <ul>
          <li><strong>Core banking solution:</strong> centralised data, anywhere banking, and improved audit and control</li>
          <li><strong>Payment systems:</strong> RTGS, NEFT, IMPS, UPI, NACH, and cards with timing and value differences</li>
          <li><strong>Delivery channels:</strong> ATMs, internet banking, mobile apps, and business correspondents</li>
          <li><strong>Cyber security essentials:</strong> passwords, OTP safety, phishing awareness, and secure practices</li>
          <li><strong>IT Act and data protection:</strong> legal validity of electronic records and duties to protect customer data</li>
          <li><strong>Fintech and future trends:</strong> API banking, digital onboarding, and analytics support to decisions</li>
        </ul>
        <h2>Module D: Ethics in Banking</h2>
        <p>Module D is short but valuable for quick marks. It tests values, fair conduct, and redressal systems every banker should know.</p>
        <ul>
          <li><strong>Ethics and values:</strong> honesty, fairness, transparency, and conflict handling in daily work</li>
          <li><strong>Fair practices code:</strong> clear communication on charges, timelines, and loan terms to customers</li>
          <li><strong>Grievance redressal system:</strong> internal committees, nodal officers, and escalation matrix</li>
          <li><strong>Banking Ombudsman framework:</strong> grounds for complaints, process flow, and award nature</li>
          <li><strong>Customer rights and education:</strong> right to privacy, suitability, and awareness about fraud prevention</li>
          <li><strong>Whistle-blower and vigilance:</strong> reporting channels and protection principles in banks</li>
        </ul>
        <h2>Latest Developments to Track in 2026</h2>
        <p>PPB examples increasingly reflect digital and compliance updates. A light weekly review keeps you ready for case-based questions.</p>
        <ul>
          <li><strong>RBI customer service standards:</strong> revised turnaround times, compensation for failed transactions, and safe digital practices</li>
          <li><strong>UPI and fraud control:</strong> new limits, verification features, reporting methods, and customer awareness drives</li>
          <li><strong>Compliance focus:</strong> stronger KYC refresh drives, PMLA reporting discipline, and updated Ombudsman directions</li>
        </ul>
        <p>Link each update to a module. For instance, connect a UPI safety feature to Module C and a grievance timeline to Module D. This habit helps in scenario questions.</p>
        <div className="not-prose bg-indigo-50 rounded-xl p-6 border border-indigo-200 my-6">
          <h3 className="text-lg font-bold text-indigo-900 mb-2">Practice These Topics Free</h3>
          <p className="text-gray-700 mb-4">Try free PPB quizzes on operations, credit, technology, and ethics with clear explanations. Build speed and fix weak areas fast.</p>
          <a href="/practice-tests/ppb" className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg">Start PPB Practice →</a>
        </div>
        <h2>FAQs</h2>
        <h3>Which module of PPB is most scoring?</h3>
        <p>Module A and Module D are usually most scoring because they are logical and experience-based. Module B needs careful study of charge types and NPA rules, while Module C is scoring if you learn payment systems through comparison tables and daily use examples.</p>
        <h3>How important is the NI Act for PPB?</h3>
        <p>Very important. Expect questions on valid cheques, types of crossing, endorsement, and liability on dishonour. Learn each concept with a small example, such as what happens when a crossed cheque is presented at the counter, to avoid confusion in options.</p>
        <h3>How do I remember Acts and years easily?</h3>
        <p>Group them by purpose rather than year alone. Link NI Act 1881 to payments, SARFAESI 2002 to recovery, and PMLA 2002 to money laundering prevention. Make a one-page chart with Act, purpose, and one branch example, and revise it twice a week.</p>
        <h3>How should I handle case-study questions?</h3>
        <p>Read the last line first to know what is asked, then scan the facts. Apply the basic rule instead of guessing from memory of exceptions. Eliminate options that violate customer rights or safety precautions, then choose the most compliant and practical answer.</p>
        <h3>Where can I practice PPB questions for free?</h3>
        <p>You can practise with free module-wise PPB tests that mirror exam patterns with answers and logic. Start topic-wise, note your errors, and finish with full-length timed sets to improve accuracy and time management before the exam.</p>
      </div>
    ),
  },
  {
    slug: 'jaiib-afm-important-topics-2026',
    title: 'JAIIB AFM Important Topics 2026 — Module-Wise High-Priority Areas',
    description: 'Explore JAIIB AFM important topics for 2026 with module-wise priority areas, key formulas, accounting concepts and smart tips to cross fifty marks confidently.',
    date: '2026-09-13',
    readTime: '10 min read',
    category: 'Study Strategy',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">Accounting and Financial Management feels different from other JAIIB papers because numbers decide your result. If you understand basic logic, remember formulas with clarity, and solve short numericals regularly, AFM can become your highest scoring paper in the 2026 attempt with steady practice.</p>
        <div className="not-prose bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 my-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">1,187</div>
              <div className="text-blue-100 text-sm mt-1">Practice Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold">Numerical</div>
              <div className="text-blue-100 text-sm mt-1">Calculation Heavy Paper</div>
            </div>
            <div>
              <div className="text-3xl font-bold">100</div>
              <div className="text-blue-100 text-sm mt-1">Total Marks</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50</div>
              <div className="text-blue-100 text-sm mt-1">Marks To Pass</div>
            </div>
          </div>
        </div>
        <h2>Paper Overview</h2>
        <p>AFM is widely seen as the numerical paper of JAIIB. It combines basic accounting, reading of financial statements, financial management, and selected ideas from taxation and costing. Questions test whether you can apply a formula correctly, interpret a ratio, prepare a simple adjustment, or choose the right method for a business decision. Theory alone is not enough here.</p>
        <p>For 2026, expect a balanced mix of concept based questions and small calculation based questions. Most numericals are short and can be solved in one or two steps if your formula is clear. Long and confusing calculations are rare. Your main advantage comes from speed, accuracy, and regular revision of formulas, formats, and key definitions across all four modules.</p>
        <h2>High-Priority Topics For 2026</h2>
        <p>These ten areas appear again and again in practice sets and past trends. Give them extra time because they connect theory with numerical problem solving and help you score quickly.</p>
        <ul>
          <li><strong>Ratio analysis:</strong> why it matters for judging liquidity, solvency, activity, and profitability from limited data.</li>
          <li><strong>Capital budgeting NPV and IRR:</strong> why it matters for selecting projects using discounted cash flow methods.</li>
          <li><strong>Time value of money:</strong> why it matters because compounding and discounting form the base of almost all financial decisions.</li>
          <li><strong>Working capital management:</strong> why it matters for maintaining daily liquidity through stock, debtors, and creditors.</li>
          <li><strong>Cost of capital:</strong> why it matters for finding the minimum return a company must earn on its funds.</li>
          <li><strong>Leverage:</strong> why it matters for understanding how debt changes profit, risk, and shareholder returns.</li>
          <li><strong>Break-even analysis:</strong> why it matters for finding the sales level where total revenue equals total cost.</li>
          <li><strong>Marginal costing:</strong> why it matters for decisions on pricing, product mix, make or buy, and shutdown points.</li>
          <li><strong>Cash flow statement AS-3:</strong> why it matters for tracking operating, investing, and financing flows correctly.</li>
          <li><strong>GST basics:</strong> why it matters for input credit, supply rules, registration limits, and simple tax calculation.</li>
        </ul>
        <h2>Accounting Principles</h2>
        <p>This foundation block decides how comfortable you feel with the rest of the paper. Once journal entries, ledger posting, and trial balance logic are clear, later chapters on depreciation, reconciliation, and final accounts become much easier to handle under exam pressure.</p>
        <ul>
          <li><strong>Journal, ledger and trial balance:</strong> learn debit and credit rules, posting flow, and how errors affect agreement of balances.</li>
          <li><strong>Depreciation methods:</strong> practise straight line and written down value methods with focus on rate, life, and residual value.</li>
          <li><strong>Bank reconciliation statement:</strong> understand timing differences like uncleared cheques, direct credits, and bank charges.</li>
          <li><strong>Accounting concepts and conventions:</strong> revise going concern, accrual, consistency, prudence, and matching with simple examples.</li>
          <li><strong>Rectification of errors:</strong> focus on one sided and two sided errors and their effect on profit and trial balance.</li>
          <li><strong>Partnership accounts basics:</strong> revise profit sharing, fixed and fluctuating capital, interest on capital, and goodwill treatment.</li>
        </ul>
        <h2>Financial Statements</h2>
        <p>This section tests whether you can read what a company is really saying through its statements. Focus on format, sequence, and meaning rather than rote learning. If you can link profit, balance sheet strength, cash movement, and ratios together, many objective questions become direct and scoring.</p>
        <ul>
          <li><strong>Profit and loss statement:</strong> study format, operating and net profit layers, and treatment of common adjustments.</li>
          <li><strong>Balance sheet structure:</strong> revise order of assets and liabilities, equity components, and reading of reserves and provisions.</li>
          <li><strong>Cash flow preparation:</strong> practise classification into operating, investing, and financing activities with indirect method logic.</li>
          <li><strong>Ratio interpretation:</strong> focus on current ratio, quick ratio, debt equity ratio, stock turnover, and return on capital employed.</li>
          <li><strong>Fund flow basics:</strong> understand sources and uses of funds and change in working capital with simple schedules.</li>
          <li><strong>Window dressing and limitations:</strong> learn how policy choices and one time items can change reported profits and ratios.</li>
        </ul>
        <h2>Financial Management</h2>
        <p>This is the heart of AFM scoring. Every formula has a clear story behind it. If you first understand why a formula exists, you will remember it longer and apply it faster. Revise one formula family at a time and solve five to ten short questions immediately after learning it.</p>
        <ul>
          <li><strong>Compounding and discounting:</strong> master present value, future value, annuity, and effective rate with timeline diagrams.</li>
          <li><strong>Investment appraisal:</strong> compare payback, accounting rate of return, net present value, profitability index, and internal rate of return.</li>
          <li><strong>Cost of debt, equity and weighted average:</strong> learn tax adjustment on debt, dividend growth model, and weight selection logic.</li>
          <li><strong>Operating and financial leverage:</strong> understand degree of leverage, break-even linkage, and impact on earnings variability.</li>
          <li><strong>Dividend theories:</strong> revise relevance and irrelevance views, Walter and Gordon models, and factors shaping payout policy.</li>
          <li><strong>Working capital cycle:</strong> practise operating cycle, cash conversion period, and estimation of working capital needs.</li>
        </ul>
        <h2>Taxation and Costing</h2>
        <p>The last block is factual but highly scoring because questions are usually direct. Keep a one page sheet for tax slabs logic, deduction names, GST limits, cost terms, and budget types. Short daily revision works better than reading this portion only once before the exam.</p>
        <ul>
          <li><strong>Income tax basics for individuals:</strong> focus on residential status idea, salary and house property heads, deductions, and TDS outline.</li>
          <li><strong>GST framework:</strong> revise supply concept, intra state and inter state levy, input tax credit flow, and return filing basics.</li>
          <li><strong>Cost classification:</strong> learn fixed, variable, direct, indirect, sunk, opportunity, and conversion cost with banking examples.</li>
          <li><strong>Marginal costing decisions:</strong> practise contribution, profit volume ratio, break-even point, margin of safety, and limiting factor cases.</li>
          <li><strong>Budgets and control:</strong> revise cash budget, flexible budget, zero based budgeting, and variance idea in simple terms.</li>
          <li><strong>Standard costing outline:</strong> understand standard, actual, and variance linkage without going into lengthy advanced problems.</li>
        </ul>
        <h2>Formula-First Strategy That Saves Marks</h2>
        <p>Always write the formula before substituting values, even in rough work. This habit prevents mix-ups between similar formulas like present value annuity and future value annuity, or operating leverage and financial leverage. In the exam, first identify what is asked, recall the exact formula, then place the numbers carefully with units.</p>
        <p>Maintain a personal formula register with three columns: formula, meaning of each symbol, and one common mistake. Revise it for fifteen minutes daily in the last month. Solve mixed sets under time limits so you learn to switch quickly from accounting to costing to financial management without losing rhythm.</p>
        <div className="not-prose bg-indigo-50 rounded-xl p-6 border border-indigo-200 my-6">
          <h3 className="text-lg font-bold text-indigo-900 mb-2">Practice These Topics Free</h3>
          <p className="text-gray-700 mb-4">Attempt module-wise AFM quizzes with solutions and track your accuracy on ratios, budgeting, and costing questions.</p>
          <a href="/practice-tests/afm" className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg">Start AFM Practice →</a>
        </div>
        <h2>FAQs</h2>
        <h3>Is AFM the toughest paper in JAIIB?</h3>
        <p>Many learners feel so because it has calculations, but it is also the most scoring paper once formulas are clear. Regular short practice removes fear faster than only reading theory. Start with easy chapters like depreciation and ratios to build confidence early.</p>
        <h3>Is a calculator allowed in the AFM exam?</h3>
        <p>An online calculator is generally available in the exam interface for basic computation. Still, practise mental steps for percentages, ratios, and discount factors so you save time. Learn to round sensibly and verify whether your answer looks logical before marking it.</p>
        <h3>How many numericals can I expect?</h3>
        <p>A large share of questions involve small calculations or formula application, while the rest test concepts and definitions. Expect frequent short numericals from time value, ratios, leverage, break-even, and working capital. Lengthy multi-step problems are limited, so speed on basics matters more.</p>
        <h3>How should I revise formulas in the last two weeks?</h3>
        <p>Use a single formula notebook and revise it in short loops. Group similar formulas together, write one solved example beside each, and mark formulas where you make repeated errors. Attempt one mixed quiz daily and rework only the questions you got wrong.</p>
        <h3>Where can I practise AFM topics for free?</h3>
        <p>You can start with free module-wise quizzes that cover accounting, statements, management, and costing with clear explanations. Regular timed attempts will show your weak areas and improve accuracy before the 2026 exam.</p>
      </div>
    ),
  },
  {
    slug: 'jaiib-rbwm-important-topics-2026',
    title: 'JAIIB RBWM Important Topics 2026 — Module-Wise High-Priority Areas',
    description: 'Master JAIIB RBWM important topics for 2026 with module-wise priorities, retail products, recovery rules, marketing basics and wealth management made simple.',
    date: '2026-09-13',
    readTime: '10 min read',
    category: 'Study Strategy',
    coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">Retail Banking and Wealth Management is the newest and most practical paper in JAIIB. It blends day to day banking products, recovery rules, marketing ideas, and basic wealth planning. With smart module-wise focus and regular fact revision, you can finish the syllabus faster and score well in 2026.</p>
        <div className="not-prose bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 my-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold">634</div>
              <div className="text-blue-100 text-sm mt-1">Practice Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold">4</div>
              <div className="text-blue-100 text-sm mt-1">Modules To Cover</div>
            </div>
            <div>
              <div className="text-3xl font-bold">100</div>
              <div className="text-blue-100 text-sm mt-1">Total Marks</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50</div>
              <div className="text-blue-100 text-sm mt-1">Marks To Pass</div>
            </div>
          </div>
        </div>
        <h2>Paper Overview</h2>
        <p>RBWM brings together retail asset and liability products, customer service and recovery processes, marketing of banking services, and introductory wealth management. The language is simple, but the syllabus is wide. Many questions are factual and statement based, so careful reading and recall of limits, features, and institutional roles make a clear difference.</p>
        <p>For 2026, expect strong weightage for housing loans, cards, microfinance, recovery channels, marketing mix, and mutual fund and insurance basics. Caselets may describe a customer need and ask for the right product or the next step in recovery. Prepare with short notes, feature tables, and daily revision of factual points.</p>
        <h2>High-Priority Topics For 2026</h2>
        <p>Start with these high return areas. They cover customer facing products, risk and recovery, and simple investment ideas that examiners like to test through direct and application style questions.</p>
        <ul>
          <li><strong>Home loans:</strong> why they matter for LTV norms, documentation, PMAY support, and long tenure risk assessment.</li>
          <li><strong>Credit and debit cards:</strong> why they matter for billing cycles, limits, overline rules, fraud care, and fee based income.</li>
          <li><strong>Education and gold loans:</strong> why they matter for moratorium, collateral norms, margin, and priority sector linkage.</li>
          <li><strong>Microfinance and SHGs:</strong> why they matter for joint liability, Bank linkage model, and financial inclusion goals.</li>
          <li><strong>Recovery channels:</strong> why they matter for Lok Adalat, DRT, SARFAESI action, and one time settlement choices.</li>
          <li><strong>Marketing concepts and CRM:</strong> why they matter for segmentation, targeting, service quality, and long term loyalty.</li>
          <li><strong>Cross-selling:</strong> why it matters for deepening relationships while matching the right product to customer needs.</li>
          <li><strong>Mutual fund types:</strong> why they matter for equity, debt, hybrid, NAV logic, and expense and exit load basics.</li>
          <li><strong>Portfolio basics and risk profiling:</strong> why they matter for matching age, goals, horizon, and risk appetite correctly.</li>
          <li><strong>Insurance and retirement planning:</strong> why they matter for term and endowment difference, pension needs, and nomination clarity.</li>
          <li><strong>NRI banking:</strong> why it matters for account types, repatriation rules, and suitable deposit and remittance options.</li>
        </ul>
        <h2>Module A: Retail Banking</h2>
        <p>This module builds your view of retail business models, delivery channels, and customer handling. Focus on how banks source retail business, score risk, price products, and serve customers across branches and digital touchpoints.</p>
        <ul>
          <li><strong>Retail banking evolution:</strong> learn drivers of growth, liability and asset focus, and advantages of granular retail books.</li>
          <li><strong>Business models and channels:</strong> revise branch, DSA, digital onboarding, mobile banking, and doorstep service roles.</li>
          <li><strong>Customer onboarding and KYC:</strong> focus on account opening, CKYC, risk categorisation, and periodic updation needs.</li>
          <li><strong>Credit scoring and appraisal:</strong> understand CIBIL inputs, income assessment, obligation ratio, and verification steps.</li>
          <li><strong>Customer service and grievance:</strong> study charter points, complaint handling levels, and turnaround discipline in retail.</li>
          <li><strong>Retail risk overview:</strong> learn delinquency signals, early warning triggers, and portfolio monitoring basics.</li>
        </ul>
        <h2>Module B: Retail Products and Recovery</h2>
        <p>This is the most factual and scoring module. Make one table per product with purpose, eligibility, margin, security, repayment, and special scheme points. For recovery, remember thresholds, authority levels, and sequence of action rather than learning long legal text.</p>
        <ul>
          <li><strong>Housing and vehicle loans:</strong> revise LTV, tenure, equated instalment logic, prepayment norms, and PMAY assistance idea.</li>
          <li><strong>Personal, education and gold loans:</strong> focus on end use checks, moratorium, co-borrower norms, and valuation and custody care.</li>
          <li><strong>Cards and digital credit:</strong> learn card types, billing and grace logic, minimum due effect, and safe usage practices.</li>
          <li><strong>Microfinance, SHG and joint liability:</strong> revise group models, Bank linkage flow, and social and financial discipline.</li>
          <li><strong>NRI products:</strong> study account categories, permitted credits and debits, deposit choices, and remittance facility features.</li>
          <li><strong>Recovery toolkit:</strong> compare Lok Adalat, DRT process, SARFAESI steps, OTS policy, and compromise settlement selection.</li>
        </ul>
        <h2>Module C: Marketing of Banking Services</h2>
        <p>Marketing in banks is about trust, clarity, and service consistency. Questions often test definitions and small situations. Learn terms with one banking example each so you can answer even twisted statements with confidence.</p>
        <ul>
          <li><strong>Core marketing ideas:</strong> revise needs and wants, value, exchange, segmentation, targeting, and positioning with examples.</li>
          <li><strong>Marketing mix for services:</strong> learn product, price, place, promotion plus people, process, and physical evidence.</li>
          <li><strong>CRM and loyalty:</strong> understand customer lifetime value, retention cost logic, feedback loops, and complaint to loyalty conversion.</li>
          <li><strong>Cross-selling and upselling:</strong> focus on need discovery, suitability, disclosure discipline, and mis-selling avoidance.</li>
          <li><strong>Digital marketing basics:</strong> study website, app, social, and campaign metrics like conversion and engagement in brief.</li>
          <li><strong>Service quality gaps:</strong> learn reliability, assurance, tangibles, empathy, and responsiveness with branch illustrations.</li>
        </ul>
        <h2>Module D: Wealth Management</h2>
        <p>This module needs concept clarity more than deep finance maths. Learn how risk, return, horizon, and goals connect. Focus on product features, suitability, and investor protection rather than complex valuation models.</p>
        <ul>
          <li><strong>Wealth stages and goals:</strong> map accumulation, preservation, and distribution needs to age and income stability.</li>
          <li><strong>Risk profiling:</strong> practise matching conservative, moderate, and aggressive profiles to suitable asset mixes.</li>
          <li><strong>Mutual funds and NAV:</strong> revise fund categories, systematic plans, benchmarks, loads, and reading of factsheet lines.</li>
          <li><strong>Bonds and deposits:</strong> understand tenure, coupon, yield idea, safety, and laddering for steady income needs.</li>
          <li><strong>Insurance planning:</strong> compare term, endowment, unit linked, and pension products with claim and nominee basics.</li>
          <li><strong>Retirement and estate basics:</strong> learn corpus estimation logic, withdrawal discipline, will essentials, and nominee versus heir distinction.</li>
        </ul>
        <h2>Smart Preparation Plan For RBWM</h2>
        <p>Finish Module B first because it gives fast marks through product features and recovery facts. Then complete Module A for context, Module C for marketing terms, and Module D for investment logic. Keep separate notebooks for limits, product tables, recovery thresholds, and marketing definitions.</p>
        <p>Revise facts in short daily loops and solve mixed quizzes every third day. For statement based questions, practise eliminating extreme words and checking each part of the sentence separately. In the final fortnight, focus on weak tables, solved caselets, and one full mock every week with error review.</p>
        <div className="not-prose bg-indigo-50 rounded-xl p-6 border border-indigo-200 my-6">
          <h3 className="text-lg font-bold text-indigo-900 mb-2">Practice These Topics Free</h3>
          <p className="text-gray-700 mb-4">Try free RBWM quizzes on retail products, recovery, marketing, and wealth basics with clear answer explanations.</p>
          <a href="/practice-tests/rbwm" className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg">Start RBWM Practice →</a>
        </div>
        <h2>FAQs</h2>
        <h3>RBWM is the newest paper, what should I expect?</h3>
        <p>Expect practical and factual questions on products, service, recovery, marketing, and basic investments. Language is usually direct, with some caselets on product choice and recovery steps. Tables for features and limits plus regular quizzes will keep you exam ready.</p>
        <h3>Which module is the most factual?</h3>
        <p>Module B on retail products and recovery has the highest factual density because each loan and card has its own norms. Prepare product-wise tables and revise recovery channels through comparison charts. This module rewards repeated short revision more than long single sittings.</p>
        <h3>How important are recovery provisions?</h3>
        <p>Recovery is very important because banks focus strongly on collection discipline and resolution options. Learn Lok Adalat suitability, DRT coverage, SARFAESI sequence, and OTS decision factors. Questions often ask which channel fits a given loan size and security position.</p>
        <h3>How much depth is needed for wealth management?</h3>
        <p>You need working knowledge, not adviser level depth. Focus on risk profiling, asset suitability, mutual fund categories, insurance differences, and retirement basics. Understand what suits whom and why, rather than memorising complex formulas or market theories.</p>
        <h3>Where can I practise RBWM for free?</h3>
        <p>You can begin with free module-wise RBWM quizzes that mirror the exam pattern and explain each answer simply. Attempt them topic by topic, then move to mixed sets and full mocks as your accuracy improves for 2026.</p>
      </div>
    ),
  },
  {
    slug: 'jaiib-rbwm-preparation-guide-2026',
    title: 'JAIIB RBWM Paper Preparation Guide 2026 — Retail Banking & Wealth Management',
    description: 'Complete preparation guide for JAIIB Paper 4 (RBWM) covering retail products, recovery mechanisms, marketing concepts, and wealth management with topic-wise strategy.',
    date: '2026-06-01',
    readTime: '12 min read',
    category: 'Study Strategy',
    coverImage: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          RBWM (Retail Banking & Wealth Management) is the newest JAIIB paper, introduced when IIBF moved from 3 to 4 papers in 2023. Many candidates underestimate it because the topics seem &quot;easy&quot; — but the exam tests specific regulatory limits, product features, and recovery procedures that require focused preparation.
        </p>

        <h2>Why RBWM is Different from Other Papers</h2>
        <p>
          Unlike IE&IFS (theory-heavy) or AFM (calculation-heavy), RBWM is a practical paper. It tests your knowledge of products you encounter daily at the branch — home loans, credit cards, mutual funds, insurance. The challenge is that IIBF tests <strong>specific regulatory details</strong> rather than general awareness. For example, knowing that &quot;home loans exist&quot; won&apos;t help — you need to know the exact LTV ratios, PMAY subsidy percentages, and NHB guidelines.
        </p>

        <h2>Module A — Retail Banking (25-30%)</h2>
        <p>This module covers the entire spectrum of retail banking products offered by commercial banks to individual customers.</p>

        <h3>Key Topics to Master</h3>
        <ul>
          <li><strong>Home Loans:</strong> LTV ratios (75-90% based on loan amount), PMAY subsidy (6.5% for EWS/LIG, 4% for MIG-I, 3% for MIG-II), NHB refinance, fixed vs floating rates, teaser rates controversy</li>
          <li><strong>Auto Loans:</strong> Maximum tenure (7 years), margin requirements, hypothecation vs pledge, RC book endorsement</li>
          <li><strong>Personal Loans:</strong> Unsecured lending norms, FOIR (Fixed Obligation to Income Ratio) calculation, prepayment penalty rules (RBI: no penalty on floating rate loans)</li>
          <li><strong>Credit Cards:</strong> Billing cycle, minimum due (5% of outstanding), interest-free period (20-50 days), RBI guidelines on unsolicited cards, credit card settlement norms</li>
          <li><strong>NRI Banking:</strong> NRE account (repatriable, tax-free interest), NRO account (non-repatriable, taxable), FCNR deposits (foreign currency, repatriable), LRS limit ($250,000 per year)</li>
          <li><strong>Debit Cards:</strong> Daily transaction limits, liability shift rules for fraudulent transactions, RBI zero-liability policy (report within 3 days)</li>
        </ul>

        <h3>Common Exam Questions from Module A</h3>
        <p>IIBF frequently asks statement-based questions like: &quot;Which of the following statements about home loans are correct? (I) Maximum LTV for loans above ₹75 lakh is 75% (II) PMAY subsidy is available for all income groups (III) Prepayment penalty cannot be charged on floating rate loans (IV) Home loan interest is deductible under Section 24(b)&quot;</p>

        <h2>Module B — Retail Products & Recovery (25-30%)</h2>
        <p>This module covers specialized retail products and the entire recovery mechanism framework.</p>

        <h3>Recovery Mechanisms (Heavily Tested)</h3>
        <ul>
          <li><strong>SARFAESI Act 2002 (in retail context):</strong> Applicable for secured loans above ₹1 lakh, 60-day notice under Section 13(2), not applicable to agricultural land, security interest must be registered with CERSAI</li>
          <li><strong>DRT (Debts Recovery Tribunal):</strong> For debts above ₹20 lakh, appeal to DRAT within 45 days, presiding officer is a judicial member</li>
          <li><strong>Lok Adalat:</strong> For NPA up to ₹20 lakh, no court fee, decision is binding and non-appealable, both parties must consent</li>
          <li><strong>One-Time Settlement (OTS):</strong> Bank&apos;s internal policy, typically 60-80% of outstanding, time-bound (usually 90 days to pay), no legal compulsion on bank to offer</li>
        </ul>

        <h3>Other Key Products</h3>
        <ul>
          <li><strong>Education Loans:</strong> No collateral up to ₹7.5 lakh, moratorium period (course + 1 year), interest subsidy for economically weaker (Central Scheme), Vidyalakshmi portal</li>
          <li><strong>Gold Loans:</strong> LTV maximum 75% (as per RBI), tenure typically 12 months, auction after default notice, NBFC gold loan rules vs bank rules</li>
          <li><strong>MUDRA Loans:</strong> Shishu (up to ₹50,000), Kishore (₹50,000-₹5 lakh), Tarun (₹5-₹10 lakh), no collateral required, available at all PSU bank branches</li>
          <li><strong>Microfinance:</strong> Maximum household income ₹3 lakh, loan limit 50% of household income, no collateral, maximum 2 MFI lenders per borrower</li>
        </ul>

        <h2>Module C — Marketing of Banking Services (20%)</h2>
        <p>This is often the lowest-weightage module but still contributes 15-20 questions. The content is more conceptual and easier to score.</p>

        <h3>Key Concepts</h3>
        <ul>
          <li><strong>7Ps of Services Marketing:</strong> Product, Price, Place, Promotion, People, Process, Physical Evidence — know how each applies to banking</li>
          <li><strong>CRM (Customer Relationship Management):</strong> Acquisition cost vs retention cost (5:1 ratio), customer lifetime value, cross-selling and up-selling strategies</li>
          <li><strong>Market Segmentation:</strong> Geographic, demographic, psychographic, behavioral segmentation in banking context</li>
          <li><strong>Digital Marketing in Banking:</strong> Social media guidelines for banks (RBI restrictions), SEO for bank products, mobile-first approach, chatbots and AI in customer service</li>
          <li><strong>Service Quality Models:</strong> SERVQUAL model (5 gaps), service recovery paradox, complaint handling as marketing opportunity</li>
        </ul>

        <h2>Module D — Wealth Management (20-25%)</h2>
        <p>Wealth management topics are increasingly important as banks push fee-based income. This module overlaps with some IE&IFS Module D content.</p>

        <h3>Must-Know Topics</h3>
        <ul>
          <li><strong>Mutual Funds:</strong> Open-ended vs closed-ended, equity/debt/hybrid categories, NAV calculation, entry/exit loads, SEBI categorization norms (2017), SIP vs lump sum</li>
          <li><strong>Insurance:</strong> Term vs whole life vs endowment, ULIP, health insurance (Section 80D), IRDAI MFTP guidelines, bancassurance model, claims settlement ratio</li>
          <li><strong>Financial Planning Process:</strong> Goal setting → data gathering → analysis → recommendation → implementation → review (6 steps)</li>
          <li><strong>Risk Profiling:</strong> Conservative/moderate/aggressive profiles, age-based asset allocation rule (100 - age = equity %), suitability assessment requirement</li>
          <li><strong>Tax Planning:</strong> Section 80C (₹1.5 lakh), Section 80D (₹25K/₹50K), Section 24(b) (₹2 lakh housing), NPS extra deduction (50K under 80CCD(1B))</li>
          <li><strong>Estate Planning:</strong> Will vs nomination, succession laws (Hindu/Muslim/Christian), power of attorney, trust structures for HNIs</li>
        </ul>

        <h2>Recommended Study Order</h2>
        <ol>
          <li><strong>Module B first</strong> — Recovery mechanisms (SARFAESI, DRT, Lok Adalat) are high-weightage and fact-based. Memorize thresholds and timelines.</li>
          <li><strong>Module A next</strong> — Retail products are practical. Focus on RBI regulatory limits (LTV, prepayment, NRI account rules).</li>
          <li><strong>Module D</strong> — Mutual funds and insurance are tested frequently. Know SEBI categorization and tax sections.</li>
          <li><strong>Module C last</strong> — Marketing concepts are conceptual and easier. Can be covered quickly in 2-3 days.</li>
        </ol>

        <h2>Pro Tips for RBWM Paper</h2>
        <ul>
          <li><strong>Overlap with PPB:</strong> About 20% of RBWM content overlaps with PPB Module B (loans, NPA, SARFAESI). If you study PPB well, RBWM becomes significantly easier.</li>
          <li><strong>Current RBI guidelines matter:</strong> Digital lending guidelines, credit card rules, and gold loan LTV norms are frequently updated. Check RBI website for latest Master Directions.</li>
          <li><strong>Real branch experience helps:</strong> If you work in retail branch, you already know most of Module A practically. Focus on the specific numbers and regulatory limits you might not have memorized.</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Practice RBWM Questions</h3>
          <p className="text-blue-800 mb-0">
            Our platform has 635+ RBWM questions covering all 4 modules. Each explanation cites specific RBI guidelines and IIBF textbook references so you learn the exact regulatory details tested in the exam.
          </p>
        </div>
      </div>
    ),
  },
  {
    slug: 'jaiib-exam-day-tips-dos-donts',
    title: 'JAIIB Exam Day Tips — 15 Dos and Don\'ts for the Online Test (2026)',
    description: 'Practical exam day advice for JAIIB 2026: what to carry, time management strategy during the test, how to handle statement-based questions, and common mistakes that cost marks.',
    date: '2026-06-05',
    readTime: '9 min read',
    category: 'Exam Tips',
    coverImage: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          You have studied for weeks, completed mock tests, and revised your notes. Now the exam is tomorrow. What you do in the 120 minutes of the actual test can make a 10-15 mark difference. Here are battle-tested exam day strategies from candidates who scored 70+ in all four papers.
        </p>

        <h2>Before the Exam (Morning of)</h2>

        <h3>What to Carry</h3>
        <ul>
          <li><strong>Admit card</strong> — printed copy (colour or black-and-white both accepted)</li>
          <li><strong>Photo ID</strong> — Aadhaar, PAN, Passport, Voter ID, or Bank ID card (must match name on admit card)</li>
          <li><strong>Nothing else</strong> — no phone, no calculator (on-screen calculator is provided), no notes, no watch (clock is on screen)</li>
        </ul>

        <h3>What NOT to Do in the Morning</h3>
        <ul>
          <li><strong>Do not study new topics</strong> — it creates confusion and anxiety. Only revise your formula sheet or rate card.</li>
          <li><strong>Do not panic about topics you haven&apos;t covered</strong> — focus on what you know. You need 50, not 100.</li>
          <li><strong>Eat a proper meal</strong> — the exam is 2 hours. Low blood sugar affects concentration.</li>
          <li><strong>Reach the centre 30 minutes early</strong> — biometric verification and seat allocation take time.</li>
        </ul>

        <h2>During the Exam — Time Management</h2>

        <p>100 questions in 120 minutes = 72 seconds per question on average. But not all questions deserve equal time.</p>

        <h3>The 40-30-30 Strategy</h3>
        <ul>
          <li><strong>First 40 minutes:</strong> Attempt the first 40 questions. These typically start easy. Don&apos;t spend more than 1 minute on any question. If unsure, mark it and move on.</li>
          <li><strong>Next 50 minutes:</strong> Questions 41-80. These are medium/hard. Allow up to 90 seconds each. For statement-based questions (I, II, III, IV format), read each statement carefully.</li>
          <li><strong>Last 30 minutes:</strong> Questions 81-100 + review marked questions. Use remaining time to revisit flagged questions.</li>
        </ul>

        <h3>How to Handle Statement-Based Questions</h3>
        <p>These carry 2 marks each and make up 40-50% of the paper. The format is: &quot;Consider the following statements: (I)... (II)... (III)... Which of the above is/are correct?&quot;</p>
        <ul>
          <li><strong>Read each statement independently</strong> — evaluate it as true/false on its own before looking at options</li>
          <li><strong>Look for absolutes</strong> — words like &quot;always&quot;, &quot;never&quot;, &quot;only&quot; are often indicators of incorrect statements</li>
          <li><strong>Check for subtle errors</strong> — IIBF often changes one number or one word to make a statement incorrect (e.g., &quot;CRR is maintained under Section 24&quot; — wrong, it is Section 42)</li>
          <li><strong>When in doubt, prefer &quot;I and III only&quot; type options</strong> — rarely are ALL statements correct or ALL incorrect</li>
        </ul>

        <h2>The 8 Dos for JAIIB Exam Day</h2>
        <ol>
          <li><strong>DO attempt every question</strong> — zero negative marking means leaving a question blank is throwing away marks. Even a random guess gives you 25% probability.</li>
          <li><strong>DO use the on-screen calculator for AFM</strong> — don&apos;t waste time doing mental math for NPV, EMI, or ratio calculations. The calculator is basic but functional.</li>
          <li><strong>DO flag difficult questions and return later</strong> — the exam interface allows you to mark questions for review. Use it aggressively.</li>
          <li><strong>DO read the question stem completely</strong> — many questions ask &quot;which is INCORRECT&quot; and candidates select the correct option by mistake.</li>
          <li><strong>DO check the progress bar</strong> — at the 60-minute mark, you should have attempted at least 50 questions. If not, speed up.</li>
          <li><strong>DO trust your first instinct</strong> — research shows that changing answers usually reduces your score. Only change if you are absolutely certain.</li>
          <li><strong>DO use elimination strategy</strong> — even eliminating 1 wrong option improves your odds from 25% to 33%.</li>
          <li><strong>DO review your answers in the last 10 minutes</strong> — specifically check: did you miss any question? Did you accidentally select the wrong option on any?</li>
        </ol>

        <h2>The 7 Don&apos;ts for JAIIB Exam Day</h2>
        <ol>
          <li><strong>DON&apos;T spend more than 2 minutes on any single question</strong> — if you can&apos;t solve it in 2 minutes, flag it and move on. 2 marks is not worth 5 minutes.</li>
          <li><strong>DON&apos;T leave numerical questions for last</strong> — AFM calculations are time-consuming. If you push them to the end, you will rush and make errors.</li>
          <li><strong>DON&apos;T second-guess yourself repeatedly</strong> — pick an answer, move on. Indecision wastes more time than wrong answers.</li>
          <li><strong>DON&apos;T panic if you don&apos;t know a question</strong> — even toppers get 10-15 questions they&apos;ve never seen. Guess and move on.</li>
          <li><strong>DON&apos;T change your answer unless you have a clear reason</strong> — studies show first answers are correct more often than changed answers.</li>
          <li><strong>DON&apos;T look at other candidates</strong> — each person gets a different randomised set. Their pace is irrelevant to yours.</li>
          <li><strong>DON&apos;T skip the last 5-10 questions due to time pressure</strong> — even if time is short, quickly select the most probable answer for each remaining question. Never submit with blanks.</li>
        </ol>

        <h2>Paper-Specific Tips</h2>

        <h3>IE & IFS</h3>
        <p>Current affairs questions appear in the first 20-30 questions. If you know the latest GDP data, RBI rates, and recent policy changes, these are quick marks. Module C (Acts and regulators) questions require precise section numbers.</p>

        <h3>PPB</h3>
        <p>KYC and NPA questions are almost guaranteed. Know the exact SMA timeline (1-30, 31-60, 61-90 days), SARFAESI threshold (₹1 lakh), and Banking Ombudsman compensation limit (₹20 lakh). Payment system limits (UPI, NEFT, RTGS) appear every time.</p>

        <h3>AFM</h3>
        <p>Start with ratio and BEP questions — they are fastest to solve. NPV/IRR calculations take longer, so do them in the middle 40-minute window. Don&apos;t waste time deriving formulas — either you know it or you guess and move on.</p>

        <h3>RBWM</h3>
        <p>Home loan LTV ratios, MUDRA categories (Shishu/Kishore/Tarun), and mutual fund types are tested heavily. Recovery mechanism questions (SARFAESI timeline, DRT threshold, Lok Adalat limit) overlap with PPB — score on these twice.</p>

        <h2>After the Exam</h2>
        <ul>
          <li>Results come in 4-6 weeks. Do not stress during this period.</li>
          <li>If you passed, start CAIIB preparation within 3 months while JAIIB knowledge is fresh.</li>
          <li>If one paper is borderline, don&apos;t assume the worst — IIBF sometimes gives 1-2 grace marks in close cases.</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Take a Full Mock Test Now</h3>
          <p className="text-blue-800 mb-0">
            Simulate the real exam experience with our 100-question, 120-minute mock tests. Practice time management and build confidence for exam day. Instant scoring with AI explanations.
          </p>
        </div>
      </div>
    ),
  },
  {
    slug: 'npa-classification-sarfaesi-act-explained',
    title: 'NPA Classification & SARFAESI Act Explained for JAIIB — Complete Guide with Examples',
    description: 'Detailed explanation of NPA classification (SMA-0 to Loss assets), SARFAESI Act 2002 provisions, DRT procedure, and Lok Adalat — with practical examples and exam-oriented comparison tables.',
    date: '2026-06-08',
    readTime: '14 min read',
    category: 'Deep Dive',
    coverImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6e?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          NPA (Non-Performing Asset) classification and the SARFAESI Act together account for 8-12 questions across PPB and RBWM papers. This is one of the highest-yielding topics in JAIIB — master it and you are almost guaranteed 15+ marks across both papers.
        </p>

        <h2>What is a Non-Performing Asset (NPA)?</h2>
        <p>
          An asset (loan/advance) becomes non-performing when it ceases to generate income for the bank. Specifically, a loan account is classified as NPA when the interest or instalment of principal remains overdue for more than 90 days. For agricultural loans, the timeline is different — it is linked to crop seasons.
        </p>
        <p>
          <strong>Key Point:</strong> &quot;Overdue&quot; means the amount is not paid on the due date fixed by the bank. If your EMI is due on the 5th of every month and you don&apos;t pay on the 5th, it becomes &quot;overdue&quot; from the 6th.
        </p>

        <h2>Pre-NPA Classification: Special Mention Accounts (SMA)</h2>
        <p>Before an account becomes NPA, RBI requires banks to classify it under the SMA (Special Mention Account) framework for early warning:</p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Category</th>
                <th className="border border-gray-300 p-3 text-left">Days Overdue</th>
                <th className="border border-gray-300 p-3 text-left">Action Required</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 p-3 font-bold text-blue-700">SMA-0</td><td className="border border-gray-300 p-3">1-30 days</td><td className="border border-gray-300 p-3">Internal monitoring, contact borrower</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3 font-bold text-orange-700">SMA-1</td><td className="border border-gray-300 p-3">31-60 days</td><td className="border border-gray-300 p-3">Report to CRILC (₹5 crore+), restructuring discussions</td></tr>
              <tr><td className="border border-gray-300 p-3 font-bold text-red-700">SMA-2</td><td className="border border-gray-300 p-3">61-90 days</td><td className="border border-gray-300 p-3">Mandatory CRILC reporting, resolution plan preparation</td></tr>
              <tr className="bg-red-50"><td className="border border-gray-300 p-3 font-bold text-red-900">NPA</td><td className="border border-gray-300 p-3">90+ days</td><td className="border border-gray-300 p-3">Classify as Sub-standard, begin provisioning</td></tr>
            </tbody>
          </table>
        </div>

        <p><strong>CRILC</strong> = Central Repository of Information on Large Credits. Banks must report weekly data for borrowers with aggregate exposure of ₹5 crore and above.</p>

        <h2>NPA Sub-Categories (Asset Classification)</h2>
        <p>Once classified as NPA, the account further deteriorates through these stages:</p>

        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Category</th>
                <th className="border border-gray-300 p-3 text-left">Duration as NPA</th>
                <th className="border border-gray-300 p-3 text-left">Provisioning Required</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 p-3 font-bold">Sub-Standard</td><td className="border border-gray-300 p-3">Up to 12 months as NPA</td><td className="border border-gray-300 p-3">15% (secured), 25% (unsecured)</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3 font-bold">Doubtful-1</td><td className="border border-gray-300 p-3">12-24 months as NPA</td><td className="border border-gray-300 p-3">25% of secured portion + 100% of unsecured</td></tr>
              <tr><td className="border border-gray-300 p-3 font-bold">Doubtful-2</td><td className="border border-gray-300 p-3">24-36 months as NPA</td><td className="border border-gray-300 p-3">40% of secured + 100% of unsecured</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3 font-bold">Doubtful-3</td><td className="border border-gray-300 p-3">Beyond 36 months</td><td className="border border-gray-300 p-3">100% of entire outstanding</td></tr>
              <tr className="bg-red-50"><td className="border border-gray-300 p-3 font-bold text-red-700">Loss Asset</td><td className="border border-gray-300 p-3">Identified as unrecoverable by bank/auditor/RBI</td><td className="border border-gray-300 p-3">100% write-off</td></tr>
            </tbody>
          </table>
        </div>

        <h3>Special Case: Agricultural Loans</h3>
        <p>For short-duration crops (up to one crop season for short crops), the account is classified as NPA if the instalment of principal or interest remains overdue for <strong>2 crop seasons</strong>. For long-duration crops, it is <strong>1 crop season</strong> from the due date. This is different from the standard 90-day rule.</p>

        <h2>SARFAESI Act 2002 — The Bank&apos;s Recovery Weapon</h2>
        <p>
          SARFAESI (Securitisation and Reconstruction of Financial Assets and Enforcement of Security Interest Act) gives banks the power to recover NPAs <strong>without going to court</strong>. It is the most powerful recovery tool available to secured creditors.
        </p>

        <h3>When Can SARFAESI Be Used?</h3>
        <ul>
          <li>Loan amount must be above <strong>₹1 lakh</strong></li>
          <li>Account must be classified as <strong>NPA</strong></li>
          <li>The bank must have a valid <strong>security interest</strong> (collateral)</li>
          <li><strong>NOT applicable</strong> to: agricultural land, loans below ₹1 lakh, security interest in aircraft/ships/vessels, unpledged assets</li>
        </ul>

        <h3>SARFAESI Process (Step by Step)</h3>
        <ol>
          <li><strong>Section 13(2) Notice:</strong> Bank serves a 60-day demand notice to the borrower to repay the outstanding amount</li>
          <li><strong>Borrower&apos;s Response:</strong> Borrower has 60 days to either pay or make representations to the bank</li>
          <li><strong>Section 13(4) Actions (if not paid):</strong> After 60 days, bank can:
            <ul>
              <li>Take possession of the secured asset</li>
              <li>Sell/lease/assign the secured asset</li>
              <li>Appoint a manager to manage the secured asset</li>
              <li>Require any person who has acquired the secured asset to pay remaining debt to the bank</li>
            </ul>
          </li>
          <li><strong>Borrower&apos;s Appeal:</strong> Borrower can file application to DRT under Section 17 within 45 days of the bank&apos;s action</li>
        </ol>

        <h3>Key SARFAESI Facts for Exam</h3>
        <ul>
          <li>Multiple banks holding security in same asset: bank with 60%+ share can initiate SARFAESI</li>
          <li>Personal guarantee holders can also be proceeded against under SARFAESI</li>
          <li>The Authorized Officer (bank employee) must be of DGM rank or above for taking possession</li>
          <li>After possession, sale must be conducted within 30 days (extendable by 2 months)</li>
          <li>Reserve price must not be below 80% of market value (earlier was valuation by approved valuer)</li>
        </ul>

        <h2>DRT (Debts Recovery Tribunal)</h2>
        <p>For debts of <strong>₹20 lakh and above</strong>, banks can approach the DRT. Key facts:</p>
        <ul>
          <li>Established under the Recovery of Debts and Bankruptcy Act (RDDBFI Act) 1993</li>
          <li>Presiding Officer is equivalent to a District Judge</li>
          <li>Must dispose of applications within 180 days from the date of receipt</li>
          <li>Appeal lies to DRAT (Debts Recovery Appellate Tribunal) within 45 days</li>
          <li>Borrower must deposit 50% of the debt before filing appeal to DRAT (this can be reduced to 25% by DRAT)</li>
        </ul>

        <h2>Lok Adalat for NPA Recovery</h2>
        <p>For NPAs up to <strong>₹20 lakh</strong>, Lok Adalat is the preferred forum. Key facts:</p>
        <ul>
          <li>No court fees payable</li>
          <li>Decision is final and binding — no appeal possible (under Section 21 of Legal Services Authorities Act)</li>
          <li>Both parties must consent to Lok Adalat proceedings</li>
          <li>Decree of Lok Adalat is deemed a decree of civil court</li>
          <li>Suitable for compromise/settlement cases where both parties agree</li>
        </ul>

        <h2>Comparison Table: SARFAESI vs DRT vs Lok Adalat</h2>
        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Feature</th>
                <th className="border border-gray-300 p-3 text-left">SARFAESI</th>
                <th className="border border-gray-300 p-3 text-left">DRT</th>
                <th className="border border-gray-300 p-3 text-left">Lok Adalat</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 p-3">Threshold</td><td className="border border-gray-300 p-3">Above ₹1 lakh</td><td className="border border-gray-300 p-3">Above ₹20 lakh</td><td className="border border-gray-300 p-3">Up to ₹20 lakh</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3">Court involvement</td><td className="border border-gray-300 p-3">No (extrajudicial)</td><td className="border border-gray-300 p-3">Yes (tribunal)</td><td className="border border-gray-300 p-3">Yes (judicial)</td></tr>
              <tr><td className="border border-gray-300 p-3">Security required</td><td className="border border-gray-300 p-3">Yes (secured loans only)</td><td className="border border-gray-300 p-3">No (secured + unsecured)</td><td className="border border-gray-300 p-3">No</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3">Notice period</td><td className="border border-gray-300 p-3">60 days</td><td className="border border-gray-300 p-3">N/A (application filed)</td><td className="border border-gray-300 p-3">N/A (mutual consent)</td></tr>
              <tr><td className="border border-gray-300 p-3">Appeal</td><td className="border border-gray-300 p-3">DRT (45 days)</td><td className="border border-gray-300 p-3">DRAT (45 days)</td><td className="border border-gray-300 p-3">No appeal possible</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3">Agri land</td><td className="border border-gray-300 p-3">Not applicable</td><td className="border border-gray-300 p-3">Applicable</td><td className="border border-gray-300 p-3">Applicable</td></tr>
            </tbody>
          </table>
        </div>

        <h2>Upgradation of NPA to Standard</h2>
        <p>An NPA can be upgraded back to &quot;Standard&quot; asset if:</p>
        <ul>
          <li><strong>All arrears of interest and principal</strong> are paid by the borrower (not just current instalment)</li>
          <li>For restructured accounts: account performs satisfactorily for 1 year from the first payment due date after restructuring</li>
          <li>Upgradation is not permitted merely because the account has been rescheduled/renegotiated</li>
        </ul>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Practice NPA & Recovery Questions</h3>
          <p className="text-blue-800 mb-0">
            Our PPB and RBWM question banks have 100+ questions specifically on NPA classification, SARFAESI procedures, and recovery mechanisms. Each explanation cites the exact RBI Master Circular provision.
          </p>
        </div>
      </div>
    ),
  },
  {
    slug: 'time-value-of-money-solved-examples-jaiib',
    title: 'Time Value of Money — 10 Solved Examples for JAIIB AFM (2026)',
    description: 'Step-by-step solutions to the most common TVM problems in JAIIB AFM: compound interest, present value, EMI calculation, Rule of 72, annuity, and NPV with exam-style questions.',
    date: '2026-06-12',
    readTime: '13 min read',
    category: 'Solved Examples',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          Time Value of Money (TVM) is the foundation of JAIIB AFM Module C. Every exam has 5-8 questions on TVM concepts — compound interest, present value, EMI, and NPV. Here are 10 solved examples in the exact format you will see in the exam.
        </p>

        <h2>Core Concept: Why ₹100 Today ≠ ₹100 Tomorrow</h2>
        <p>
          Money has time value because it can earn interest. ₹100 today is worth more than ₹100 received after 1 year because you could invest today&apos;s ₹100 and have more than ₹100 after a year. This simple concept drives all TVM calculations.
        </p>

        <h2>Example 1: Simple Interest</h2>
        <p><strong>Question:</strong> A bank offers a Fixed Deposit at 7% p.a. simple interest. If you deposit ₹50,000 for 3 years, what is the maturity amount?</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">SI = P × R × T / 100</p>
          <p className="text-green-800 text-sm">SI = 50,000 × 7 × 3 / 100 = ₹10,500</p>
          <p className="text-green-800 text-sm">Maturity Amount = 50,000 + 10,500 = <strong>₹60,500</strong></p>
        </div>

        <h2>Example 2: Compound Interest</h2>
        <p><strong>Question:</strong> ₹1,00,000 is invested at 10% p.a. compounded annually for 3 years. Find the compound interest.</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">FV = PV × (1 + r)ⁿ</p>
          <p className="text-green-800 text-sm">FV = 1,00,000 × (1.10)³</p>
          <p className="text-green-800 text-sm">FV = 1,00,000 × 1.331 = ₹1,33,100</p>
          <p className="text-green-800 text-sm">Compound Interest = 1,33,100 - 1,00,000 = <strong>₹33,100</strong></p>
          <p className="text-green-700 text-xs mt-2">Note: If this were simple interest, it would be ₹30,000. The extra ₹3,100 is the &quot;interest on interest&quot; effect.</p>
        </div>

        <h2>Example 3: Present Value (Discounting)</h2>
        <p><strong>Question:</strong> You need ₹5,00,000 after 5 years. If the discount rate is 8% p.a., how much should you invest today?</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">PV = FV / (1 + r)ⁿ</p>
          <p className="text-green-800 text-sm">PV = 5,00,000 / (1.08)⁵</p>
          <p className="text-green-800 text-sm">PV = 5,00,000 / 1.4693</p>
          <p className="text-green-800 text-sm">PV = <strong>₹3,40,290</strong> (approximately)</p>
          <p className="text-green-700 text-xs mt-2">Interpretation: Invest ₹3.40 lakh today at 8% and it will grow to ₹5 lakh in 5 years.</p>
        </div>

        <h2>Example 4: Rule of 72 (Quick Doubling Time)</h2>
        <p><strong>Question:</strong> At what rate of interest will money double in 6 years (approximately)?</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">Rule of 72: Doubling Time = 72 / Rate%</p>
          <p className="text-green-800 text-sm">6 = 72 / Rate</p>
          <p className="text-green-800 text-sm">Rate = 72 / 6 = <strong>12% p.a.</strong></p>
          <p className="text-green-700 text-xs mt-2">Exam tip: If the question says &quot;approximately&quot; or &quot;quick estimate&quot;, use Rule of 72. Exact answer would need logarithms.</p>
        </div>

        <h2>Example 5: EMI Calculation</h2>
        <p><strong>Question:</strong> A home loan of ₹30,00,000 at 9% p.a. for 20 years. Calculate the monthly EMI.</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">EMI = P × r × (1+r)ⁿ / [(1+r)ⁿ - 1]</p>
          <p className="text-green-800 text-sm">P = 30,00,000; r = 9%/12 = 0.75% = 0.0075; n = 20×12 = 240 months</p>
          <p className="text-green-800 text-sm">(1.0075)²⁴⁰ = 6.009 (approx)</p>
          <p className="text-green-800 text-sm">EMI = 30,00,000 × 0.0075 × 6.009 / (6.009 - 1)</p>
          <p className="text-green-800 text-sm">EMI = 30,00,000 × 0.04507 / 5.009</p>
          <p className="text-green-800 text-sm">EMI = 1,35,210 / 5.009 = <strong>₹26,992</strong> (approximately ₹27,000)</p>
          <p className="text-green-700 text-xs mt-2">In the exam, options will be rounded. If you get ₹26,992, look for the closest option (₹26,992 or ₹27,000).</p>
        </div>

        <h2>Example 6: Net Present Value (NPV)</h2>
        <p><strong>Question:</strong> A project requires an investment of ₹10,00,000 and generates cash flows of ₹4,00,000 per year for 4 years. Cost of capital is 10%. Should the project be accepted?</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">NPV = Sum of [CF/(1+r)^t] - Initial Investment</p>
          <p className="text-green-800 text-sm">Year 1: 4,00,000 / 1.10 = 3,63,636</p>
          <p className="text-green-800 text-sm">Year 2: 4,00,000 / 1.21 = 3,30,579</p>
          <p className="text-green-800 text-sm">Year 3: 4,00,000 / 1.331 = 3,00,526</p>
          <p className="text-green-800 text-sm">Year 4: 4,00,000 / 1.4641 = 2,73,205</p>
          <p className="text-green-800 text-sm">Total PV of inflows = 12,67,946</p>
          <p className="text-green-800 text-sm">NPV = 12,67,946 - 10,00,000 = <strong>+₹2,67,946</strong></p>
          <p className="text-green-800 text-sm font-bold">Decision: ACCEPT (NPV is positive)</p>
          <p className="text-green-700 text-xs mt-2">Rule: NPV &gt; 0 → Accept; NPV &lt; 0 → Reject; NPV = 0 → Indifferent</p>
        </div>

        <h2>Example 7: Payback Period</h2>
        <p><strong>Question:</strong> Using the same project as Example 6 (₹10 lakh investment, ₹4 lakh annual cash flow), what is the payback period?</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">Payback Period = Initial Investment / Annual Cash Flow</p>
          <p className="text-green-800 text-sm">= 10,00,000 / 4,00,000</p>
          <p className="text-green-800 text-sm">= <strong>2.5 years</strong></p>
          <p className="text-green-700 text-xs mt-2">Note: This is the simple payback period (ignores time value). Discounted payback period would be longer.</p>
        </div>

        <h2>Example 8: Future Value of Annuity (SIP Calculation)</h2>
        <p><strong>Question:</strong> If you invest ₹10,000 per month in a mutual fund SIP earning 12% p.a. for 10 years, what will be the corpus?</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">FV of Annuity = PMT × [(1+r)ⁿ - 1] / r</p>
          <p className="text-green-800 text-sm">PMT = 10,000; r = 12%/12 = 1% = 0.01; n = 10×12 = 120 months</p>
          <p className="text-green-800 text-sm">(1.01)¹²⁰ = 3.30 (approx)</p>
          <p className="text-green-800 text-sm">FV = 10,000 × [3.30 - 1] / 0.01</p>
          <p className="text-green-800 text-sm">FV = 10,000 × 230 = <strong>₹23,00,000</strong> (approximately ₹23.23 lakh)</p>
          <p className="text-green-700 text-xs mt-2">Total invested: ₹12 lakh (₹10K × 120 months). Returns: ₹11+ lakh. This is the power of compounding.</p>
        </div>

        <h2>Example 9: Effective Rate of Interest</h2>
        <p><strong>Question:</strong> A bank offers 8% p.a. compounded quarterly. What is the effective annual rate?</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">Effective Rate = (1 + r/n)ⁿ - 1</p>
          <p className="text-green-800 text-sm">= (1 + 0.08/4)⁴ - 1</p>
          <p className="text-green-800 text-sm">= (1.02)⁴ - 1</p>
          <p className="text-green-800 text-sm">= 1.0824 - 1 = 0.0824</p>
          <p className="text-green-800 text-sm">= <strong>8.24% per annum</strong></p>
          <p className="text-green-700 text-xs mt-2">The effective rate is always higher than nominal rate when compounding is more frequent than annually.</p>
        </div>

        <h2>Example 10: Profitability Index</h2>
        <p><strong>Question:</strong> A project costs ₹5,00,000. PV of future cash flows is ₹6,50,000. Calculate Profitability Index and decide.</p>
        <div className="not-prose bg-green-50 border border-green-200 rounded-lg p-5 my-4">
          <p className="font-bold text-green-900 text-sm">Solution:</p>
          <p className="text-green-800 text-sm">PI = PV of future cash flows / Initial Investment</p>
          <p className="text-green-800 text-sm">PI = 6,50,000 / 5,00,000 = <strong>1.30</strong></p>
          <p className="text-green-800 text-sm font-bold">Decision: ACCEPT (PI &gt; 1)</p>
          <p className="text-green-700 text-xs mt-2">Rule: PI &gt; 1 → Accept; PI &lt; 1 → Reject; PI = 1 → Indifferent. PI of 1.30 means every ₹1 invested generates ₹1.30 in present value terms.</p>
        </div>

        <h2>Quick Reference: Decision Rules</h2>
        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Method</th>
                <th className="border border-gray-300 p-3 text-left">Accept If</th>
                <th className="border border-gray-300 p-3 text-left">Reject If</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 p-3">NPV</td><td className="border border-gray-300 p-3">NPV &gt; 0</td><td className="border border-gray-300 p-3">NPV &lt; 0</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3">IRR</td><td className="border border-gray-300 p-3">IRR &gt; Cost of Capital</td><td className="border border-gray-300 p-3">IRR &lt; Cost of Capital</td></tr>
              <tr><td className="border border-gray-300 p-3">PI</td><td className="border border-gray-300 p-3">PI &gt; 1</td><td className="border border-gray-300 p-3">PI &lt; 1</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3">Payback</td><td className="border border-gray-300 p-3">Payback &lt; Cutoff period</td><td className="border border-gray-300 p-3">Payback &gt; Cutoff period</td></tr>
            </tbody>
          </table>
        </div>

        <h2>Exam Tips for TVM Questions</h2>
        <ol>
          <li><strong>Memorize (1.1)² = 1.21 and (1.1)³ = 1.331</strong> — these appear in almost every NPV question with 10% discount rate</li>
          <li><strong>Use Rule of 72 for approximations</strong> — saves 30 seconds on doubling/tripling time questions</li>
          <li><strong>Convert annual rate to monthly for EMI</strong> — divide by 12 (not by 365)</li>
          <li><strong>NPV is the most reliable method</strong> — if NPV and IRR conflict, NPV decision prevails (per theory)</li>
          <li><strong>In the exam, use the on-screen calculator</strong> — don&apos;t waste time on mental math for powers</li>
        </ol>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Practice More AFM Numericals</h3>
          <p className="text-blue-800 mb-0">
            Our AFM question bank has 1195+ questions including 400+ numerical problems with step-by-step solutions. Practice until NPV, EMI, and BEP calculations become second nature.
          </p>
        </div>
      </div>
    ),
  },
  {
    slug: 'jaiib-registration-process-fees-2026',
    title: 'JAIIB 2026 Registration Process — Step-by-Step Guide, Fees & Important Dates',
    description: 'Complete walkthrough of the JAIIB registration process on IIBF website: eligibility check, fee payment, admit card download, exam centre selection, and what to do if registration fails.',
    date: '2026-06-15',
    readTime: '8 min read',
    category: 'Exam Info',
    coverImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          The JAIIB registration process can be confusing — especially if your bank&apos;s nodal officer is not responsive. Here is a complete step-by-step walkthrough with screenshots-equivalent descriptions, common issues, and solutions.
        </p>

        <h2>Eligibility Check (Before You Register)</h2>
        <p>Before starting registration, confirm you meet all criteria:</p>
        <ul>
          <li><strong>Employment:</strong> You must be a confirmed employee of a bank that is a member of IIBF. Probationers and contractual staff are typically not eligible.</li>
          <li><strong>IIBF Membership:</strong> Your bank must have enrolled you as an IIBF member. Most banks do this automatically at the time of joining. If unsure, ask your HR department or check the IIBF portal.</li>
          <li><strong>Membership Number:</strong> You need your IIBF membership number (format varies by bank — usually your employee ID or a specific IIBF registration number).</li>
          <li><strong>No concurrent attempt:</strong> You cannot register for JAIIB if you already have a JAIIB registration active (within the 2-year validity window).</li>
        </ul>

        <h2>Step-by-Step Registration Process</h2>

        <h3>Step 1: Access the IIBF Portal</h3>
        <p>Visit <strong>www.iibf.org.in</strong> → Click on &quot;Online Exam&quot; → &quot;Exam Registration&quot; or directly visit the examination registration page. The registration link is typically active 2-3 months before the exam window.</p>

        <h3>Step 2: Login / Create Account</h3>
        <ul>
          <li>If you have an existing IIBF account (from previous IIBF exams or membership), login with your credentials</li>
          <li>If new, register using your bank&apos;s employee code, IIBF membership number, and email address</li>
          <li>Your registered mobile number will receive an OTP for verification</li>
        </ul>

        <h3>Step 3: Select Examination</h3>
        <ul>
          <li>Choose &quot;JAIIB&quot; from the list of available examinations</li>
          <li>Select the exam window (May-June 2026 or November-December 2026)</li>
          <li>You register for all 4 papers together — you cannot register for individual papers in first attempt</li>
        </ul>

        <h3>Step 4: Fill Personal Details</h3>
        <ul>
          <li>Full name (must match your bank records and ID proof exactly)</li>
          <li>Date of birth</li>
          <li>Bank name and branch</li>
          <li>Employee code / staff number</li>
          <li>Contact details (email + mobile — admit card sent here)</li>
          <li>Upload photograph (recent passport size, white background, 20-50 KB, JPEG format)</li>
          <li>Upload signature (on white paper, 10-20 KB, JPEG format)</li>
        </ul>

        <h3>Step 5: Select Exam Centre</h3>
        <ul>
          <li>Choose your preferred city from the dropdown (IIBF has centres in 400+ cities across India)</li>
          <li>Select 3 preferences in order — you are usually allotted your first or second choice</li>
          <li>The exact centre address (school/college name) is mentioned on the admit card, not during registration</li>
          <li><strong>Tip:</strong> Choose a centre close to your home/office. JAIIB is conducted across multiple days — you may have 4 different exam dates for 4 papers.</li>
        </ul>

        <h3>Step 6: Fee Payment</h3>
        <p>Pay the registration fee online:</p>
        <ul>
          <li><strong>Fee for all 4 papers:</strong> ₹3,540 (including GST) — as of 2025-26</li>
          <li><strong>Re-examination fee (per paper):</strong> ₹1,180 (including GST) for papers not cleared in first attempt</li>
          <li><strong>Payment modes:</strong> Credit Card, Debit Card, Net Banking, UPI</li>
          <li><strong>Important:</strong> Fee is non-refundable even if you don&apos;t appear for the exam</li>
          <li><strong>Bank reimbursement:</strong> Most banks reimburse the exam fee upon passing. Check your bank&apos;s policy — some reimburse even if you fail.</li>
        </ul>

        <h3>Step 7: Confirmation & Admit Card</h3>
        <ul>
          <li>After payment, you receive a registration confirmation email with your registration number</li>
          <li>Admit card is available for download 15-20 days before the exam date</li>
          <li>Admit card contains: exam date, time, centre address, your photo, and important instructions</li>
          <li><strong>Print the admit card</strong> — you must carry it to the exam centre</li>
        </ul>

        <h2>Important Dates for JAIIB 2026</h2>
        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Event</th>
                <th className="border border-gray-300 p-3 text-left">May-June 2026 Window</th>
                <th className="border border-gray-300 p-3 text-left">Nov-Dec 2026 Window</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 p-3">Registration Opens</td><td className="border border-gray-300 p-3">January 2026</td><td className="border border-gray-300 p-3">July 2026</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3">Registration Closes</td><td className="border border-gray-300 p-3">March 2026</td><td className="border border-gray-300 p-3">September 2026</td></tr>
              <tr><td className="border border-gray-300 p-3">Admit Card Available</td><td className="border border-gray-300 p-3">April 2026</td><td className="border border-gray-300 p-3">October 2026</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3">Exam Dates</td><td className="border border-gray-300 p-3">May-June 2026</td><td className="border border-gray-300 p-3">November-December 2026</td></tr>
              <tr><td className="border border-gray-300 p-3">Results</td><td className="border border-gray-300 p-3">July-August 2026</td><td className="border border-gray-300 p-3">January-February 2027</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 italic">* Dates are tentative based on past patterns. Check iibf.org.in for official notifications.</p>

        <h2>Common Registration Issues & Solutions</h2>

        <h3>Issue 1: &quot;Membership number not found&quot;</h3>
        <p><strong>Solution:</strong> Contact your bank&apos;s IIBF nodal officer (usually in the Staff Training College or HR department). They need to upload your membership details to IIBF. This takes 3-5 working days.</p>

        <h3>Issue 2: Payment failed but amount debited</h3>
        <p><strong>Solution:</strong> Wait 48-72 hours — the amount usually auto-refunds. If not, contact IIBF helpline with your transaction ID and bank statement screenshot. Do NOT attempt a second payment without confirming the first one failed.</p>

        <h3>Issue 3: Photo/signature upload rejected</h3>
        <p><strong>Solution:</strong> Ensure photo is exactly passport-size face (80% face coverage), white background, JPEG format, 20-50 KB. Signature must be on plain white paper, clear and within the border, 10-20 KB JPEG.</p>

        <h3>Issue 4: &quot;Already registered for this exam&quot;</h3>
        <p><strong>Solution:</strong> This means you have an existing active registration. If you passed some papers in the previous attempt, you can register for only the remaining papers using the &quot;Re-examination&quot; option.</p>

        <h3>Issue 5: Name mismatch between bank records and ID proof</h3>
        <p><strong>Solution:</strong> The name must match exactly. If your bank records say &quot;RAJESH KUMAR&quot; but your Aadhaar says &quot;RAJESH KUMAR SINGH&quot;, get either one updated. Alternatively, use a different ID proof that matches.</p>

        <h2>After Registration: What Next?</h2>
        <ol>
          <li><strong>Start studying immediately</strong> — don&apos;t wait for the admit card. The syllabus is fixed and available on IIBF website.</li>
          <li><strong>Order the IIBF textbooks</strong> — buy from IIBF website directly or Amazon. Ensure you get the latest edition (check the year printed on the cover).</li>
          <li><strong>Create a study plan</strong> — allocate 8-12 weeks for complete preparation (see our 12-week study timetable blog post).</li>
          <li><strong>Join a study group</strong> — find colleagues at your branch who are also appearing. Peer discussion helps retention.</li>
          <li><strong>Start mock tests early</strong> — don&apos;t save mock tests for the last week. Start attempting them from Week 3-4 of your preparation.</li>
        </ol>

        <h2>Fee Comparison with Other Banking Exams</h2>
        <div className="not-prose my-6 overflow-x-auto">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 text-left">Exam</th>
                <th className="border border-gray-300 p-3 text-left">Papers</th>
                <th className="border border-gray-300 p-3 text-left">Fee (incl. GST)</th>
                <th className="border border-gray-300 p-3 text-left">Validity</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-gray-300 p-3 font-bold">JAIIB</td><td className="border border-gray-300 p-3">4</td><td className="border border-gray-300 p-3">₹3,540</td><td className="border border-gray-300 p-3">2 years</td></tr>
              <tr className="bg-gray-50"><td className="border border-gray-300 p-3 font-bold">CAIIB</td><td className="border border-gray-300 p-3">4+1 elective</td><td className="border border-gray-300 p-3">₹4,720</td><td className="border border-gray-300 p-3">2 years</td></tr>
              <tr><td className="border border-gray-300 p-3">Diploma in Banking</td><td className="border border-gray-300 p-3">5</td><td className="border border-gray-300 p-3">₹5,900</td><td className="border border-gray-300 p-3">3 years</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Start Preparing While You Wait</h3>
          <p className="text-blue-800 mb-0">
            Don&apos;t wait for the admit card to start preparation. Begin practicing with our 3000+ questions aligned to the latest 2026 syllabus. Track your progress across all 4 papers and identify weak areas early.
          </p>
        </div>
      </div>
    ),
  },
  {
    slug: 'ai-300-preparation-guide-2026',
    title: 'Microsoft AI-300 Certification Preparation Guide 2026 — Complete Study Plan & Resources',
    description: 'Comprehensive guide to pass the Microsoft AI-300 exam (Operationalizing ML & GenAI Solutions). Includes exam structure, official Microsoft Learn modules, study resources, and a 4-week study plan.',
    date: '2026-06-20',
    readTime: '15 min read',
    category: 'IT Certification',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    content: (
      <div className="prose prose-lg max-w-none">
        <p className="lead text-xl text-gray-700 mb-8">
          The Microsoft AI-300 certification validates your ability to operationalize machine learning and generative AI solutions on Azure. This guide covers everything you need to pass the exam, including the official Microsoft Learn modules, study strategies, and practice resources.
        </p>

        <h2>AI-300 Exam Overview</h2>
        <div className="not-prose bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 my-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">📋 Exam Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-blue-600">AI-300</p>
              <p className="text-xs text-gray-600">Exam Code</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-indigo-600">120 min</p>
              <p className="text-xs text-gray-600">Duration</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-green-600">40-60</p>
              <p className="text-xs text-gray-600">Questions</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <p className="text-2xl font-bold text-purple-600">700/1000</p>
              <p className="text-xs text-gray-600">Pass Score</p>
            </div>
          </div>
        </div>

        <h2>Skills Measured (Exam Weightage)</h2>
        <div className="not-prose bg-white rounded-xl border border-gray-200 p-6 my-6 shadow-sm">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="font-medium">Design and Plan AI Solutions (15-20%)</span><span className="text-blue-600 font-bold">15-20%</span></div>
              <div className="h-3 bg-gray-200 rounded-full"><div className="h-3 bg-blue-500 rounded-full" style={{width: '17%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="font-medium">Design and Manage Data Pipelines (20-25%)</span><span className="text-indigo-600 font-bold">20-25%</span></div>
              <div className="h-3 bg-gray-200 rounded-full"><div className="h-3 bg-indigo-500 rounded-full" style={{width: '22%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="font-medium">Design and Manage Model Training (20-25%)</span><span className="text-purple-600 font-bold">20-25%</span></div>
              <div className="h-3 bg-gray-200 rounded-full"><div className="h-3 bg-purple-500 rounded-full" style={{width: '22%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="font-medium">Design and Manage Deployment Infrastructure (20-25%)</span><span className="text-pink-600 font-bold">20-25%</span></div>
              <div className="h-3 bg-gray-200 rounded-full"><div className="h-3 bg-pink-500 rounded-full" style={{width: '22%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="font-medium">Monitor and Maintain AI Solutions (10-15%)</span><span className="text-green-600 font-bold">10-15%</span></div>
              <div className="h-3 bg-gray-200 rounded-full"><div className="h-3 bg-green-500 rounded-full" style={{width: '12%'}}></div></div>
            </div>
          </div>
        </div>

        <h2>Official Microsoft Learn Modules (Free)</h2>
        <p className="text-gray-700 mb-4">The following Microsoft Learn modules are the official preparation materials, organized by exam domain:</p>

        <h3>🟦 Domain 1: Design and Plan AI Solutions (15-20%)</h3>
        <ul className="space-y-2 mb-6">
          <li><a href="https://learn.microsoft.com/en-us/training/modules/get-started-ai-fundamentals/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Get started with AI fundamentals</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/fundamentals-machine-learning/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Fundamentals of machine learning</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/plan-prepare-genaiops/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Plan and prepare for GenAIOps</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/azure-ai-foundry-secure-environment/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Azure AI Foundry secure environment</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/implement-identity-based-security-azure-machine-learning/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Implement identity-based security for Azure Machine Learning</a></li>
        </ul>

        <h3>🟪 Domain 2: Design and Manage Data Pipelines (20-25%)</h3>
        <ul className="space-y-2 mb-6">
          <li><a href="https://learn.microsoft.com/en-us/training/paths/design-machine-learning-solution/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Design a machine learning solution (Learning Path)</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/explore-azure-machine-learning-workspace/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Explore Azure Machine Learning workspace</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/explore-azure-machine-learning-workspace-resources-assets/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Explore Azure ML workspace resources and assets</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/work-environments-azure-machine-learning/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Work with environments in Azure Machine Learning</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/work-compute-resources-azure-machine-learning/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">Work with compute resources in Azure Machine Learning</a></li>
        </ul>

        <h3>🟣 Domain 3: Design and Manage Model Training (20-25%)</h3>
        <ul className="space-y-2 mb-6">
          <li><a href="https://learn.microsoft.com/en-us/training/modules/design-machine-learning-model-training-solution/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Design a machine learning model training solution</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/run-training-script-command-job-azure-machine-learning/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Run a training script as a command job</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/train-models-training-mlflow-jobs/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Train models with MLflow jobs</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/run-training-scripts-track-models-mlflow/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Run training scripts and track models with MLflow</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/perform-hyperparameter-tuning-azure-machine-learning-pipelines/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Perform hyperparameter tuning with Azure ML pipelines</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/optimize-finetune-agents/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Optimize and fine-tune agents</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/paths/automate-machine-learning-model-selection-azure-machine-learning/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Automate ML model selection (Learning Path)</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/use-azure-machine-learn-job-for-automation/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Use Azure ML jobs for automation</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/run-pipelines-azure-machine-learning/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Run pipelines in Azure Machine Learning</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/paths/use-azure-machine-learning-pipelines-for-automation/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Use Azure ML pipelines for automation (Learning Path)</a></li>
        </ul>

        <h3>🟢 Domain 4: Design and Manage Deployment Infrastructure (20-25%)</h3>
        <ul className="space-y-2 mb-6">
          <li><a href="https://learn.microsoft.com/en-us/training/paths/deploy-consume-models-azure-machine-learning/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Deploy and consume models with Azure ML (Learning Path)</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/design-model-deployment-solution/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Design a model deployment solution</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/deploy-model-batch-endpoint/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Deploy model to batch endpoint</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/continuous-deployment-for-machine-learning/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Continuous deployment for machine learning</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/deploy-model-github-actions/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Deploy model with GitHub Actions</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/trigger-azure-machine-learn-jobs-github-actions/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Trigger Azure ML jobs with GitHub Actions</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/trigger-github-actions-trunk-based-development/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Trigger GitHub Actions with trunk-based development</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/work-environments-github-actions/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">Work with environments in GitHub Actions</a></li>
        </ul>

        <h3>🟠 Domain 5: Monitor and Maintain AI Solutions (10-15%)</h3>
        <ul className="space-y-2 mb-6">
          <li><a href="https://learn.microsoft.com/en-us/training/paths/manage-review-models-azure-machine-learning/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Manage and review models in Azure ML (Learning Path)</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/prompt-versioning-genaiops/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Prompt versioning for GenAIOps</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/automated-evaluation-genaiops/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Automated evaluation for GenAIOps</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/optimize-generative-ai-model-performance/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Optimize generative AI model performance</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/tracing-generative-ai-app/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Tracing generative AI applications</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/monitor-generative-ai-app/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Monitor generative AI applications</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/manage-optimize-agent-investment-azure/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Manage and optimize agent investment in Azure</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/paths/introduction-machine-learn-operations/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Introduction to MLOps (Learning Path)</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/modules/design-machine-learning-operations-solution/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Design MLOps solution</a></li>
          <li><a href="https://learn.microsoft.com/en-us/training/paths/train-deploy-machine-learning-model/" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Train and deploy ML models (Learning Path)</a></li>
        </ul>

        <h2>4-Week Study Plan</h2>
        <div className="not-prose my-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-5 border border-blue-200">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">W1</span>
              </div>
              <div>
                <h4 className="font-bold text-blue-900">Week 1: Foundations & Planning</h4>
                <p className="text-sm text-blue-800">AI fundamentals, ML basics, GenAIOps planning, Azure AI Foundry security, Identity-based security</p>
                <p className="text-xs text-blue-600 mt-1">Modules: 6 | Est. 15-20 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-indigo-50 rounded-xl p-5 border border-indigo-200">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">W2</span>
              </div>
              <div>
                <h4 className="font-bold text-indigo-900">Week 2: Data Pipelines & Training</h4>
                <p className="text-sm text-indigo-800">Azure ML workspace, environments, compute, data pipelines, model training solutions, command jobs, MLflow</p>
                <p className="text-xs text-indigo-600 mt-1">Modules: 9 | Est. 20-25 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-purple-50 rounded-xl p-5 border border-purple-200">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">W3</span>
              </div>
              <div>
                <h4 className="font-bold text-purple-900">Week 3: Training Optimization & Deployment</h4>
                <p className="text-sm text-purple-800">Hyperparameter tuning, fine-tuning agents, AutoML, pipelines, deployment solutions, batch endpoints, GitHub Actions CI/CD</p>
                <p className="text-xs text-purple-600 mt-1">Modules: 10 | Est. 20-25 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-green-50 rounded-xl p-5 border border-green-200">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">W4</span>
              </div>
              <div>
                <h4 className="font-bold text-green-900">Week 4: Monitoring, MLOps & Mock Exams</h4>
                <p className="text-sm text-green-800">GenAIOps monitoring, prompt versioning, automated evaluation, tracing, MLOps design, practice exams</p>
                <p className="text-xs text-green-600 mt-1">Modules: 7 | Est. 15-20 hours</p>
              </div>
            </div>
          </div>
        </div>

        <h2>Additional Resources</h2>
        <ul className="space-y-2 mb-6">
          <li><strong>Official Exam Page:</strong> <a href="https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Microsoft Certified: Azure AI Engineer Associate</a></li>
          <li><strong>Practice Assessment:</strong> Microsoft Learn offers a free practice assessment for AI-300</li>
          <li><strong>Azure ML Documentation:</strong> <a href="https://learn.microsoft.com/en-us/azure/machine-learning/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Azure Machine Learning documentation</a></li>
          <li><strong>Responsible AI:</strong> <a href="https://learn.microsoft.com/en-us/azure/ai-services/responsible-use/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Responsible AI practices</a></li>
        </ul>

        <h2>Pro Tips for AI-300</h2>
        <ol>
          <li><strong>Hands-on is critical:</strong> This exam tests practical Azure ML skills. Create a free Azure account and complete the labs in each Learn module.</li>
          <li><strong>Focus on GenAIOps:</strong> The exam heavily emphasizes generative AI operations — prompt versioning, automated evaluation, tracing, and monitoring.</li>
          <li><strong>Know the deployment patterns:</strong> Understand real-time vs batch endpoints, managed vs Kubernetes deployments, and when to use each.</li>
          <li><strong>MLflow integration:</strong> Know how MLflow integrates with Azure ML for experiment tracking, model registry, and deployment.</li>
          <li><strong>GitHub Actions for MLOps:</strong> The exam tests CI/CD pipelines using GitHub Actions to trigger Azure ML jobs.</li>
          <li><strong>Security & Identity:</strong> Don't skip the security modules — managed identities, RBAC, and network isolation are tested.</li>
        </ol>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-blue-900 mt-0">Practice AI-300 Questions</h3>
          <p className="text-blue-800 mb-0">
            Our platform includes AI-300 practice questions with detailed explanations covering all 5 exam domains. Track your readiness score and focus on weak areas.
          </p>
        </div>
      </div>
    ),
  },
];

export default ADDITIONAL_BLOG_POSTS;
