import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const navIcons = [
  {src: '/assets/icons/search.svg', alt: 'search'},
  { src: '/assets/icons/black-heart.svg', alt: 'heart' },
  { src: '/assets/icons/user.svg', alt: 'user' },
]

const Navbar = () => {
  return (
   <header className='w-full'>
    <nav className='nav'>
      <Link className='flex gap-1 items-center'
      href={"/"}>
        <Image
          src="/assets/icons/logo.svg"
          width={27}
          height={27}
          alt='Logo'
        />
        <p className='nav-logo'>
        Kora Price<span className='text-primary'> Track</span>
        </p>
      </Link>
      <div className='flex items-center gap-5'>
       {navIcons.map((icons)=>(
        <Image
          key={icons.alt}
          alt={icons.alt}
          src={icons.src}
          width={28}
          height={28}
          className='object-contain'
        />
       ))
       }
      </div>
    </nav>
    </header>
  )
}
export default Navbar
