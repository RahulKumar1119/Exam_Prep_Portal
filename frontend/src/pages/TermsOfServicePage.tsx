import React from 'react';
import { Link } from 'react-router-dom';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{title}</h2>
    <div className="text-gray-600 dark:text-gray-400 space-y-2 leading-relaxed">{children}</div>
  </div>
);

const TermsOfServicePage: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow p-8 border border-gray-200 dark:border-gray-700">
      <Link to="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">← Back to Home</Link>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: April 14, 2026</p>

      <Section title="1. Acceptance of Terms">
        <p>By registering and using MockMaster (mockmaster.fun), you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
      </Section>

      <Section title="2. Eligibility">
        <p>This platform is intended for banking professionals and students preparing for JAIIB/CAIIB examinations conducted by the Indian Institute of Banking & Finance (IIBF). You must be at least 18 years old to register.</p>
      </Section>

      <Section title="3. Account Responsibilities">
        <ul className="list-disc pl-5 space-y-1">
          <li>You are responsible for maintaining the confidentiality of your login credentials</li>
          <li>You must not share your account with others</li>
          <li>You must provide accurate information during registration</li>
          <li>You are responsible for all activity that occurs under your account</li>
        </ul>
      </Section>

      <Section title="4. Acceptable Use">
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Use the platform for any unlawful purpose</li>
          <li>Attempt to reverse-engineer, scrape, or copy question content in bulk</li>
          <li>Share, distribute, or resell question content or AI explanations</li>
          <li>Attempt to circumvent authentication or access other users' data</li>
          <li>Use automated tools to generate practice sets at scale</li>
        </ul>
      </Section>

      <Section title="5. Intellectual Property">
        <p>All question content, AI-generated explanations, and platform design are the intellectual property of MockMaster. Questions are generated using AI and curated for JAIIB/CAIIB syllabus coverage. IIBF and RBI regulatory content referenced in explanations remains the property of the respective organisations.</p>
      </Section>

      <Section title="6. AI-Generated Content Disclaimer">
        <p>Explanations and questions on this platform are AI-generated and are intended as study aids only. They should not be treated as official IIBF guidance. Always refer to official IIBF study materials and RBI circulars for authoritative information. MockMaster is not affiliated with IIBF or RBI.</p>
      </Section>

      <Section title="7. Service Availability">
        <p>We strive to maintain high availability but do not guarantee uninterrupted access. The platform may be unavailable during maintenance windows or due to circumstances beyond our control. Practice session data is persisted to minimise disruption.</p>
      </Section>

      <Section title="8. Limitation of Liability">
        <p>MockMaster is provided "as is" without warranties of any kind. We are not liable for any direct, indirect, or consequential damages arising from your use of the platform, including exam outcomes. Use of this platform does not guarantee success in JAIIB/CAIIB examinations.</p>
      </Section>

      <Section title="9. Termination">
        <p>We reserve the right to suspend or terminate accounts that violate these terms. You may delete your account at any time by contacting us.</p>
      </Section>

      <Section title="10. Changes to Terms">
        <p>We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the updated terms. We will notify registered users of significant changes via email.</p>
      </Section>

      <Section title="11. Governing Law">
        <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Mumbai, Maharashtra.</p>
      </Section>

      <Section title="12. Contact">
        <p>For terms-related queries: <a href="mailto:legal@mockmaster.fun" className="text-blue-600 hover:underline">legal@mockmaster.fun</a></p>
      </Section>
    </div>
  </div>
);

export default TermsOfServicePage;
