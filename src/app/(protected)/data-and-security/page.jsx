"use client";

import SectionContainer from "../../components/SectionContainer";

const DataSecurityPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <SectionContainer className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-black mb-4">Data & Security</h1>
        
        <p className="text-gray-700 mb-4">
          At JobKar, we prioritize your data privacy and security. We implement industry-standard
          measures to protect your personal information and ensure a safe job-seeking experience.
        </p>
        
        <h2 className="text-xl font-semibold text-black mt-4">Data Collection & Usage</h2>
        <p className="text-gray-700 mb-4">
          We collect only the necessary data required to provide you with job recommendations and
          application tracking. Your information is never sold to third parties.
        </p>
        
        <h2 className="text-xl font-semibold text-black mt-4">Security Measures</h2>
        <p className="text-gray-700 mb-4">
          Our platform uses encryption, secure authentication, and regular security audits to
          prevent unauthorized access to your data.
        </p>
        
        <h2 className="text-xl font-semibold text-black mt-4">Your Control & Rights</h2>
        <p className="text-gray-700 mb-4">
          You can update, download, or delete your data anytime from your account settings. If you
          have any concerns, feel free to contact our support team.
        </p>
        
        <h2 className="text-xl font-semibold text-black mt-4">Report a Security Issue</h2>
        <p className="text-gray-700">
          If you notice any security vulnerabilities or privacy concerns, please report them to us
          immediately at <a href="mailto:security@jobkar.com" className="text-blue-600">security@jobkar.com</a>.
        </p>
      </SectionContainer>
    </div>
  );
};

export default DataSecurityPage;
