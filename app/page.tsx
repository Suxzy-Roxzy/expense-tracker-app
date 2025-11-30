import Button from '@/components/custom/Button'
import React from 'react'

const page = () => {
  console.log("Hello from Server side page component")
  return (
    <>  
    <div className='font-century-gothic font-black text-4xl justify-center text-align-center mx-auto my-auto'>page</div>
    <Button/>
    </>
  )
}


export default page