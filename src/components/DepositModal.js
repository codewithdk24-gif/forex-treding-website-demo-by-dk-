'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useTradeStore } from '@/store/useTradeStore';

export default function DepositModal({ isOpen, onClose }) {
  const { user, loading } = useAuth();
  const showNotification = useTradeStore(state => state.showNotification);
  
  const [amount, setAmount] = useState('');
  const [utr, setUtr] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Architectural Guard: Block rendering until auth state is confirmed
  if (!isOpen) return null;
  if (loading) return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="animate-pulse text-white font-black tracking-widest uppercase">Initializing Node...</div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Strict Guard: Ensure user is available at submit time
    const userId = user?.id;
    
    if (!userId) {
      console.error("Submission blocked: No User ID");
      showNotification({ type: 'ERROR', message: 'Authentication required to proceed' });
      return;
    }

    if (!file || !amount || !utr) {
      showNotification({ type: 'ERROR', message: 'Please fill all fields and upload screenshot' });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload Screenshot
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      const filePath = `screenshots/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('deposits')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('deposits')
        .getPublicUrl(filePath);

      // 3. Save to Database
      const { error: dbError } = await supabase
        .from('deposits')
        .insert({
          user_id: userId,
          amount: parseFloat(amount),
          utr: utr,
          screenshot_url: publicUrl,
          status: 'pending'
        });

      if (dbError) throw dbError;

      showNotification({ type: 'SUCCESS', message: 'Deposit request submitted successfully' });
      onClose();
      // Reset form
      setAmount('');
      setUtr('');
      setFile(null);
    } catch (err) {
      console.error('Deposit Error:', err);
      showNotification({ type: 'ERROR', message: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#131722] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-fade-in">
        
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-blue-600/5">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Institutional Deposit</h2>
            <p className="text-xs text-blue-500 font-bold uppercase tracking-widest mt-1">Direct Node Funding v2.4</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Step 1: QR Code */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-[10px] font-black">01</div>
              <p className="text-xs font-black text-white uppercase tracking-widest">Scan & Pay via UPI</p>
            </div>
            <div className="flex flex-col items-center bg-white p-6 rounded-3xl shadow-inner">
               <img 
                 src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=your-upi-id@bank%26pn=ForexPro%26cu=INR" 
                 alt="UPI QR Code"
                 className="w-48 h-48"
               />
               <p className="mt-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Authorized Merchant: ForexPro Terminal</p>
            </div>
          </div>

          {/* Step 2: Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-[10px] font-black">02</div>
              <p className="text-xs font-black text-white uppercase tracking-widest">Verification Details</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Amount (INR)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="5000" 
                  required
                  className="w-full bg-[#0f1115] border border-white/5 rounded-xl py-4 px-5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">UTR / Transaction ID</label>
                <input 
                  type="text" 
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="12 digit number" 
                  required
                  className="w-full bg-[#0f1115] border border-white/5 rounded-xl py-4 px-5 text-sm text-white focus:outline-none focus:border-blue-500 transition-all" 
                />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Payment Screenshot</label>
               <div className="relative h-32 w-full bg-[#0f1115] border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 transition-all overflow-hidden group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  {file ? (
                    <div className="flex items-center gap-3 text-blue-500 font-bold text-xs uppercase">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      {file.name}
                    </div>
                  ) : (
                    <>
                      <svg className="text-gray-700 mb-2 group-hover:text-blue-500 transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Click to upload proof</span>
                    </>
                  )}
               </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 text-white text-xs font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-4"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Transmitting...</span>
                </>
              ) : (
                <span>Submit Deposit Request</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
