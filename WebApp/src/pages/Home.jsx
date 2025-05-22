import React from 'react';
import { Link } from 'react-router-dom';
import Students from '../assets/students.svg'

const Home = () => {
    return (
        <div className="container mx-auto flex justify-center items-center min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div>
                    <img 
                        src={Students} 
                        alt="students" 
                        className="w-full"
                    />
                </div>
                <div className="p-6 min-h-screen">
                    <div className="flex flex-col">
                        <h1 className="text-5xl font-bold text-[#252525] leading-normal">
                            Welcome to
                            <br />
                            School Management
                            <br />
                            System
                        </h1>
                        
                        <p className="my-8 leading-normal">
                            Streamline school management, class organization, and add students and faculty.
                            Seamlessly track attendance, assess performance, and provide feedback.
                            Access records, view marks, and communicate effortlessly.
                        </p>

                        <div className="flex flex-col items-center justify-center gap-4 p-6">
                            <Link to="/login" className="w-full no-underline">
                                <button className="w-full bg-[#7f56da] text-white py-2 px-4 rounded hover:bg-[#6645b8] transition-colors">
                                    Login
                                </button>
                            </Link>

                            <Link to="/login" className="w-full no-underline">
                                <button className="w-full border-2 border-[#7f56da] text-[#7f56da] py-2 px-4 rounded hover:bg-[#7f56da] hover:text-white transition-colors">
                                    Login as Guest
                                </button>
                            </Link>

                            <p className="mt-8">
                                Don't have an account?{' '}
                                <Link to="/Adminregister" className="text-[#550080] hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;