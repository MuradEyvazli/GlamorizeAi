import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaCrown, FaRocket, FaGem, FaRegCreditCard, FaArrowRight, FaChevronDown, FaChevronUp, FaImages } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SubProcess = () => {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFeatures, setShowFeatures] = useState({});
  const [highlightedPlan, setHighlightedPlan] = useState(null);
  const [remainingRequests, setRemainingRequests] = useState(0);

  const planFeatures = {
    basic: [
      'AI Outfit Analysis', 
      'Basic Style Recommendations', 
      '10 Virtual Try-ons per month',
      '10 AI Image Requests per month',
      'Community Access'
    ],
    premium: [
      'Everything in Basic', 
      'Unlimited Virtual Try-ons', 
      '25 AI Image Requests per month',
      'Advanced Style Analysis', 
      'Personalized Recommendations', 
      'Priority Support'
    ],
    professional: [
      'Everything in Premium', 
      '50 AI Image Requests per month',
      'API Access', 
      'White Label Integration', 
      'Dedicated Account Manager', 
      'Custom Features'
    ]
  };

  const toggleFeatures = (planId) => {
    setShowFeatures(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const handleBillingToggle = (period) => setBillingPeriod(period);

  const fetchSubscriptions = async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);

      const userResponse = await fetch(`/api/user/${session.user.id}`);
      const userData = await userResponse.json();

      if (!userResponse.ok) {
        console.error('Error fetching user data:', userData.error);
        toast.error(`Error loading user data: ${userData.error}`, {
          duration: 4000
        });
        return;
      }

      if (userData.remainingRequests !== undefined) {
        setRemainingRequests(userData.remainingRequests);
      }

      if (userData.subscriptionStatus && userData.subscriptionId) {
        const subResponse = await fetch(`/api/single-sub/${userData.subscriptionId}`);
        const subscribedPlan = await subResponse.json();
        if (subResponse.ok) setUserSubscription(subscribedPlan);
        else {
          console.error('Error fetching subscribed plan:', subscribedPlan.error);
          toast.error(`Error loading subscription: ${subscribedPlan.error}`, {
            duration: 4000
          });
        }
      } else {
        const allSubResponse = await fetch('/api/all-sub');
        const allSubscriptions = await allSubResponse.json();
        if (allSubResponse.ok) {
          setSubscriptions(allSubscriptions);
          // Varsayılan olarak orta planı vurgula (Premium)
          if (allSubscriptions.length > 1) {
            setHighlightedPlan(allSubscriptions[1]?._id || allSubscriptions[0]?._id);
          }
        }
        else {
          console.error('Error fetching subscriptions:', allSubscriptions.error);
          toast.error(`Error loading plans: ${allSubscriptions.error}`, {
            duration: 4000
          });
        }
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast.error('Failed to load subscription data', {
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [session]);

  const handleCancelSubscription = async () => {
    try {
      const response = await fetch('/api/user/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id })
      });

      const data = await response.json();

      if (response.ok) {
        // Replace alert with toast
        toast.success('Subscription canceled successfully', {
          icon: '✅',
          duration: 3000
        });
        setUserSubscription(null);
        await fetchSubscriptions();
      } else {
        console.error('Error cancelling subscription:', data.error);
        toast.error(`Error: ${data.error || 'Failed to cancel subscription'}`, {
          icon: '❌',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('An error occurred while cancelling your subscription', {
        duration: 4000
      });
    } finally {
      setShowConfirmModal(false);
    }
  };

  // Hangi plan ikonunu göstereceğimizi belirleyen yardımcı fonksiyon
  const getPlanIcon = (planName) => {
    const name = planName.toLowerCase();
    if (name.includes('basic')) return <FaRocket className="text-blue-400" />;
    if (name.includes('premium')) return <FaCrown className="text-purple-500" />;
    if (name.includes('pro')) return <FaGem className="text-amber-500" />;
    return <FaRocket className="text-blue-400" />;
  };

  // Abonelik planları için geçiş animasyonları
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    },
    hover: {
      y: -5,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          
        </div>
      </div>
    );
  }

  return (
    <div id='pricing' className="relative w-full min-h-[80vh] px-4 py-16 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-100 to-purple-100 rounded-full opacity-60 blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              {userSubscription ? "Your Subscription Plan" : "Elevate Your Style Journey"}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              {userSubscription 
                ? "Manage your current subscription and explore all your premium features" 
                : "Unlock the full potential of AI-powered fashion styling with our premium plans"}
            </p>
          </motion.div>

          {!userSubscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="inline-flex items-center bg-white p-1 rounded-full shadow-md border border-gray-200 select-none">
                <button
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-all ${
                    billingPeriod === 'monthly' 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleBillingToggle('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-all ml-1 ${
                    billingPeriod === 'yearly' 
                      ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => handleBillingToggle('yearly')}
                >
                  Yearly <span className="text-xs font-bold text-green-500">Save 20%</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Current Subscription Section */}
        {userSubscription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-600 opacity-90"></div>
                <div className="relative p-8 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <FaCrown className="text-yellow-300 text-2xl mr-3" />
                        <h3 className="text-2xl font-bold">{userSubscription.name}</h3>
                      </div>
                      <p className="text-purple-100 mt-1">{userSubscription.title}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">${userSubscription.price}</div>
                      <div className="text-purple-200 text-sm">per month</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Your Premium Benefits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Aboneliğe göre uygun özellikleri göster */}
                    {userSubscription.name.toLowerCase().includes('basic') && 
                      planFeatures.basic.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))
                    }
                    {userSubscription.name.toLowerCase().includes('premium') && 
                      planFeatures.premium.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))
                    }
                    {userSubscription.name.toLowerCase().includes('pro') && 
                      planFeatures.professional.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4 mt-6 border-t border-gray-100 pt-6">
                  <div>
                    <div className="text-sm text-gray-500">Next billing date</div>
                    <div className="font-medium text-gray-800">June 15, 2023</div>
                  </div>
                  
                  {/* Kalan istek sayısı gösterimi */}
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <FaImages className="text-purple-500 mr-2" />
                      <div>
                        <div className="text-sm text-gray-500">AI Image Requests Left</div>
                        <div className="font-medium text-gray-800">{remainingRequests} of {userSubscription.allowedRequests}</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (remainingRequests / userSubscription.allowedRequests) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Subscription Plans Section */}
        {!userSubscription && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {subscriptions.map((plan, index) => {
              const planType = plan.name.toLowerCase().includes('basic') ? 'basic' : 
                              plan.name.toLowerCase().includes('premium') ? 'premium' : 'professional';
              const features = planFeatures[planType] || [];
              const isHighlighted = plan._id === highlightedPlan;
              
              return (
                <motion.div
                  key={plan._id}
                  variants={itemVariants}
                  whileHover="hover"
                  className={`relative rounded-2xl overflow-hidden ${
                    isHighlighted 
                      ? 'transform scale-105 shadow-xl border-2 border-purple-300' 
                      : 'shadow-lg border border-gray-200'
                  }`}
                >
                  {isHighlighted && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-center text-sm font-medium py-1.5">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div className={`bg-white p-8 ${isHighlighted ? 'pt-12' : 'pt-8'}`}>
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        {getPlanIcon(plan.name)}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                    </div>
                    
                    <p className="text-gray-500 mb-6">{plan.title}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-gray-800">
                        ${billingPeriod === 'monthly' ? plan.price : (plan.yearlyPrice || Math.round(plan.price * 0.8 * 12))}
                      </span>
                      <span className="text-gray-500">
                        {billingPeriod === 'monthly' ? '/month' : '/year'}
                      </span>
                      
                      {billingPeriod === 'yearly' && (
                        <span className="ml-2 text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Save 20%
                        </span>
                      )}
                    </div>
                    
                    <Link href={`/dashboard/subscription/${plan._id}`}>
                      <button className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                        isHighlighted
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}>
                        Choose Plan
                      </button>
                    </Link>
                    
                    {/* AI Görüntü İstekleri için özel gösterim */}
                    <div className="mt-4 mb-4 p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center text-purple-800 font-medium">
                        <FaImages className="mr-2" />
                        <span>{plan.allowedRequests} AI Image Requests per month</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-3">
                      {features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center text-gray-600">
                          <FaCheckCircle className="mr-2 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      
                      {features.length > 3 && (
                        <div>
                          <button
                            onClick={() => toggleFeatures(plan._id)}
                            className="flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm mt-3"
                          >
                            {showFeatures[plan._id] ? (
                              <>
                                <FaChevronUp className="mr-1" />
                                Show less
                              </>
                            ) : (
                              <>
                                <FaChevronDown className="mr-1" />
                                Show all features
                              </>
                            )}
                          </button>
                          
                          {showFeatures[plan._id] && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-2 space-y-3"
                            >
                              {features.slice(3).map((feature, idx) => (
                                <div key={idx} className="flex items-center text-gray-600">
                                  <FaCheckCircle className="mr-2 text-green-500 flex-shrink-0" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-xl shadow-2xl text-center w-11/12 sm:w-96 max-w-md"
          >
            <FaTimesCircle className="text-red-500 text-4xl mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-3">Cancel Subscription?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your subscription? You'll lose access to premium features.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleCancelSubscription}
                className="px-6 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 transition-all"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-6 py-2 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
              >
                No, Keep Plan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SubProcess;