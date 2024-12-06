'use client'
import PreInfoPage from '@/components/PreInfoPage';
import DashboardForm from '../../components/DashboardForm';
import InfoPage from '../../components/InfoPage';
import RequestAccess from '../../components/requestAccess';
import SubProccess from '../../components/SubProccess';
import ContactUs from '@/components/ContactUs';

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <DashboardForm />
      <ContactUs/>
      <PreInfoPage/>
      <RequestAccess/>
      <InfoPage/>
      <SubProccess/>
    </div>
  );
}
