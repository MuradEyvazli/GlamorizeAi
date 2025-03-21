// scripts/init-subscriptions.js
import connectDB from '@/lib/db';
import Subscription from '@/models/subscription';

const initializeSubscriptions = async () => {
  await connectDB();
  
  console.log('Abonelik planları güncelleniyor...');
  
  // Abonelik planları
  const subscriptions = [
    {
      name: 'Basic',
      price: 5,
      title: 'Günlük kullanıcılar için ideal',
      creditspermonth: 10,
      allowedRequests: 10, // Ayda 10 istek hakkı
      yearlyPrice: 50,
      
    },
    {
      name: 'Premium',
      price: 15,
      title: 'Düzenli kullanıcılar için',
      creditspermonth: 25,
      allowedRequests: 25, // Ayda 25 istek hakkı
      yearlyPrice: 150,
      
    },
    {
      name: 'Professional',
      price: 25,
      title: 'Yoğun kullanım için',
      creditspermonth: 50,
      allowedRequests: 50, // Ayda 50 istek hakkı
      yearlyPrice: 250,
      
    },
    {
        name: 'Expert(Glamorize Ai pack)',
        price: 90.5,
        title: 'Profisionel kullanım için',
        creditspermonth: 70,
        allowedRequests: 70, // Ayda 50 istek hakkı
        yearlyPrice: 350,
        
      },
  ];

  // Var olan planları güncelle, yoksa oluştur
  for (const plan of subscriptions) {
    await Subscription.findOneAndUpdate(
      { name: plan.name },
      plan,
      { upsert: true, new: true }
    );
  }
  
  console.log('Abonelik planları başarıyla güncellendi');
};

// Script'i çalıştır
initializeSubscriptions()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Hata:', error);
    process.exit(1);
  });