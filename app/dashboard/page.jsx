'use client'
import DashboardForm from '../../components/DashboardForm';
import InfoPage from '../../components/InfoPage';
import SubProccess from '../../components/SubProccess';

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <DashboardForm />
      <InfoPage/>
      <SubProccess/>
    </div>
  );
}
