import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface LandingContentItem {
  description: string;
  linkDescription: string;
  href: string;
}

interface LandingAnimationDescriptionProps {
  description: string;
  linkDescription: string;
  active: boolean;
  link: string;
}

const LandingAnimation: React.FC = () => {
  const [currentImg, setCurrentImg] = useState<number>(0);
  const colors: string[] = ['#002D62', '#97233F', '#17B169', '#1d1160'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((currentImg) => (currentImg + 1) % colors.length);
    }, 11000);
    return () => clearInterval(interval);
  }, [colors.length]);

  const content: LandingContentItem[] = [
    {
      description: "",
      linkDescription: "",
      href: "#link-to-bookkeeping",
    },
    {
      description: "",
      linkDescription: "",
      href: "#link-to-requests",
    },
    {
      description: "",
      linkDescription: "",
      href: "#link-to-careers",
    },
    {
      description: "",
      linkDescription: "",
      href: "",
    },
  ];

  return (
    <div className='flex h-screen relative overflow-hidden'>
      <div className='w-full relative z-50 mt-auto h-2.5 bg-opacity-40 bg-white'>
        <div className='absolute bottom-0 left-0 w-full h-full bg-black bg-opacity-75 animate-[loadingBar_11s_infinite_linear_forwards]'></div>
      </div>
      <div className='absolute z-0 inset-y-0 left-0 right-0 m-auto w-full h-full flex flex-col items-center justify-end p-5'>
        <div
          className='absolute inset-0 m-auto min-w-full min-h-full z-0 transition-opacity duration-1000'
          style={{ backgroundColor: colors[currentImg], transition: 'background-color 1s ease' }}
        ></div>
        {content.map((item, index) => (
          <LandingAnimationDescription
            key={index}
            description={item.description}
            linkDescription={item.linkDescription}
            active={currentImg === index}
            link={item.href}
          />
        ))}
      </div>
    </div>
  );
};

export default LandingAnimation;

const LandingAnimationDescription: React.FC<LandingAnimationDescriptionProps> = ({
  description,
  linkDescription,
  active,
  link,
}) => {
  const classNames = twMerge(
    'absolute z-50 inset-x-5 bottom-6 transition-opacity duration-1000',
    active ? 'opacity-100' : 'opacity-0 -z-1'
  );
  return (
    <div className={classNames}>
      <p className='text-white'>{description}</p>
      <a href={link} target='_blank' rel='noopener noreferrer' className='cursor-pointer underline text-white'>
        {linkDescription}
      </a>
    </div>
  );
};