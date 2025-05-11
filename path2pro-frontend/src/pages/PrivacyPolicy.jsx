import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 mb-8">
            <p className="text-gray-300 mb-4">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
                <p>Welcome to EduHub. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">2. The Data We Collect About You</h2>
                <p>Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier, and student ID.</li>
                  <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
                  <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                  <li><strong>Usage Data</strong> includes information about how you use our website, products, and services.</li>
                  <li><strong>Educational Data</strong> includes your university, department, program of study, and academic history.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">3. How We Use Your Personal Data</h2>
                <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>To register you as a new user</li>
                  <li>To provide and manage your account</li>
                  <li>To provide you with educational content and services</li>
                  <li>To manage our relationship with you</li>
                  <li>To personalize your experience</li>
                  <li>To improve our website, products/services, marketing, and customer relationships</li>
                  <li>To recommend content, events, or services that may be of interest to you</li>
                  <li>To administer and protect our business and this website</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
                <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">5. Data Retention</h2>
                <p>We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">6. Your Legal Rights</h2>
                <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Request access to your personal data</li>
                  <li>Request correction of your personal data</li>
                  <li>Request erasure of your personal data</li>
                  <li>Object to processing of your personal data</li>
                  <li>Request restriction of processing your personal data</li>
                  <li>Request transfer of your personal data</li>
                  <li>Right to withdraw consent</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">7. Cookies</h2>
                <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.</p>
                <p className="mt-2">You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">8. Changes to This Privacy Policy</h2>
                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date at the top of this Privacy Policy.</p>
                <p className="mt-2">You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">9. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                <p className="mt-2">Email: privacy@eduhub.com</p>
                <p>Phone: +880 1234-567890</p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 px-8 bg-black/50 backdrop-blur-md border-t border-gray-800">
        <div className="container mx-auto text-center text-gray-400">
          <p>© {new Date().getFullYear()} EduHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PrivacyPolicy; 