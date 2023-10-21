import Link from "next/link";


import {
  RiYoutubeLine,
  RiInstagramLine,
  RiFacebookLine,
  RiGithubLine,
  RiMailLine,
  RiLinkedinLine,
  } from 'react-icons/ri';

const Socials = () => {

  return <div className="flex items-center gap-x-5 text-lg">
    {/* <Link href={''} className='hover:text-accent transition-all duration-300'><RiYoutubeLine /></Link> */}
    <Link href={'https://github.com/Achraftraf'} className='hover:text-accent transition-all duration-300'><RiGithubLine /></Link>
    <Link href={'https://www.linkedin.com/in/achraf-zarouki-058888244/'} className='hover:text-accent transition-all duration-300'><RiLinkedinLine /></Link>
    {/* <Link href={''} className='hover:text-accent transition-all duration-300'><RiInstagramLine /></Link> */}
    <Link href='mailto:achrafzarouki20@gmail.com' className='hover:text-accent transition-all duration-300'><RiMailLine /></Link>
    {/* <Link href={''} className='hover:text-accent transition-all duration-300'><RiFacebookLine /></Link> */}

  </div>;
};

export default Socials;
