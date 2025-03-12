import React from 'react'

const Home = () => {
  return (
    <div className='md:p-20 p-4 bg-gradient-to-r from-rose-500 to-blue-500 text-white h-screen'>
      <div className="text-center">
      <h2 className='text-5xl text-center'>HandsOn</h2>
      <h2 className='md:text-3xl text-2xl mt-2'>A Community-Driven Social Volunteering Platform</h2>
      </div>
       <p className='md:px-20 mt-2 md:text-2xl'>HandsOn is a community-driven social volunteering platform that connects individuals with meaningful social impact opportunities. Users can discover and join volunteer-driven events, post requests for community help, form teams for large-scale initiatives, and track their impact with contributions logged on a personal and team level.
       This platform is designed to encourage social responsibility, community collaboration, and proactive engagement in volunteer work. It also aims to reward participation, making volunteering more structured, engaging, and impactful.</p>

       <div className="flex justify-center gap-5 mt-10 items-center">
            <a className='py-1 px-6 rounded border bg-rose-500 border-rose-500 text-2xl' href="/login">Login</a>
            <a className='py-1 px-6 rounded border bg-blue-500 border-blue-500 text-2xl' href="/register">Register</a>
       </div>
    </div>
  )
}

export default Home
