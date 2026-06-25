import React, { useState } from 'react';
import { X, Shield, CreditCard, Smartphone, Banknote, CheckCircle, Loader2, Lock } from 'lucide-react';

const RazorpayMockUI = ({ isOpen, onClose, onSuccess, amount, companyName = "Vistiqo", description = "Booking Payment" }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form states
  const [phone, setPhone] = useState('+91 ');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePhoneChange = (e) => {
    let val = e.target.value;
    if (!val.startsWith('+91 ')) {
      val = '+91 '; // Prevent deleting the prefix
    }
    let numbersOnly = val.slice(4).replace(/\D/g, ''); // Remove non-digits
    if (numbersOnly.length > 10) {
      numbersOnly = numbersOnly.slice(0, 10); // Limit to 10 digits
    }
    setPhone('+91 ' + numbersOnly);
  };

  const handleProceed = (e) => {
    e.preventDefault();
    if (phone.length === 14 && email.includes('@')) {
      setStep(2);
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setStep(1);
        setIsSuccess(false);
      }, 2000);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-sans transition-opacity">
      <div className="bg-white w-full max-w-[440px] rounded-[28px] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-300 ease-out flex flex-col relative">
        
        {/* Header Section */}
        <div className="p-8 pb-6 relative">
          <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-800 bg-gray-50 hover:bg-gray-100 p-2.5 rounded-full transition-all duration-200">
            <X size={20} />
          </button>
          
          <div className="flex justify-between items-center mb-6">
             <div>
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-2.5 h-2.5 rounded-full bg-[#1a73e8] animate-pulse"></div>
                 <span className="text-[11px] font-bold tracking-widest text-[#1a73e8] uppercase">Test Mode</span>
               </div>
               <h2 className="text-2xl font-bold tracking-tight text-gray-900">{companyName}</h2>
               <p className="text-gray-500 text-sm font-medium mt-1">{description}</p>
             </div>
          </div>
          
          <div className="flex items-baseline gap-1 mt-4">
             <span className="text-gray-500 text-2xl font-medium">₹</span>
             <span className="text-5xl font-black tracking-tight text-gray-900">{amount?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Body Section */}
        <div className="bg-white min-h-[400px] relative transition-all duration-500">
           {isSuccess ? (
              <div className="flex flex-col items-center justify-center h-[400px] animate-in fade-in zoom-in duration-500">
                 <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 scale-up-center relative">
                    <div className="absolute inset-0 bg-green-100 animate-ping rounded-full"></div>
                    <CheckCircle size={56} className="text-[#0f9d58] relative z-10" strokeWidth={2.5} />
                 </div>
                 <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Payment Successful</h3>
                 <p className="text-gray-600 text-sm mt-3 font-medium flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
                   <Loader2 size={16} className="animate-spin text-gray-400" /> Redirecting...
                 </p>
              </div>
           ) : isProcessing ? (
              <div className="flex flex-col items-center justify-center h-[400px] animate-in fade-in duration-300">
                 <div className="relative mb-8">
                   <div className="w-20 h-20 border-4 border-gray-100 border-t-[#1a73e8] rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Lock size={20} className="text-[#1a73e8]" />
                   </div>
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 tracking-tight">Processing Payment</h3>
                 <p className="text-gray-500 text-sm mt-3 text-center px-8 leading-relaxed font-medium">Please wait while we secure your transaction.</p>
                 <div className="mt-10 flex items-center gap-2 text-gray-500 text-[11px] font-bold uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                   <Shield size={14} className="text-[#1a73e8]" /> Secured by Razorpay
                 </div>
              </div>
           ) : step === 1 ? (
             <form onSubmit={handleProceed} className="p-8 h-full min-h-[400px] flex flex-col animate-in slide-in-from-right-8 duration-300">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">Contact Details</h3>
                
                <div className="space-y-6 flex-1">
                   <div className="relative group">
                     <input type="tel" value={phone} onChange={handlePhoneChange} maxLength={14} required id="phone" pattern="^\+91\s?[0-9]{10}$" title="Enter a valid 10-digit Indian phone number starting with +91" className="peer w-full bg-transparent border-2 border-gray-200 rounded-2xl px-4 pt-6 pb-2 text-gray-900 font-semibold text-[16px] outline-none focus:border-[#1a73e8] focus:bg-blue-50/10 transition-colors duration-200 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400" placeholder=" " />
                     <label htmlFor="phone" className="absolute left-4 top-4 text-gray-500 text-[15px] transition-all duration-200 peer-focus:-translate-y-2.5 peer-focus:text-[11px] peer-focus:text-[#1a73e8] peer-focus:font-bold peer-valid:-translate-y-2.5 peer-valid:text-[11px] peer-valid:font-bold peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-bold pointer-events-none">Phone Number</label>
                   </div>
                   <div className="relative group">
                     <input type="email" value={email} onChange={e => setEmail(e.target.value)} required id="email" className="peer w-full bg-transparent border-2 border-gray-200 rounded-2xl px-4 pt-6 pb-2 text-gray-900 font-semibold text-[16px] outline-none focus:border-[#1a73e8] focus:bg-blue-50/10 transition-colors duration-200 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-400" placeholder=" " />
                     <label htmlFor="email" className="absolute left-4 top-4 text-gray-500 text-[15px] transition-all duration-200 peer-focus:-translate-y-2.5 peer-focus:text-[11px] peer-focus:text-[#1a73e8] peer-focus:font-bold peer-valid:-translate-y-2.5 peer-valid:text-[11px] peer-valid:font-bold peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-bold pointer-events-none">Email Address</label>
                   </div>
                </div>

                <div className="mt-8">
                   <button type="submit" className="w-full bg-[#1a73e8] text-white font-bold text-[16px] py-4 rounded-full hover:bg-[#1557b0] hover:shadow-md active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2">
                      Continue
                   </button>
                </div>
             </form>
           ) : step === 2 ? (
             <div className="flex flex-col h-full min-h-[400px] animate-in slide-in-from-right-8 duration-300 p-8 pt-0">
                <div className="flex justify-between items-center mb-6 pt-8 border-t border-gray-100">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Method</h3>
                  <button onClick={() => setStep(1)} className="text-xs text-[#1a73e8] hover:text-[#1557b0] font-bold bg-blue-50 px-3 py-1.5 rounded-full">Edit Contact</button>
                </div>
                
                {/* Payment Methods */}
                <div className="flex gap-3 mb-6">
                   <button onClick={() => setPaymentMethod('card')} className={`flex-1 flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all duration-200 ${paymentMethod === 'card' ? 'bg-blue-50 border-[#1a73e8] text-[#1a73e8]' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-700'}`}>
                      <CreditCard size={24} className="mb-2" />
                      <span className="text-[11px] font-bold tracking-wide uppercase">Card</span>
                   </button>
                   <button onClick={() => setPaymentMethod('upi')} className={`flex-1 flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all duration-200 ${paymentMethod === 'upi' ? 'bg-blue-50 border-[#1a73e8] text-[#1a73e8]' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-700'}`}>
                      <Smartphone size={24} className="mb-2" />
                      <span className="text-[11px] font-bold tracking-wide uppercase">UPI</span>
                   </button>
                   <button onClick={() => setPaymentMethod('netbanking')} className={`flex-1 flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all duration-200 ${paymentMethod === 'netbanking' ? 'bg-blue-50 border-[#1a73e8] text-[#1a73e8]' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-gray-200 hover:text-gray-700'}`}>
                      <Banknote size={24} className="mb-2" />
                      <span className="text-[11px] font-bold tracking-wide uppercase">Netbanking</span>
                   </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                   {paymentMethod === 'card' && (
                     <div className="space-y-3 animate-in fade-in duration-300">
                        <div>
                          <input type="text" placeholder="Card Number" value="4111 1111 1111 1111" readOnly className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 text-gray-700 font-semibold text-[15px] outline-none cursor-not-allowed" />
                        </div>
                        <div className="flex gap-3">
                           <input type="text" placeholder="Expiry" value="12/28" readOnly className="w-1/2 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 text-gray-700 font-semibold text-[15px] outline-none cursor-not-allowed" />
                           <input type="text" placeholder="CVV" value="123" readOnly className="w-1/2 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 text-gray-700 font-semibold text-[15px] outline-none cursor-not-allowed" />
                        </div>
                        <div>
                          <input type="text" placeholder="Cardholder Name" value="Test User" readOnly className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-3.5 text-gray-700 font-semibold text-[15px] outline-none cursor-not-allowed" />
                        </div>
                     </div>
                   )}
                   {paymentMethod !== 'card' && (
                     <div className="flex-1 flex items-center justify-center text-gray-500 text-[15px] font-semibold animate-in fade-in duration-300 bg-gray-50 rounded-2xl border-2 border-gray-100 border-dashed overflow-hidden">
                       {paymentMethod === 'upi' ? (
                          <div className="flex flex-col items-center justify-center">
                             <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="UPI QR Code" className="w-32 h-32 opacity-80 mix-blend-multiply" />
                             <span className="text-[10px] mt-3 font-bold tracking-widest uppercase text-gray-400">Scan to Pay</span>
                          </div>
                       ) : 'Select Bank from list'}
                     </div>
                   )}
                   
                   <button onClick={handlePayment} className="w-full bg-[#1a73e8] text-white font-bold text-[16px] py-4 rounded-full hover:bg-[#1557b0] hover:shadow-md active:scale-[0.98] transition-all duration-200 mt-6 flex justify-center items-center gap-2 group">
                     Pay <span className="text-white">₹{amount?.toLocaleString('en-IN')}</span>
                   </button>
                </div>
             </div>
           ) : null}
        </div>
        
        {/* Footer */}
        {(!isProcessing && !isSuccess) && (
          <div className="bg-gray-50/50 px-8 py-5 flex justify-between items-center rounded-b-[28px]">
             <div className="flex items-center gap-1.5">
               <Shield size={14} className="text-gray-400" />
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vistiqo Secured</span>
             </div>
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 cursor-pointer transition">English</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default RazorpayMockUI;
