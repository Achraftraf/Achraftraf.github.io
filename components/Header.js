import Image from 'next/image';
import Link from 'next/link';
import Socials from '../components/Socials';

const Header = () => {
  return (
    <header className='absolute z-30 w-full flex items-center px-16 xl:px-120 xl:h-[70px]'> {/* Adjust the height accordingly */}
      <div className='container mx-auto'>
        <div className='flex flex-col lg:flex-row justify-between items-center gap-y-6 py-8'>
          {}
          <Link href={'/'}>
            <Image
            src={'/logo5.png'}
            width={220}
            height={48}
            alt=''
            priority={true}
            />
          </Link>
          {/* Socials */}
          <Socials />
        </div>
      </div>
    </header>
  );
};

export default Header;
