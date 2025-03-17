import { useState } from "react";

const AddUser = () => {
    const [name, setName] = useState("");
    const [roll, setRoll] = useState("");
    const [username, setUsername] = useState("");
    const [section, setSection] = useState("");


  const handleSubmit= (e:any)=>{
    e.preventDefault();
    console.log({name,roll,username,section});
  }


  return (
    <div className='min-h-screen bg-blue-100 flex items-center justify-center p-4'>
        <div className='bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden border border-black/25'>
            <div className=' p-6'>
                <h1 className='font-bold text-3xl text-black text-center'>Add New User</h1>
            </div>
            <div className='p-8 space-y-6'>
                <form className='space-y-6' onSubmit={handleSubmit}>
                    {/* Form Row */}
                    <div className='space-y-4'>
                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="fullname" className='text-gray-700 font-medium'>Full Name</label>
                            <input 
                                type="text" 
                                id='fullname' 
                                placeholder='Rajat Gupta'
                                className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all'
                                onChange={(e)=>setName(e.target.value)}
                            />
                        </div>

                        <div className='flex flex-col space-y-2'>
                            <label htmlFor="roll" className='text-gray-700 font-medium'>Roll No.</label>
                            <input 
                                type="text" 
                                id='roll' 
                                placeholder='2200330100172'
                                className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all'
                                onChange={(e)=>setRoll(e.target.value)}
                            />
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='flex flex-col space-y-2'>
                                <label htmlFor="section" className='text-gray-700 font-medium'>Section</label>
                                <input 
                                    type="text" 
                                    id='section' 
                                    placeholder='A'
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all'
                                    onChange={(e)=>setSection(e.target.value)}
                                />
                            </div>

                            <div className='flex flex-col space-y-2'>
                                <label htmlFor="username" className='text-gray-700 font-medium'>LeetCode Username</label>
                                <input 
                                    type="text" 
                                    id='username' 
                                    placeholder='rajatgupta05'
                                    className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all'
                                    onChange={(e)=>setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='pt-6'>
                        <button 
                            type='submit' 
                            className='w-full bg-blue-600 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 transform hover:scale-[1.01]'
                        >
                            Add User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default AddUser