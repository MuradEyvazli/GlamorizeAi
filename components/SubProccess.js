import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const SubProcess = () => {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState([]);
  const [userSubscription, setUserSubscription] = useState(null);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleBillingToggle = (period) => setBillingPeriod(period);

  const fetchSubscriptions = async () => {
    if (!session?.user?.id) return;
    try {
      setLoading(true);

      const userResponse = await fetch(`/api/user/${session.user.id}`);
      const userData = await userResponse.json();

      if (!userResponse.ok) {
        console.error('Error fetching user data:', userData.error);
        return;
      }

      if (userData.subscriptionStatus && userData.subscriptionId) {
        const subResponse = await fetch(`/api/single-sub/${userData.subscriptionId}`);
        const subscribedPlan = await subResponse.json();
        if (subResponse.ok) setUserSubscription(subscribedPlan);
        else console.error('Error fetching subscribed plan:', subscribedPlan.error);
      } else {
        const allSubResponse = await fetch('/api/all-sub');
        const allSubscriptions = await allSubResponse.json();
        if (allSubResponse.ok) setSubscriptions(allSubscriptions);
        else console.error('Error fetching subscriptions:', allSubscriptions.error);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
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
        alert('Subscription canceled successfully.');
        setUserSubscription(null);
        await fetchSubscriptions();
      } else {
        console.error('Error cancelling subscription:', data.error);
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setShowConfirmModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-[#5a5ede] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div id="plan" className="bg-white w-full py-12 relative " style={{ backgroundImage: "url('/images/Cyc.jpg')" }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-100">
          {userSubscription ? "Your Subscription.." : "Choose your preferred plan"}
        </h2>
        
        {!userSubscription && (
          <div>
            <p className="text-white">
              Unlock premium features and get the most out of Simplicity AI.
            </p>
            <div className="inline-flex rounded-lg overflow-hidden mt-6">
              <button
                className={`px-6 py-2 font-medium text-sm ${
                  billingPeriod === 'monthly' ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-700'
                }`}
                onClick={() => handleBillingToggle('monthly')}
              >
                Current Plans..
              </button>
              
            </div>
          </div>
        )}
      </div>

      <div className="grid justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
        {userSubscription ? (
          <div className="flex flex-col justify-center border rounded-lg p-6 bg-white shadow-md min-h-[200px]">
            <h3 className="text-lg font-semibold">{userSubscription.name}</h3>
            <p className="text-sm text-gray-500">{userSubscription.title}</p>
            <p className="text-xl font-bold text-gray-800 mt-4">Price: ${userSubscription.price}</p>
            <p className="text-sm text-gray-500 mt-2">Credits per month: {userSubscription.creditspermonth}</p>

            <button
              onClick={() => setShowConfirmModal(true)}
              className="cursor-pointer mt-6 w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
            >
              Cancel Subscription
            </button>
          </div>
        ) : (
          subscriptions.map((plan) => (
            <Link key={plan._id} href={`/dashboard/subscription/${plan._id}`}>
              <div className="flex flex-col justify-between border rounded-lg p-6 bg-gray-100 shadow-md hover:shadow-lg transition min-h-[300px]">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-sm text-gray-500">{plan.title}</p>
                <div className="mt-4">
                  <span className="text-2xl font-bold">
                    ${billingPeriod === 'monthly' ? plan.price : plan.yearlyPrice}
                  </span>
                  <span className="text-sm text-gray-500">
                    {billingPeriod === 'monthly' ? ' / month' : ' / year'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Credits per month: {plan.creditspermonth}</p>
                <button className="cursor-pointer mt-6 w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-gray-900 transition duration-300">
                  Choose
                </button>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-11/12 sm:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to cancel your subscription?</h3>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={handleCancelSubscription}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                No, Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubProcess;
