import ContactTeam from "@/app/components/ContactTeam"
import TeamInside from "@/app/components/TeamInside"
import Team from "@/app/components/Theme Components/Team"
import Image from "next/image"
import Link from "next/link"
import { FaLinkedin } from "react-icons/fa"

export default function NataliaWielgosz() {
    
    return(
        <>
        <section className="w-full lg:pt-16 pb-20">
            <div className="flex flex-col lg:flex-row w-11/12 lg:w-8/12 pt-16 m-auto">
                <div className='flex flex-col gap-4 w-11/12 lg:w-1/2'>
                    <div className='flex flex-col gap-4 w-11/12 lg:w-8/12 justify-start '>
                        <h2 className='text-6xl lg:text-6xl font-black tracking-tighter text-[#312252]'>
                            Natalia Wielgosz
                        </h2>
                        <p>
                            Head of Accounts & Payroll
                        </p>                    
                    </div>
                    <Image src="/Talki_New.webp" width={1000} height={800} alt="natalia-wielgosz" className="w-full h-auto rounded-3xl"/>
                    <Link href='https://linkedin.com/in/natalia-wielgosz-b52b22163/' target="_blank" className="w-fit"><button className="bg-[#0077b5] pl-1 pr-2 py-1 text-white font-bold rounded-md flex flex-nowrap items-center gap-2 hover:gap-3 transition-all"><FaLinkedin className="w-8 h-full"/><p>Connect with me on LinkedIn</p></button></Link>
                    <div className="flex flex-col gap-4 py-16">
                            <p>Natalia has a deep understanding of payroll procedures and systems. She is ruthless when it comes to details and knows that even the smallest of errors can have major consequences. She has a strong mathematical ability is comfortable dealing with numbers and finances. Payroll technology is constantly changing and Natalia ensures she is up to date with the latest.</p> 

                            <p>Our manager is fully trained in using Microsoft Excel and Sage accounts. We confidently trust Natalia with handling our organisation&apos;s money, taxes and a wealth of confidential information regarding the organisation and employees. Being reliable and trustworthy, she built our Payroll Team from scratch and always chooses the best candidates. Procedures introduced by Natalia have improved payroll process throughout the company</p>  

                            <p>Natalia is an excellent team member and her attention to detail is 100%. She understands deadlines and will ensure they are met fully, with accurate information. No job is too small or too big!</p>

                        </div>                
                </div>
                <div className="flex flex-col w-11/12 lg:w-1/2 lg:p-16 gap-8 pt-28">
                    <h2 className="text-4xl font-black tracking-tighter text-[#312252]">Contact Natalia directly</h2>
                    <ContactTeam contactname={"natalia"} />

                </div>
            </div>
            <Team teamSmallTitle={''} teamMainTitle={'Awesome team members'} teamCtaButtonText={null} teamText={''}/>
        </section>
        </>
    )
}