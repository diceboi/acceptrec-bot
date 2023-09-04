import Hero from './components/hero'
import Recruitment from './components/recruitment'
import Advantages from './components/advantages'
import Logocarousel from './components/logocarousel'
import Industries from './components/industries'
import Standards from './components/standards'
import NewJobs from './components/newjobs'
import Rated from './components/rated'
import Team from './components/team'
import FacebookMsg from './components/FacebookMsg'
import FAQComponent from './components/FaqComponent'
import getJobs from './api/getJobs'

export default async function Home() {

  const jobs = await getJobs();

  return (
    <>
      <Hero/> 
      <NewJobs jobs={jobs}/>
      <Logocarousel/>
      <Recruitment/>
      <Advantages />
      <Rated />
      <Industries />
      <Standards />
      <Team />
      <FacebookMsg />
      <FAQComponent />
    </>
  )
}