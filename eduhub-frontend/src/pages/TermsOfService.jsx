import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-12 px-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Terms of Service</h1>
          
          <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 mb-8">
            <p className="text-gray-300 mb-4">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            
            <div className="space-y-6 text-gray-300">
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
                <p>Welcome to EduHub. These Terms of Service govern your use of our website and services. By accessing or using EduHub, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the service.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">2. Definitions</h2>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li><strong>"Service"</strong> refers to the EduHub website and platform.</li>
                  <li><strong>"User"</strong> refers to the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service.</li>
                  <li><strong>"Content"</strong> refers to all materials found on the Service, including but not limited to text, images, videos, audio files, and educational resources.</li>
                  <li><strong>"User Content"</strong> refers to all materials uploaded, posted, or otherwise provided by Users of the Service.</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">3. User Accounts</h2>
                <p>When you create an account with us, you must provide accurate, complete, and up-to-date information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
                <p className="mt-2">You are responsible for safeguarding the password you use to access the Service and for any activities or actions under your password. You agree not to disclose your password to any third party.</p>
                <p className="mt-2">You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">4. Intellectual Property</h2>
                <p>The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of EduHub and its licensors. The Service is protected by copyright, trademark, and other laws.</p>
                <p className="mt-2">Our trademarks and visual identity may not be used in connection with any product or service without the prior written consent of EduHub.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">5. User Content</h2>
                <p>By posting, uploading, or otherwise making available any content on our Service, you grant EduHub a non-exclusive, transferable, sub-licensable, royalty-free, worldwide license to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the Service.</p>
                <p className="mt-2">You represent and warrant that you own or have the necessary rights to post the content you submit and that your User Content does not violate the privacy rights, publicity rights, copyrights, contract rights, or any other rights of any person or entity.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">6. Prohibited Activities</h2>
                <p>You may not access or use the Service for any purpose other than that for which we make the Service available. As a user of the Service, you agree not to:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>Use the Service in any manner that could interfere with, disrupt, negatively affect, or inhibit other users from fully enjoying the Service</li>
                  <li>Use the Service to store or transmit malicious code, viruses, or harmful data</li>
                  <li>Use the Service to transmit or distribute material that is defamatory, obscene, invasive of another's privacy, or harmful to minors</li>
                  <li>Use the Service to engage in any form of harassment or offensive behavior</li>
                  <li>Use the Service to infringe on the intellectual property rights of others</li>
                  <li>Use the Service to engage in unauthorized framing or linking to the Service</li>
                  <li>Use the Service to collect or track the personal information of others</li>
                  <li>Use the Service for commercial solicitation purposes without proper authorization</li>
                </ul>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">7. Educational Content</h2>
                <p>EduHub provides educational content for informational purposes only. While we strive to offer accurate and up-to-date information, we make no warranties about the completeness, reliability, or accuracy of this content.</p>
                <p className="mt-2">Any reliance you place on such information is strictly at your own risk. We will not be liable for any loss or damage that may arise from your use of educational materials on our platform.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">8. Termination</h2>
                <p>We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                <p className="mt-2">Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">9. Limitation of Liability</h2>
                <p>In no event shall EduHub, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">10. Changes to Terms</h2>
                <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.</p>
                <p className="mt-2">By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.</p>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold text-white mb-3">11. Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us at:</p>
                <p className="mt-2">Email: terms@eduhub.com</p>
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

export default TermsOfService; 