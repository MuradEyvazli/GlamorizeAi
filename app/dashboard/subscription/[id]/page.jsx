'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaCheckCircle, 
  FaCreditCard, 
  FaShieldAlt, 
  FaRocket, 
  FaCrown, 
  FaGem,
  FaRegClock,
  FaLock,
  FaMagic
} from 'react-icons/fa';
import Image from 'next/image';

const Subscription = () => {
  const { data: session } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [agreed, setAgreed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Kart bilgileri için state'ler
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  // Fake kart bilgilerini doldur
  const fillFakeCardDetails = () => {
    // Stripe test kartı ve rastgele değerler
    setCardNumber('4242 4242 4242 4242');
    
    // Bugünden 2-3 yıl sonrası için rastgele bir son kullanma tarihi
    const currentYear = new Date().getFullYear();
    const randomYear = currentYear + 2 + Math.floor(Math.random() * 2);
    const randomMonth = 1 + Math.floor(Math.random() * 12);
    const formattedMonth = randomMonth < 10 ? `0${randomMonth}` : randomMonth;
    const formattedYear = randomYear.toString().substr(2, 2);
    setExpiryDate(`${formattedMonth}/${formattedYear}`);
    
    // Rastgele 3 haneli CVC
    const randomCVC = 100 + Math.floor(Math.random() * 900);
    setCvc(randomCVC.toString());
  };

  // Simüle edilmiş plan özellikleri - gerçek veriler API'den gelecek
  const planFeatures = {
    basic: [
      { text: 'AI Outfit Analysis', icon: <FaRocket className="text-blue-400" /> },
      { text: 'Basic Style Recommendations', icon: <FaCheckCircle className="text-green-500" /> },
      { text: '10 Virtual Try-ons per month', icon: <FaRegClock className="text-amber-500" /> },
      { text: 'Community Access', icon: <FaShieldAlt className="text-purple-400" /> }
    ],
    premium: [
      { text: 'Everything in Basic', icon: <FaRocket className="text-blue-400" /> },
      { text: 'Unlimited Virtual Try-ons', icon: <FaRegClock className="text-amber-500" /> },
      { text: 'Advanced Style Analysis', icon: <FaGem className="text-indigo-500" /> },
      { text: 'Personalized Recommendations', icon: <FaCrown className="text-purple-500" /> },
      { text: 'Priority Support', icon: <FaShieldAlt className="text-green-500" /> }
    ],
    professional: [
      { text: 'Everything in Premium', icon: <FaCrown className="text-purple-500" /> },
      { text: 'API Access', icon: <FaLock className="text-blue-600" /> },
      { text: 'White Label Integration', icon: <FaGem className="text-indigo-500" /> },
      { text: 'Dedicated Account Manager', icon: <FaShieldAlt className="text-green-500" /> },
      { text: 'Custom Features', icon: <FaRocket className="text-amber-500" /> }
    ]
  };

  const getPlanFeatures = (planName) => {
    const name = planName.toLowerCase();
    if (name.includes('basic')) return planFeatures.basic;
    if (name.includes('premium')) return planFeatures.premium;
    if (name.includes('pro')) return planFeatures.professional;
    return planFeatures.basic;
  };

  // Hangi plan icon'unu göstereceğimizi belirleyen yardımcı fonksiyon
  const getPlanIcon = (planName) => {
    const name = planName?.toLowerCase() || '';
    if (name.includes('basic')) return <FaRocket className="text-blue-400 text-4xl" />;
    if (name.includes('premium')) return <FaCrown className="text-purple-500 text-4xl" />;
    if (name.includes('pro')) return <FaGem className="text-amber-500 text-4xl" />;
    return <FaRocket className="text-blue-400 text-4xl" />;
  };

  useEffect(() => {
    if (id) {
      const fetchSubscription = async () => {
        try {
          const response = await fetch(`/api/single-sub/${id}`);
          const data = await response.json();
          if (response.ok) {
            setSubscription(data);
          } else {
            console.error(data.error);
          }
        } catch (error) {
          console.error("Error fetching subscription data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSubscription();
    }
  }, [id]);

  const handleSubscription = async () => {
    if (!agreed) {
      alert('Please agree to the terms and conditions');
      return;
    }

    if (session) {
      try {
        setShowConfirmation(true);
      } catch (error) {
        console.error('Error during subscription:', error);
      }
    }
  };

  const confirmSubscription = async () => {
    try {
      const response = await fetch('/api/user/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.user.id,
          subscriptionId: id
        })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Subscription successful!');
        router.push('/dashboard'); // Redirect to user's dashboard
      } else {
        alert(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Error during subscription:', error);
    } finally {
      setShowConfirmation(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-transparent border-b-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-red-500 text-6xl mb-4">😕</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Subscription Not Found</h1>
        <p className="text-gray-600 mb-6">The subscription plan you're looking for doesn't exist or may have been removed.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  // Determine the features to display based on the plan name
  const features = getPlanFeatures(subscription.name);
  const planColor = subscription.name.toLowerCase().includes('premium') 
    ? 'from-purple-600 to-indigo-600' 
    : subscription.name.toLowerCase().includes('pro') 
      ? 'from-amber-500 to-red-600' 
      : 'from-blue-500 to-indigo-600';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      {/* Background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-50 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-100 to-purple-100 rounded-full opacity-60 blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => router.back()}
          className="mb-8 flex items-center text-gray-700 hover:text-gray-900 font-medium transition-colors"
        >
          <FaArrowLeft className="mr-2" />
          Back to Plans
        </motion.button>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Left Column - Plan Details */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-3 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
          >
            <div className={`relative p-8 bg-gradient-to-r ${planColor} text-white`}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-1/3 -translate-y-1/2"></div>
              
              <div className="flex items-start">
                <div className="mr-4 bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  {getPlanIcon(subscription.name)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">{subscription.name}</h1>
                  <p className="text-lg opacity-90">{subscription.title}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Monthly Price</div>
                  <div className="text-4xl font-bold text-gray-800">${subscription.price}</div>
                </div>
                <div className="bg-gray-50 px-4 py-2 rounded-lg">
                  <div className="text-sm text-gray-500 mb-1">Credits per month</div>
                  <div className="text-xl font-semibold text-gray-800">{subscription.creditspermonth}</div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">What's included:</h2>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center"
                    >
                      <div className="mr-3 flex-shrink-0">
                        {feature.icon}
                      </div>
                      <span className="text-gray-700">{feature.text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600">{subscription.details || "Experience the future of fashion with our AI-powered styling platform. This plan gives you everything you need to transform your wardrobe and discover your personal style."}</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Payment & Confirmation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
              
              <div className="space-y-3 mb-6">
                <div 
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'credit' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('credit')}
                >
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    paymentMethod === 'credit' ? 'border-purple-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'credit' && <div className="w-3 h-3 rounded-full bg-purple-500"></div>}
                  </div>
                  <FaCreditCard className="text-gray-500 mr-3" />
                  <span className="font-medium text-gray-700">Credit / Debit Card</span>
                </div>
                
                <div 
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'paypal' 
                      ? 'border-purple-500 bg-purple-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                    paymentMethod === 'paypal' ? 'border-purple-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'paypal' && <div className="w-3 h-3 rounded-full bg-purple-500"></div>}
                  </div>
                  <div className="bg-[#0070ba] text-white font-bold text-sm py-1 px-2 rounded mr-2">Pay</div>
                  <span className="font-medium text-gray-700">PayPal</span>
                </div>
              </div>
              
              {paymentMethod === 'credit' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">Card Information</label>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={fillFakeCardDetails}
                      className="flex items-center text-sm bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-lg transition-colors"
                    >
                      <FaMagic className="mr-1" /> Use Test Card
                    </motion.button>
                  </div>
                  <div>
                    <input 
                      type="text" 
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        placeholder="CVC"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {paymentMethod === 'paypal' && (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">You'll be redirected to PayPal to complete your payment after clicking "Subscribe Now".</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">{subscription.name} Plan</span>
                  <span className="font-medium">${subscription.price}/month</span>
                </div>
                {subscription.creditspermonth && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Credits</span>
                    <span className="font-medium">{subscription.creditspermonth} credits</span>
                  </div>
                )}
                <div className="border-t border-gray-100 my-3 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-lg">${subscription.price}/month</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <input 
                  id="terms" 
                  type="checkbox" 
                  checked={agreed}
                  onChange={() => setAgreed(!agreed)}
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                  I agree to the <a href="#" className="text-purple-600 hover:text-purple-800">Terms of Service</a> and <a href="#" className="text-purple-600 hover:text-purple-800">Privacy Policy</a>
                </label>
              </div>
              
              <button
                onClick={handleSubscription}
                disabled={!agreed}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  agreed
                    ? `bg-gradient-to-r ${planColor} text-white hover:shadow-lg`
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Subscribe Now
              </button>
              
              <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                <FaLock className="mr-2 text-gray-400" />
                Secure payment processing
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Confirm Subscription</h3>
            <p className="text-gray-600 mb-6">
              You're about to subscribe to the <strong>{subscription.name}</strong> plan for <strong>${subscription.price}/month</strong>. Would you like to proceed?
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubscription}
                className={`px-6 py-3 rounded-lg font-medium text-white transition-all bg-gradient-to-r ${planColor} hover:shadow-lg`}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Subscription;