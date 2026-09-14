import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ExamOrgLogo from '../components/ExamOrgLogo';

const CloudOpsPracticeTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title="CloudOps Practice Test 2026 — Free AWS SOA-C03 Certification Prep"
        description="Free AWS Certified CloudOps Engineer - Associate (SOA-C03) practice questions. Covers monitoring, reliability, deployment automation, security, and networking with scenario-based questions."
        canonical="https://mockmaster.fun/cloudops-practice-test"
        ogImage="https://mockmaster.fun/og-cloudops.png"
        keywords="SOA-C03 practice test, CloudOps practice test, AWS SysOps practice questions, AWS CloudOps certification free, SOA-C03 mock test, AWS associate certification"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: 'AWS Certified CloudOps Engineer - Associate (SOA-C03) — Free Practice Test',
            description:
              'Free AWS Certified CloudOps Engineer - Associate (SOA-C03) practice questions. Covers monitoring, reliability, deployment automation, security, and networking with scenario-based questions.',
            url: 'https://mockmaster.fun/cloudops-practice-test/',
            provider: { '@type': 'Organization', name: 'AWS', sameAs: 'https://aws.amazon.com' },
          }),
        }}
      />

      {/* Nav */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg">M</span>
            </div>
            <span className="text-base sm:text-xl font-bold text-gray-900">MockMaster</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/login" className="px-3 sm:px-6 py-2 text-xs sm:text-sm text-gray-700 font-medium hover:text-gray-900 transition">Login</Link>
            <Link to="/register" className="px-3 sm:px-6 py-2 text-xs sm:text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full mb-4">
            <ExamOrgLogo exam="CloudOps" size={18} className="!rounded-md" />
            <span>AWS Certification</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            CloudOps: AWS Certified CloudOps Engineer - Associate (SOA-C03)
          </h1>
          <p className="text-base sm:text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Free practice questions covering monitoring and remediation, reliability and business continuity,
            deployment automation, security and compliance, and networking. Scenario-based items aligned with
            the official AWS exam guide (formerly SysOps Administrator - Associate).
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/register" className="px-8 py-3.5 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition shadow-lg shadow-amber-200">
              Start Practicing Free
            </Link>
            <a href="#syllabus" className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition">
              View Full Syllabus
            </a>
          </div>
        </div>
      </section>

      {/* Exam Overview */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">About the SOA-C03 Exam</h2>
          <div className="prose prose-lg text-gray-700 leading-relaxed space-y-4">
            <p>
              The <strong>AWS Certified CloudOps Engineer - Associate (SOA-C03)</strong> (formerly SysOps
              Administrator - Associate) validates hands-on operations skills: deploying, managing, and operating
              workloads on AWS with the console, CLI, and infrastructure as code. Expect practical,
              troubleshooting-heavy scenarios — not trivia.
            </p>

            <div className="overflow-x-auto my-6">
              <table className="min-w-full border border-gray-200 rounded-lg text-sm">
                <tbody>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50 w-40">Exam Code</td><td className="px-4 py-3">SOA-C03</td></tr>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Full Name</td><td className="px-4 py-3">AWS Certified CloudOps Engineer - Associate</td></tr>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Provider</td><td className="px-4 py-3">AWS</td></tr>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Prerequisite</td><td className="px-4 py-3">None (~1 year hands-on AWS operations recommended)</td></tr>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Question Format</td><td className="px-4 py-3">65 questions (50 scored) — multiple choice + multiple response, scenario-based</td></tr>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Duration</td><td className="px-4 py-3">130 minutes</td></tr>
                  <tr className="border-b"><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Passing Score</td><td className="px-4 py-3">720 out of 1000</td></tr>
                  <tr><td className="px-4 py-3 font-medium text-gray-900 bg-gray-50">Exam Fee</td><td className="px-4 py-3">$150 USD</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Syllabus */}
      <section id="syllabus" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">SOA-C03 Exam Domains</h2>

          <div className="space-y-5">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-amber-800">Monitoring, Logging, Analysis, Remediation & Performance Optimization</h3>
                <span className="text-sm font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">22%</span>
              </div>
              <p className="text-sm text-gray-700">CloudWatch metrics, composite alarms, dashboards; CloudTrail; CloudWatch agent; Managed Prometheus/Grafana; SNS notifications; EventBridge routing; SSM Automation runbooks; EBS, S3, EFS/FSx, RDS and EC2 performance optimization.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-blue-800">Reliability and Business Continuity</h3>
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">22%</span>
              </div>
              <p className="text-sm text-gray-700">Auto Scaling; ElastiCache/CloudFront caching; RDS/DynamoDB scaling; ELB and Route 53 health checks; Multi-AZ fault tolerance; AWS Backup snapshots; point-in-time restore vs RTO/RPO; S3 versioning; DR procedures.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-green-800">Deployment, Provisioning, and Automation</h3>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">22%</span>
              </div>
              <p className="text-sm text-gray-700">AMIs, container images, Image Builder; CloudFormation and CDK stacks; deployment troubleshooting; RAM and StackSets sharing; blue-green/canary/rolling strategies; Terraform/Git; SSM automation; Lambda event-driven automation.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-purple-800">Security and Compliance</h3>
                <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">16%</span>
              </div>
              <p className="text-sm text-gray-700">IAM policies, MFA, roles, federation; CloudTrail/Access Analyzer audits; Organizations, SCPs, Control Tower; Trusted Advisor remediation; KMS at rest; ACM in transit; Secrets Manager; Security Hub/GuardDuty/Config/Inspector.</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-cyan-800">Networking and Content Delivery</h3>
                <span className="text-sm font-semibold text-cyan-600 bg-cyan-50 px-2 py-1 rounded">18%</span>
              </div>
              <p className="text-sm text-gray-700">VPC subnets, route tables, NACLs, security groups, NAT/IGW; PrivateLink, peering, Transit Gateway, VPN; WAF/Shield/Network Firewall; Route 53 routing and logging; CloudFront/Global Accelerator; flow-log troubleshooting; hybrid connectivity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Take This */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Who Should Take SOA-C03?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">SysOps & CloudOps Engineers</h4>
              <p className="text-sm text-gray-600">Operators who deploy, monitor, patch, and troubleshoot production AWS workloads daily.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">System Administrators</h4>
              <p className="text-sm text-gray-600">Moving from on-prem ops into AWS — validate monitoring, backup, networking, and security skills.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">SAA Holders Going Deeper</h4>
              <p className="text-sm text-gray-600">Already passed Solutions Architect Associate? SOA-C03 proves you can actually operate what you design.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-2">DevOps Aspirants</h4>
              <p className="text-sm text-gray-600">Build the operations foundation (CI/CD awareness, IaC, observability) before professional-level certs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Practice SOA-C03 Questions Free</h2>
          <p className="text-amber-100 mb-8">65-question sets mirroring the real exam. Instant explanations with AWS references.</p>
          <Link to="/register" className="px-8 py-4 bg-white text-amber-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">Exams</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/practice-tests" className="hover:text-white transition">JAIIB Practice Tests</Link></li>
                <li><Link to="/ai-300-practice-test" className="hover:text-white transition">AI-300 Practice Test</Link></li>
                <li><Link to="/capm-practice-test" className="hover:text-white transition">CAPM Practice Test</Link></li>
                <li><Link to="/cloudops-practice-test" className="hover:text-white transition">CloudOps Practice Test</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="hover:text-white transition">Terms of Service</Link></li>
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 MockMaster. All rights reserved. AWS and SOA-C03 are trademarks of Amazon Web Services, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CloudOpsPracticeTestPage;
