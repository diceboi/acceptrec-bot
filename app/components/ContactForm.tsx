"use client"

import { PiPaperPlaneTiltBold } from 'react-icons/pi'

function isInputNamedElement(e: Element): e is HTMLInputElement & { name: string } {
  return 'value' in e && 'name' in e
}

export default function ContactForm({ classname }:any) {

  async function handleOnSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData: Record<string, string> = {};

    Array.from(e.currentTarget.elements).filter(isInputNamedElement).forEach((field) => {
      if (!field.name) return;
      formData[field.name] = field.value;
    });

    await fetch('/api/email', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.name,
        tel: formData.tel,
        email: formData.email,
        location: formData.location,
        message: formData.message,
      })
    })
  }

  return (
    <>
      <form className={classname} onSubmit={handleOnSubmit}>
          <input required placeholder='Name' type='name' name="name" className=' rounded-full p-4 text-lg shadow-special w-full py-4'></input>
          <input required placeholder='Phone number' type='tel' name="tel" className=' rounded-full p-4 text-lg shadow-special w-full py-4'></input>
          <input required placeholder='Email' type='email' name="email" className=' rounded-full p-4 text-lg shadow-special w-full py-4'></input>
          <input required placeholder='Location' type='text' name="location" className=' rounded-full p-4 text-lg shadow-special w-full py-4'></input>
          <textarea required placeholder='Message' name="message" rows={5} className='col-span-2 row-span-2 rounded-3xl p-4 text-lg shadow-special w-full py-4'></textarea>
          <button 
            type="submit"
            className="group flex justify-between items-center w-fit bg-[#00afaa] hover:bg-[#00a39e] hover:shadow-xl hover:gap-4 shadow-lg text-white text-xl hover:shadow-[#00afa93b] hover:w-fit p-4 rounded-full transition-all duration-200 gap-2"
            >
            Send
            <PiPaperPlaneTiltBold className='right-4 recruitment-icon w-6 h-6 group-hover:right-6 ease-out duration-200'
            />
          </button>
      </form>
    </>
  )
}
