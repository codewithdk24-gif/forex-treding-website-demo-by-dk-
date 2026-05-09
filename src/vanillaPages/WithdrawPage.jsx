'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../store/useStore';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft,
  Building2,
  Smartphone,
  Coins,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Zap,
  Info,
  Loader2,
  History,
  ArrowUpRight,
  ChevronRight,
  ShieldCheck,
  Globe,
  Lock,
  UserCheck,
  Fingerprint,
  Activity,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

const WithdrawPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('BANK');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Input, 2: Processing, 3: Success
  const [txStatus, setTxStatus] = useState('INITIATED');
  
  const amountInputRef = useRef(null);

  const wallet = useStore(state => state.wallet);
  const trades = useStore(state => state.trades) || [];
  const executeTransaction = useStore(state => state.executeTransaction);
  const showNotification = useStore(state => state.showNotification);

  // Calculate Free Margin (Available for Withdrawal)
  const freeMargin = useMemo(() => {
    let marginUsed = 0;
    let activePnl = 0;
    const activeOrders = Array.isArray(trades) ? trades.filter(o => o.status === 'ACTIVE') : [];
    
    activeOrders.forEach(o => {
       marginUsed += parseFloat(o.size) * 1000;
       activePnl += parseFloat(o.pl || 0);
    });

    return (wallet?.balance || 0) + activePnl - marginUsed;
  }, [trades, wallet?.balance]);

  const paymentMethods = [
    { 
      id: 'BANK', 
      name: 'Verified Bank Account', 
      icon: <Building2 size={24} />, 
      time: '1-3 Banking Days', 
      fee: '$2.00 Flat', 
      badge: 'Secure Wire',
      color: 'text-blue-500', 
      desc: 'Direct payout to your institutional clearing account' 
    },
    { 
      id: 'CRYPTO', 
      name: 'Stablecoin (USDT)', 
      icon: <Coins size={24} />, 
      time: '10-30 Mins', 
      fee: '$1.00 Network', 
      badge: 'Ultra Fast',
      color: 'text-orange-500', 
      desc: 'Immediate blockchain liquidity release (TRC20/ERC20)' 
    },
    { 
      id: 'CARD', 
      name: 'Original Funding Card', 
      icon: <CreditCard size={24} />, 
      time: '3-5 Banking Days', 
      fee: 'Zero Fee', 
      badge: 'Standard',
      color: 'text-purple-500', 
      desc: 'Reversal to source funding source via card network' 
    },
  ];

  const quickPercentages = [25, 50, 75, 100];

  const handleWithdraw = async () => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 10) {
      showNotification({ type: 'ERROR', message: 'Min withdrawal is $10.00' });
      return;
    }

    if (val > freeMargin) {
      showNotification({ type: 'ERROR', message: 'Insufficient Available Margin' });
      return;
    }

    setStep(2);
    setTxStatus('AUTHENTICATING');
    setIsProcessing(true);

    // Institutional simulation steps with security focus
    setTimeout(() => setTxStatus('VERIFYING COMPLIANCE'), 1500);
    setTimeout(() => setTxStatus('SECURING PAYOUT NODE'), 3000);
    setTimeout(() => setTxStatus('RELEASING FUNDS'), 4500);

    setTimeout(async () => {
      const success = await executeTransaction(user.id, 'WITHDRAW', val);
      if (success) {
        setTxStatus('COMPLETED');
        setStep(3);
      } else {
        setStep(1);
        setIsProcessing(false);
      }
    }, 6000);
  };

  const formatCurrency = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col selection:bg-blue-500/30 font-inter safe-area-top overflow-x-hidden">
      
      {/* Institutional Top Navigation */}
      <nav className="h-20 border-b border-white/[0.05] flex items-center justify-between px-4 md:px-10 bg-[#0d1117]/80 backdrop-blur-2xl sticky top-0 z-[100]">
        <div className="flex items-center gap-4 md:gap-8">
          <button 
            onClick={() => router.push('/wallet')}
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all py-2 pr-4 border-r border-white/5"
          >
            <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:bg-white/10 group-active:scale-95 transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Back to Hub</span>
          </button>
          <div className="space-y-0.5">
            <h1 className="text-heading-3 text-white flex items-center gap-2">
              Liquidity <span className="text-blue-500">Release</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-500 text-[8px] font-black uppercase tracking-widest border border-rose-500/20 ml-2">High Security</span>
            </h1>
            <p className="text-subtitle">Global Payout Clearing Terminal</p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-10">
           <div className="hidden lg:flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="text-right">
                 <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest leading-none mb-1">Available Margin</p>
                 <p className="text-xs font-black text-white tabular-nums leading-none">{formatCurrency(freeMargin)}</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                 <ArrowUpRight size={16} />
              </div>
           </div>
           <div className="flex items-center gap-2 md:gap-3 text-emerald-500">
              <div className="relative">
                <ShieldCheck size={18} className="animate-pulse" />
                <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full blur-[2px]"></div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Secured Node</span>
           </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-[1600px] mx-auto flex flex-col md:p-6 lg:p-10">
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full">
            
            {/* Left: Configuration & Security */}
            <div className="lg:col-span-7 space-y-6 lg:space-y-10 px-4 md:px-0">
               <section className="space-y-6 pt-4 md:pt-0">
                  <div className="flex items-center gap-3">
                     <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                     <h2 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Settlement Destination</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {paymentMethods.map(m => (
                       <button 
                         key={m.id}
                         onClick={() => setPaymentMethod(m.id)}
                         className={`group p-6 rounded-[2.25rem] border text-left transition-all duration-300 relative overflow-hidden flex flex-col h-full
                         ${paymentMethod === m.id 
                           ? 'bg-blue-600 border-transparent shadow-2xl shadow-blue-600/30 scale-[1.02] z-10' 
                           : 'bg-[#131722]/50 border-white/[0.05] hover:border-white/20 hover:bg-[#1c2230]'}`}
                       >
                          {paymentMethod === m.id && (
                            <div className="absolute top-6 right-6 text-white bg-white/20 p-1.5 rounded-full backdrop-blur-md animate-in zoom-in-50">
                               <CheckCircle2 size={16} />
                            </div>
                          )}
                          
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10 transition-all duration-500
                             ${paymentMethod === m.id ? 'bg-white text-blue-600 scale-110' : 'bg-white/[0.03] text-gray-400 group-hover:text-blue-500 group-hover:scale-105'}`}>
                             {m.icon}
                          </div>
                          
                          <div className="space-y-1 mt-auto">
                            <p className={`text-sm font-black uppercase tracking-tight transition-colors ${paymentMethod === m.id ? 'text-white' : 'text-white'}`}>
                              {m.name}
                            </p>
                            <p className={`text-[10px] font-bold leading-tight uppercase tracking-tighter transition-colors ${paymentMethod === m.id ? 'text-white/70' : 'text-gray-500'}`}>
                              {m.desc}
                            </p>
                          </div>

                          <div className={`flex justify-between items-center mt-6 pt-5 border-t transition-colors ${paymentMethod === m.id ? 'border-white/10' : 'border-white/[0.05]'}`}>
                             <div className="space-y-0.5">
                                <p className={`text-[8px] font-black uppercase tracking-widest ${paymentMethod === m.id ? 'text-white/50' : 'text-gray-600'}`}>Clearing ETA</p>
                                <p className={`text-[10px] font-black uppercase ${paymentMethod === m.id ? 'text-white' : 'text-white'}`}>{m.time}</p>
                             </div>
                             <div className="text-right space-y-0.5">
                                <p className={`text-[8px] font-black uppercase tracking-widest ${paymentMethod === m.id ? 'text-white/50' : 'text-gray-600'}`}>Transfer Fee</p>
                                <p className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${paymentMethod === m.id ? 'bg-white/20 text-white' : 'bg-rose-500/10 text-rose-500'}`}>{m.fee}</p>
                             </div>
                          </div>
                       </button>
                     ))}
                  </div>
               </section>

               <section className="bg-[#131722]/50 border border-white/[0.05] rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden group">
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-600/5 rounded-full blur-3xl group-hover:bg-rose-600/10 transition-all duration-700"></div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <ShieldAlert className="text-rose-500" size={18} />
                       <h3 className="text-[11px] font-black text-white uppercase tracking-widest">Compliance & Audit Lock</h3>
                    </div>
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                       <Lock size={12} />
                       Secured Channel
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                     {[
                       { label: 'Daily Remaining', val: '$50,000.00', icon: <Globe size={14} /> },
                       { label: 'Margin Status', val: 'Healthy', icon: <Zap size={14} /> },
                       { label: '2FA Auth', val: 'Activated', icon: <Fingerprint size={14} /> },
                       { label: 'KYC Level', val: 'Institutional', icon: <UserCheck size={14} /> },
                     ].map((item, idx) => (
                       <div key={idx} className="space-y-2">
                          <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest flex items-center gap-1.5">
                            {item.icon} {item.label}
                          </p>
                          <p className="text-[11px] font-black text-white uppercase tabular-nums tracking-tighter">{item.val}</p>
                       </div>
                     ))}
                  </div>
               </section>

               <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-3xl flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 shrink-0">
                     <Info size={24} />
                  </div>
                  <div>
                     <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1">Financial Compliance Notice</p>
                     <p className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase tracking-tighter">
                        Withdrawals are processed following a 24-hour cooling period for new funding methods. Capital release is subject to active margin availability. Floating PnL is excluded from the available withdrawal balance to ensure account stability.
                     </p>
                  </div>
               </div>
            </div>

            {/* Right: Execution Terminal */}
            <div className="lg:col-span-5 px-4 md:px-0 pb-10 lg:pb-0">
               <div className="bg-gradient-to-br from-[#1e222d] to-[#0d1117] border border-white/[0.08] rounded-[2.5rem] p-8 lg:p-10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] sticky top-24 space-y-10">
                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                       <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Release Amount (USD)</p>
                       <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Available: {formatCurrency(freeMargin)}</p>
                    </div>

                    <div className="relative group flex items-center">
                       <div className="absolute left-8 text-3xl font-black text-gray-700 group-focus-within:text-blue-500 transition-colors leading-none">$</div>
                       <input 
                         ref={amountInputRef}
                         type="number" 
                         value={amount}
                         onChange={(e) => setAmount(e.target.value)}
                         placeholder="0.00"
                         className="w-full h-28 bg-black/20 border border-white/10 rounded-[1.75rem] pl-16 pr-8 text-5xl font-black text-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600/50 transition-all placeholder:text-gray-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                       />
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                       {quickPercentages.map(p => (
                         <button 
                           key={p} 
                           onClick={() => setAmount(Math.floor((freeMargin * p) / 100).toString())} 
                           className="py-3.5 bg-white/[0.03] border border-white/5 rounded-2xl text-[10px] font-black text-gray-500 hover:text-white hover:bg-white/10 transition-all active:scale-95 uppercase tracking-widest"
                         >
                           {p}%
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-8 border-t border-white/[0.05] pt-10">
                     <div className="space-y-5 bg-white/[0.02] p-6 rounded-3xl border border-white/5 shadow-inner">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Target Node</span>
                           <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{paymentMethod}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Clearing Fee</span>
                           <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{paymentMethods.find(m => m.id === paymentMethod)?.fee}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Available Margin</span>
                           <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{formatCurrency(freeMargin)}</span>
                        </div>
                        <div className="pt-4 mt-2 border-t border-white/[0.05] flex justify-between items-center">
                           <span className="text-[11px] font-black text-white uppercase tracking-widest">Estimated Payout</span>
                           <span className="text-lg font-black text-white tabular-nums leading-none">
                              {amount ? formatCurrency(parseFloat(amount) - (paymentMethod === 'BANK' ? 2 : (paymentMethod === 'CRYPTO' ? 1 : 0))) : '$0.00'}
                           </span>
                        </div>
                     </div>
                     
                     <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-4 p-5 bg-rose-600/5 rounded-2xl border border-rose-600/20 border-dashed">
                           <ShieldAlert className="text-rose-500 shrink-0" size={16} />
                           <p className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase tracking-tighter">
                              All capital releases are audited by the risk management desk. Funds may be held if active trade margin level drops below 150%.
                           </p>
                        </div>
                        
                        {/* Mobile Sticky Button Wrapper */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0d1117]/95 backdrop-blur-xl md:static md:p-0 md:bg-transparent md:backdrop-blur-none z-[110] border-t border-white/5 md:border-t-0 shadow-[0_-20px_40px_rgba(0,0,0,0.4)] md:shadow-none" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
                           <button 
                             onClick={handleWithdraw}
                             disabled={isProcessing}
                             className="w-full py-6 rounded-2xl bg-white/[0.05] border border-white/10 text-white text-[12px] font-black uppercase tracking-[0.3em] hover:bg-white/10 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                           >
                             {isProcessing ? <Loader2 size={18} className="animate-spin" /> : (
                               <>
                                 Confirm Withdrawal
                                 <ArrowRight size={18} className="animate-in slide-in-from-left-4 repeat-infinite duration-1000" />
                               </>
                             )}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* STEP 2: Processing Lifecycle */}
        {step === 2 && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center space-y-12 animate-in zoom-in-95 duration-500">
             <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 border-8 border-rose-600/10 rounded-full"></div>
                <div className="absolute inset-0 border-8 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-[#1e222d] flex flex-col items-center justify-center border border-white/5 shadow-2xl">
                   <Lock size={64} className="text-blue-500 animate-pulse mb-6 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                   <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-1">Verifying Node</p>
                   <p className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Multi-Sig Authorization</p>
                </div>
             </div>
             
             <div className="space-y-4 max-w-sm">
                <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter tabular-nums leading-none">{txStatus}</h3>
                <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] animate-pulse">Requesting Institutional Liquidity Release...</p>
             </div>

             <div className="w-full max-w-md mx-auto space-y-8">
                <div className="flex items-center justify-between relative px-2">
                   <div className="absolute h-[2px] bg-white/5 left-10 right-10 top-3 -z-10"></div>
                   <div className={`absolute h-[2px] bg-blue-600 left-10 transition-all duration-1000 top-3 -z-10 ${txStatus === 'SECURING PAYOUT NODE' ? 'w-[45%]' : txStatus === 'RELEASING FUNDS' ? 'w-[85%]' : 'w-0'}`}></div>
                   {[1, 2, 3].map(s => (
                      <div key={s} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${txStatus === 'COMPLETED' || (s === 1) || (s === 2 && (txStatus === 'SECURING PAYOUT NODE' || txStatus === 'RELEASING FUNDS')) || (s === 3 && txStatus === 'RELEASING FUNDS') ? 'bg-blue-600 border-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-[#0d1117] border-white/10'}`}>
                         <CheckCircle2 size={12} className="text-white" />
                      </div>
                   ))}
                </div>
                <div className="flex justify-between px-2 opacity-40">
                   <span className="text-[8px] font-black text-white uppercase tracking-widest">Verification</span>
                   <span className="text-[8px] font-black text-white uppercase tracking-widest">Audit Check</span>
                   <span className="text-[8px] font-black text-white uppercase tracking-widest">Liquidity Release</span>
                </div>
             </div>
          </div>
        )}

        {/* STEP 3: Success Terminal */}
        {step === 3 && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center space-y-12 animate-in slide-in-from-bottom-8 duration-700">
             <div className="w-48 h-48 rounded-[3.5rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-[0_0_100px_rgba(16,185,129,0.15)] relative group">
                <div className="absolute inset-0 rounded-[3.5rem] border border-emerald-500/30 animate-ping opacity-20 group-hover:animate-none"></div>
                <CheckCircle2 size={80} className="text-emerald-500 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
             </div>
             
             <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">Payout Initialized</h2>
                <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em]">Withdrawal Node Sequence Started Successfully</p>
             </div>

             <div className="w-full max-w-lg bg-[#131722]/50 border border-white/[0.08] rounded-[3rem] p-10 space-y-8 shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                   <div className="text-center md:text-left space-y-2">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Amount Released</p>
                      <p className="text-4xl font-black text-white tabular-nums leading-none">{formatCurrency(amount)}</p>
                   </div>
                   <div className="h-12 w-[1px] bg-white/5 hidden md:block"></div>
                   <div className="text-center md:text-right space-y-2">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Destination</p>
                      <p className="text-xl font-black text-blue-500 uppercase leading-none">{paymentMethod}</p>
                   </div>
                </div>
                
                <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Reference ID</p>
                      <p className="text-[10px] font-mono text-white uppercase tracking-wider">WD-{Math.random().toString(36).substring(7).toUpperCase()}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Processing Start</p>
                      <p className="text-[10px] font-mono text-white uppercase tracking-wider">{new Date().toLocaleTimeString()}</p>
                   </div>
                </div>
             </div>

             <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg pb-10">
                <button 
                  onClick={() => router.push('/wallet')}
                  className="flex-1 py-6 bg-white/[0.05] hover:bg-white/[0.1] text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 border border-white/5"
                >
                  Return to Hub
                </button>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 py-6 bg-blue-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest shadow-[0_20px_50px_rgba(59,130,246,0.3)] hover:bg-blue-500 transition-all active:scale-95 ring-1 ring-white/10"
                >
                  Back to Terminal
                </button>
             </div>
          </div>
        )}
      </main>

      {/* Institutional Security Footer */}
      <footer className="border-t border-white/[0.05] bg-black/20 p-8 md:p-10 mt-auto">
         <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 md:gap-10 opacity-30">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-blue-500" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">Bank-Grade Encryption</span>
               </div>
               <div className="flex items-center gap-3">
                  <Globe size={18} className="text-blue-500" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">Global Liquidity Provider</span>
               </div>
               <div className="flex items-center gap-3">
                  <Fingerprint size={18} className="text-blue-500" />
                  <span className="text-[9px] font-black text-white uppercase tracking-widest">Biometric Identity Guard</span>
               </div>
            </div>
            <div className="flex items-center gap-4 text-[9px] font-black text-gray-600 uppercase tracking-widest opacity-40">
               <span>ForexPro Institutional Infrastructure v2.4.0</span>
               <div className="w-1 h-1 bg-gray-700 rounded-full"></div>
               <span>{new Date().getFullYear()} © All Rights Reserved</span>
            </div>
         </div>
      </footer>
    </div>
  );
};

export default WithdrawPage;
