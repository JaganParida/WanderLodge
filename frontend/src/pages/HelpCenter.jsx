import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  FileText,
  Shield,
  CreditCard,
  User,
  Globe,
  HelpCircle,
} from "lucide-react";

const faqs = [
  {
    category: "Booking & Payments",
    icon: <CreditCard className="w-7 h-7 text-airbnb" />,
    questions: [
      {
        q: "How do I securely pay for my reservation?",
        a: "All payments are securely processed through our Razorpay integration. We accept UPI, RuPay, Visa, Mastercard, and Netbanking. Never pay outside of WanderLodge to stay protected under our guest guarantee.",
      },
      {
        q: "What is the cancellation policy?",
        a: "Cancellation policies vary by listing and host. You can find the specific cancellation policy on the listing details page before you book, and in your itinerary after booking.",
      },
      {
        q: "Are the prices shown in INR?",
        a: "Yes, by default all prices are displayed in Indian Rupees (₹). You can change your preferred currency in your account settings at any time.",
      },
    ],
  },
  {
    category: "Your Account",
    icon: <User className="w-7 h-7 text-airbnb" />,
    questions: [
      {
        q: "How do I reset my password?",
        a: "Click on 'Forgot Password' on the login screen, enter your email, and we will send you a secure link to reset your password instantly.",
      },
      {
        q: "How can I update my profile information?",
        a: "Go to your Dashboard, click on 'Edit Profile', and you can update your photo, contact info, and language preferences.",
      },
    ],
  },
  {
    category: "Safety & Support",
    icon: <Shield className="w-7 h-7 text-airbnb" />,
    questions: [
      {
        q: "How do I contact Customer Support in India?",
        a: "Our Indian support team is available 24/7. You can instantly chat with the WanderLodge AI Concierge using the chat bubble at the bottom right, or email us at support@wanderlodge.in.",
      },
      {
        q: "How do I become a host?",
        a: "Click on 'Become a host' at the top right of any page. We'll guide you through setting up your listing, pricing in INR, and availability.",
      },
    ],
  },
];

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0 group">
      <button
        className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={`font-semibold text-lg transition-colors duration-200 ${isOpen ? "text-airbnb" : "text-gray-900 group-hover:text-airbnb"}`}
        >
          {question}
        </span>
        <div
          className={`p-2 rounded-full transition-colors duration-200 ${isOpen ? "bg-airbnb/10" : "bg-transparent group-hover:bg-gray-50"}`}
        >
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-airbnb" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-airbnb" />
          )}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0"}`}
      >
        <p className="text-gray-600 leading-relaxed text-lg pr-12">{answer}</p>
      </div>
    </div>
  );
};

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Premium Hero Search Section */}
      <div className="relative bg-gradient-to-br from-airbnb to-rose-600 py-24 px-4 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute top-32 right-12 w-72 h-72 rounded-full bg-orange-400 blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-8 tracking-tight drop-shadow-sm">
            Hi, how can we help?
          </h1>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-7 w-7 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for questions, features, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 p-6 text-xl text-gray-900 border-0 rounded-full shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/40 transition-all bg-white/95 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-6xl mx-auto px-4 py-16 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Globe,
              title: "Getting Started",
              desc: "Guides for new Indian guests and hosts.",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              icon: FileText,
              title: "Policies & Rules",
              desc: "Read about our safety and hosting terms.",
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              icon: HelpCircle,
              title: "Chat with AI",
              desc: "Use the AI Concierge for instant answers.",
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center border border-gray-100 group"
            >
              <div
                className={`w-16 h-16 ${item.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <item.icon className={`w-8 h-8 ${item.color}`} />
              </div>
              <h3 className="font-bold text-gray-900 text-xl mb-3">
                {item.title}
              </h3>
              <p className="text-gray-500 text-base">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-12 text-center tracking-tight">
          Frequently Asked Questions
        </h2>

        <div className="space-y-8">
          {faqs.map((section, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-gray-200/60 p-8 shadow-lg shadow-gray-100/50"
            >
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="p-3 bg-rose-50 rounded-2xl">{section.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {section.category}
                </h3>
              </div>
              <div className="px-2">
                {section.questions.map((q, qIdx) => (
                  <FaqItem key={qIdx} question={q.q} answer={q.a} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Still need help */}
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="bg-gray-900 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-airbnb/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-4">
              Still need help?
            </h2>
            <p className="text-gray-400 mb-10 text-lg">
              Our WanderLodge India support team is available around the clock
              to assist you.
            </p>
            <button
              onClick={() =>
                (window.location.href = "mailto:support@wanderlodge.in")
              }
              className="bg-airbnb text-white font-bold text-lg py-4 px-10 rounded-full hover:bg-rose-600 transition-all duration-300 shadow-[0_0_20px_rgba(255,56,92,0.4)] hover:shadow-[0_0_30px_rgba(255,56,92,0.6)] active:scale-95"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
