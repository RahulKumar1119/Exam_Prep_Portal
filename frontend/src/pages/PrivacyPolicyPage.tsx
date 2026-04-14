import React from 'react';
import { Link } from 'react-router-dom';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{title}</h2>
    <div className="text-gray-600 dark:text-gray-400 space-y-2 leading-relaxed">{children}</div>
  </div>
);

const PrivacyPolicyPage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-8 border border-gray-200 dark:border-gray-700">
      <Link to="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">← Back to Home</Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: April 14, 2026</p>

      <Section title="1. Information We Collect">
        <p>We collect information you provide directly when you register, including your name, email address, and bank affiliation. We also collect usage data such as practice session results, scores, and study time to power your performance dashboard.</p>
      </Section>

      <Section title="2. How We Use Your Information">
        <p>Your information is used to:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Provide and personalise the JAIIB/CAIIB exam preparation experience</li>
          <li>Generate AI-powered explanations tailored to your performance level</li>
          <li>Track your progress and surface weak/strong areas</li>
          <li>Send relevant notifications about your study progress</li>
          <li>Improve the quality of questions and explanations on the platform</li>
        </ul>
      </Section>

      <Section title="3. Data Storage & Security">
        <p>All data is stored securely on AWS infrastructure in the ap-south-1 (Mumbai) region. We use industry-standard encryption in transit (TLS) and at rest. Access to your data is restricted to authenticated sessions only.</p>
        <p>Passwords are never stored in plain text — they are hashed using AWS Cognito's secure authentication service.</p>
      </Section>

      <Section title="4. AI-Generated Content">
        <p>When you request an explanation for a question, the question text and correct answer are sent to an AI model (Google Gemma 3 27B via AWS Bedrock) to generate an explanation. No personally identifiable information is included in these requests. Generated explanations are cached and may be reused for other users viewing the same question.</p>
      </Section>

      <Section title="5. Data Sharing">
        <p>We do not sell, trade, or rent your personal information to third parties. We may share anonymised, aggregated performance data for research or platform improvement purposes. We use AWS services (DynamoDB, Lambda, Cognito, Bedrock) to operate the platform — these are governed by AWS's own privacy policies.</p>
      </Section>

      <Section title="6. Data Retention">
        <p>Your account data is retained for as long as your account is active. Practice session data is retained for 90 days. AI explanation cache entries are retained for 30 days. You may request deletion of your account and associated data by contacting us.</p>
      </Section>

      <Section title="7. Your Rights">
        <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at the email below. We will respond within 30 days.</p>
      </Section>

      <Section title="8. Cookies">
        <p>We use localStorage (not cookies) to persist your session state and preferences (such as dark mode). No third-party tracking cookies are used.</p>
      </Section>

      <Section title="9. Contact">
        <p>For privacy-related queries, contact us at: <a href="mailto:privacy@mockmaster.fun" className="text-blue-600 hover:underline">privacy@mockmaster.fun</a></p>
      </Section>
    </div>
  </div>
);

export default PrivacyPolicyPage;
