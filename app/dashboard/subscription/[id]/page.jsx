// app/dashboard/subscription/[id]/page.jsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

const Subscription = () => {
  const { data: session } = useSession();
  const { id } = useParams();
  const router = useRouter();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

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
    if (session) {
      try {
        const response = await fetch('/api/user/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.user.id, // User ID from session
            subscriptionId: id // Subscription ID from useParams()
          })
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert('Subscription successful!');
          router.push('/'); // Redirect to homepage or user's dashboard
        } else {
          alert(data.error || 'Failed to subscribe');
        }
      } catch (error) {
        console.error('Error during subscription:', error);
      }
    }
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-[#5a5ede] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!subscription) return <p>Subscription not found</p>;

  return (
    <div 
      className="min-h-screen bg-gray-50 flex justify-center items-center"
      style={{
        backgroundImage: "url('/images/Cyc.jpg')",
        backgroundSize: "cover", 
        backgroundRepeat: "no-repeat" // Tekrar etmesini önler
      }}
    >
      <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg shadow-lg p-16">
        <button
          onClick={() => router.back()}
          className="mb-4 bg-gradient-to-br from-purple-600 via-gray-700 to-blue-400 text-white py-2 px-7 rounded-lg hover:bg-gray-400 transition duration-300"
        >
          Back
        </button>
        
        <h1 className="text-4xl font-bold text-white mb-4">{subscription.title}</h1>
        <p className="text-lg text-gray-300 mb-6">{subscription.details}</p>
        <div className="text-2xl font-semibold text-white mb-4">
          Price: ${subscription.price}
        </div>
        <button 
          onClick={handleSubscription}
          className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition duration-300"
        >
          Subscribe Now
        </button>
      </div>
    </div>
  );
};

export default Subscription;
