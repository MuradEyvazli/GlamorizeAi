"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaArrowLeft, 
  FaCreditCard, 
  FaLock, 
  FaCheckCircle, 
  FaMagic, 
  FaUserCircle, 
  FaCrown, 
  FaCalendarAlt, 
  FaEnvelope,
  FaHistory,
  FaRegCreditCard,
  FaShoppingBag,
  FaCog
} from 'react-icons/fa';

const BalanceTopup = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [amount, setAmount] = useState(10);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [remainingRequests, setRemainingRequests] = useState(0);
  const [subscriptionType, setSubscriptionType] = useState('Free Plan');

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch current balance and profile data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.email) return;
      setLoadingProfile(true);

      try {
        // Fetch balance
        const balanceRes = await fetch(`/api/user/balance?email=${session.user.email}`);
        const balanceData = await balanceRes.json();
        if (balanceRes.ok) {
          setCurrentBalance(balanceData.balance);
        }

        // Fetch profile data
        const profileRes = await fetch('/api/profile/get-profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (profileRes.ok) {
          const data = await profileRes.json();
          setProfileData(data);
        }
        
        // Fetch user data including remaining requests and subscription info
        if (session?.user?.id) {
          const userDataRes = await fetch(`/api/user/${session.user.id}`);
          const userData = await userDataRes.json();
          
          // Update remaining requests with actual value
          setRemainingRequests(userData.remainingRequests || 0);
          
          // Set subscription type based on status
          if (userData.subscriptionStatus) {
            setSubscriptionType('Premium');
          } else {
            setSubscriptionType('Free Plan');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (status === 'authenticated') {
      fetchUserData();
    }
  }, [session, status]);

  // Fill form with test card data
  const fillTestCardData = () => {
    setCardName('John Doe');
    setCardNumber('4242 4242 4242 4242');
    setExpiryDate('12/25');
    setCvv('123');
  };

  // Predefined amounts
  const amountOptions = [5, 10, 20, 50, 100];

  // Handle card number formatting
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Add spaces for readability
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += value[i];
    }
    
    setCardNumber(formattedValue);
  };

  // Handle expiry date formatting (MM/YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    
    // Format as MM/YY
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    
    setExpiryDate(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setIsValidating(true);
    
    // Basic validation
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      setError('Please fill in all card details.');
      setLoading(false);
      setIsValidating(false);
      return;
    }
    
    if (cardNumber.replace(/\s/g, '').length < 16) {
      setError('Please enter a valid card number.');
      setLoading(false);
      setIsValidating(false);
      return;
    }
    
    if (cvv.length < 3) {
      setError('Please enter a valid CVV.');
      setLoading(false);
      setIsValidating(false);
      return;
    }

    // Simulate processing delay
    setTimeout(async () => {
      try {
        setIsValidating(false);
        
        // Calculate new balance
        const newBalance = parseFloat(currentBalance) + parseFloat(amount);
        
        // Update the balance via API
        const response = await fetch('/api/user/balance', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: session.user.email,
            newBalance: newBalance
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          setSuccess(true);
          setCurrentBalance(data.balance);
          
          // Reset form
          setCardName('');
          setCardNumber('');
          setExpiryDate('');
          setCvv('');
          
          // Dispatch a custom event for balance update
          window.dispatchEvent(new CustomEvent('balanceUpdated', { 
            detail: { balance: data.balance } 
          }));
        } else {
          setError(data.error || 'Failed to update balance.');
        }
      } catch (error) {
        console.error('Error updating balance:', error);
        setError('An unexpected error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  // Handle success and return to dashboard
  const handleContinue = () => {
    router.push('/dashboard');
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (status === 'loading' || loadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-purple-600 mb-6 hover:text-purple-800">
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Account Management</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Profile Information - 2 columns on large screens */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h2>
                  
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                      {profileData?.image ? (
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-purple-100 shadow-md">
                          <Image 
                            src={profileData.image} 
                            alt="Profile" 
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center shadow-md">
                          <FaUserCircle className="text-purple-600 text-4xl" />
                        </div>
                      )}
                      
                      {profileData?.subscriptionStatus && (
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full w-6 h-6 flex items-center justify-center border-2 border-white shadow-sm">
                          <FaCrown className="text-white" />
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-800">
                      {profileData?.name || session?.user?.name || 'User'}
                    </h3>
                    
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <FaEnvelope className="mr-1" />
                      {profileData?.email || session?.user?.email || 'No email available'}
                    </p>
                    
                    <div className="mt-2">
                      {profileData?.subscriptionStatus ? (
                        <span className="text-xs bg-gradient-to-r from-amber-500 to-amber-300 text-white px-2 py-1 rounded-full font-medium">
                          Premium Member
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-medium">
                          Free Plan
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center text-gray-600">
                        <FaCalendarAlt className="mr-3 text-purple-500" />
                        <span className="text-sm">Membership Type</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {subscriptionType}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center text-gray-600">
                        <FaRegCreditCard className="mr-3 text-purple-500" />
                        <span className="text-sm">Current Balance</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        ${currentBalance.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center text-gray-600">
                        <FaShoppingBag className="mr-3 text-purple-500" />
                        <span className="text-sm">AI Requests Left</span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">
                        {remainingRequests}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 gap-2">
                    <Link 
                      href="/profile" 
                      className="w-full py-2 px-4 flex justify-center items-center rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium"
                    >
                      <FaCog className="mr-2" /> Edit Profile
                    </Link>
                    
                    {!profileData?.subscriptionStatus && (
                      <Link 
                        href="#pricing" 
                        className="w-full py-2 px-4 flex justify-center items-center rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 text-sm font-medium"
                      >
                        <FaCrown className="mr-2" /> Upgrade to Premium
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Payment Section - 3 columns on large screens */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Top Up Balance</h2>
                  
                  {!success ? (
                    <>
                      <p className="text-gray-600 mb-6">
                        Add funds to your Glamorize-AI account to unlock more AI features.
                      </p>
                      
                      <div className="bg-purple-50 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-600">Current Balance</p>
                        <p className="text-2xl font-bold text-purple-700">${currentBalance.toFixed(2)}</p>
                      </div>
                      
                      <form onSubmit={handleSubmit}>
                        {/* Amount selection */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Amount
                          </label>
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            {amountOptions.map((option) => (
                              <button
                                key={option}
                                type="button"
                                className={`py-2 px-4 rounded-lg border ${
                                  amount === option
                                    ? 'bg-purple-100 border-purple-400 text-purple-700'
                                    : 'border-gray-300 hover:bg-gray-50'
                                } transition-colors focus:outline-none`}
                                onClick={() => setAmount(option)}
                              >
                                ${option}
                              </button>
                            ))}
                          </div>
                          
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Custom Amount
                            </label>
                            <div className="relative">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                              </div>
                              <input
                                type="number"
                                min="1"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Card details */}
                        <div className="space-y-4 mb-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-800 flex items-center">
                              <FaCreditCard className="mr-2 text-purple-600" /> 
                              Payment Details
                            </h3>
                            <button
                              type="button"
                              onClick={fillTestCardData}
                              className="text-xs flex items-center text-purple-600 hover:text-purple-800 bg-purple-50 py-1 px-2 rounded"
                            >
                              <FaMagic className="mr-1" /> Use Test Card
                            </button>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name on Card
                            </label>
                            <input
                              type="text"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                              placeholder="John Smith"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Card Number
                            </label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                              placeholder="4242 4242 4242 4242"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                value={expiryDate}
                                onChange={handleExpiryChange}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                                placeholder="MM/YY"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                CVV
                              </label>
                              <input
                                type="text"
                                maxLength="4"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                                placeholder="123"
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Security message */}
                        <div className="flex items-center text-sm text-gray-500 mb-6">
                          <FaLock className="mr-2 text-green-600" />
                          <p>Your payment information is secured with encryption</p>
                        </div>
                        
                        {/* Error display */}
                        {error && (
                          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                            {error}
                          </div>
                        )}
                        
                        {/* Submit button */}
                        <button
                          type="submit"
                          disabled={loading}
                          className={`w-full py-3 px-4 rounded-lg font-medium text-white shadow-sm ${
                            loading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
                          } transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                        >
                          {loading ? (
                            <div className="flex items-center justify-center">
                              {isValidating ? 'Validating...' : 'Processing...'}
                            </div>
                          ) : (
                            `Add $${amount.toFixed(2)} to Balance`
                          )}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <FaCheckCircle className="text-green-500 text-3xl" />
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
                      <p className="text-gray-600 mb-6">
                        Your account has been topped up successfully. Your new balance is ${currentBalance.toFixed(2)}.
                      </p>
                      <button
                        onClick={handleContinue}
                        className="w-full py-3 px-4 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-colors"
                      >
                        Continue to Dashboard
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-center text-gray-500 mt-8">
            This is a demo application. No real payments are processed.
          </p>
        </div>
      </div>
    </>
  );
};

export default BalanceTopup;