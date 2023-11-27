"use client"
import { scrapAndStoreProduct } from '@/lib/actions';
import React, { FormEvent, useState } from 'react'


const isValidAmazoneProductUrl =(url: string)=>{

  try {
    const pasedURL = new URL(url);
    const hostname = pasedURL.hostname;

    if(
      hostname.includes('amazon.com')||
      hostname.includes('amazon.')||
      hostname.includes('amazon')
    ){
      return true;
    }

  } catch (error) {
      return false;
  }
  return false;
}


const Searchbar = () => {
  const [searchPromt, setSearchPromt] = useState('');
  const [isLoding, setIsLoading] = useState(false);

    const handleSubmit = async(event: FormEvent<HTMLFormElement>)=>{
      
      event.preventDefault();
      const isValidLink = isValidAmazoneProductUrl(searchPromt)
      if(!isValidLink) return alert('Please provide a valid Amazon link');

      try {
        setIsLoading(true);
        //Scrap the product page 
        const product = await scrapAndStoreProduct(searchPromt);
        
      } catch (error) {
        
      }finally{
        setIsLoading(false);
      }


    }

  return (
    <form className='flex flex-wrap gap-4 mt-12'
        onSubmit={handleSubmit}    
    >
    <input
        placeholder='Enter the product link'
        type='text'
        value={searchPromt}
        onChange={(e)=> setSearchPromt(e.target.value)}
        className='searchbar-input'
    />
    <button type='submit' className='searchbar-btn'
      disabled={searchPromt === ''}
    >
       {isLoding? 'Searching...': 'Search'}
    </button>
    </form>
  )
}

export default Searchbar
