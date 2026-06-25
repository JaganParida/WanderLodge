import { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageCircle, FileText, Shield, CreditCard, User, Globe } from 'lucide-react';

const faqs = [
  {
    category: "Booking & Payments",
    icon: <CreditCard className="w-6 h-6 text-airbnb" />,
    questions: [
      { q: "How do I securely pay for my reservation?", a: "All payments are securely processed through our platform. We accept major credit cards, PayPal, and Apple/Google Pay. Never pay outside of WanderLodge to stay protected under our guest guarantee." },
      { q: "What is the cancellation policy?", a: "Cancellation policies vary by listing and host. You can find the specific cancellation policy on the listing details page before you book, and in your itinerary after booking." },
      { q: "When will I be charged?", a: "You'll be charged the full amount when your booking is confirmed by the host. For some longer stays, a payment plan may be available at checkout." }
    ]
  },
  {
    category: "Your Account",
    icon: <User className="w-6 h-6 text-airbnb" />,
    questions: [
      { q: "How do I reset my password?", a: "Click on 'Forgot Password' on the login screen, enter your email, and we will send you a secure link to reset your password." },
      { q: "How can I update my profile information?", a: "Go to your Dashboard, click on 'Edit Profile', and you can update your photo, contact info, and preferences." }
    ]
  },
  {
    category: "Safety & Hosting",
    icon: <Shield className="w-6 h-6 text-airbnb" />,
    questions: [
      { q: "Is WanderLodge safe?", a: "We take safety seriously. All users must verify their identity, and our platform includes secure messaging, secure payments, and a 24/7 global support team." },
      { q: "How do I become a host?", a: "Click on 'WanderLodge your home' at the top right of any page. We'll guide you through setting up your listing, pricing, and availability." }
    ]
  }
];

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full py-5 flex items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-gray-900 text-lg">{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0"}`}
      >
        <p className="text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-br from-airbnb/10 via-white to-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How can we help?</h1>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search for articles, questions, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 p-5 text-lg border border-gray-200 rounded-2xl shadow-lg focus:outline-none focus:border-airbnb focus:ring-2 focus:ring-airbnb/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-5xl mx-auto px-4 py-12 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Getting Started</h3>
            <p className="text-sm text-gray-500">Guides for new guests and hosts.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Policies</h3>
            <p className="text-sm text-gray-500">Read about our rules and terms.</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Contact Support</h3>
            <p className="text-sm text-gray-500">We're here 24/7 to help you.</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-8">
          {faqs.map((section, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                {section.icon}
                <h3 className="text-xl font-bold text-gray-900">{section.category}</h3>
              </div>
              <div>
                {section.questions.map((q, qIdx) => (
                  <FaqItem key={qIdx} question={q.q} answer={q.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Still need help */}
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
        <p className="text-gray-500 mb-8">Our support team is available around the clock to assist you.</p>
        <button className="bg-black text-white font-bold py-4 px-8 rounded-xl hover:bg-gray-800 transition shadow-lg active:scale-95">
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default HelpCenter;
