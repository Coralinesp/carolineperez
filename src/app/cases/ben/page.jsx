'use client';

import { useEffect, useState, useRef } from 'react';
import Navbar from '../../../components/navbar';
import CaseStudyNav from '../../../components/CaseStudyNav';
import projects from '../../../components/projects/projects';

export default function Bluebreeze() {
  const project = projects.find(
    (p) => p.title === 'BEN BARBER SUPPLY BRANDING & HOME PAGE DESIGN'
  );


  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'logo', label: 'Logo Design' },
    { id: 'home', label: 'Home Design' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f8f6] text-[#1D212A]">
      <Navbar />
     <main className="w-full flex flex-col items-center justify-center gap-10 pt-32 pb-2 px-4 sm:px-6 md:px-10 lg:px-16">
        <h1 className="text-4xl font-bold text-center">
          {project?.title || 'Project not found'}
        </h1>

        {project && (
          <img
            src={project.cover}
            alt={project.title}
            className="w-full h-60 object-cover rounded-lg shadow-lg"
          />
        )}

        <div className="flex flex-col md:flex-row w-full mt-8 gap-8">
          <CaseStudyNav sections={sections} />

          {/* Contenido desplazable */}
          <div className="md:w-3/4 w-full flex flex-col gap-12 px-2 pb-2 scroll-smooth">
            <section id="overview">
              <h2 className="text-3xl font-semibold mb-2 text-indigo-600">Overview</h2>
              <p className="text-base leading-relaxed">
                Ben Barber Supply is a barber supply business for which I designed the homepage and created the logo, focusing on a clean, professional look that helps users easily explore products and understand the brand.
              </p>
              <div className='flex mt-6 justify-between w-full md:w-2/3 '>
                <div className='flex flex-col'>
                  <h1 className='font-bold'>My Role</h1>
                  <p>Lead UX Designer</p>
                </div>
                <div className='flex flex-col'>
                  <h1 className='font-bold'>Project duration</h1>
                  <p>2 weeks</p>
                </div>
                <div className='flex flex-col'>
                  <h1 className='font-bold'>Tools</h1>
                  <p>Figma</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-3 mt-10">
                <div className="bg-black/[0.03] outline outline-[1.5px] outline-neutral-200/20 rounded-xl p-6 w-full md:w-1/2 hover:outline-[#385BF0]">
                  <h3 className="text-lg font-semibold mb-2">The problem</h3>
                  <p className="text-sm text-[#1D212A]/80">
                    The business needed a homepage and visual identity that better reflected its brand and improved user navigation to promote product discovery.
                  </p>
                </div>
                <div className="bg-black/[0.03] outline outline-[1.5px] outline-neutral-200/20 rounded-xl p-6 w-full md:w-1/2 hover:outline-[#385BF0]">
                  <h3 className="text-lg font-semibold mb-2">The goal</h3>
                  <p className="text-sm text-[#1D212A]/80">
                    Design a homepage and logo that clearly communicate the brand’s values and make it simple for visitors to browse and engage with the products.
                  </p>
                </div>
              </div>
            </section>

            <section id="logo" className="mt-10">
              <h2 className="text-3xl font-semibold mb-6 text-indigo-600">Logo Design</h2>
               <p className="text-base leading-relaxed mb-4">
                    Here is the logo showcased in all its variations to ensure versatility across different applications, alongside the carefully selected color palette that establishes a consistent and recognizable brand identity.
                </p>
                <img
                    src="/brand2.webp"
                    alt="Logo"
                    className="w-full rounded-lg shadow-lg mx-auto"
                  />
            </section>

             <section id="home" className="mt-10">
              <h2 className="text-3xl font-semibold mb-6 text-indigo-600">Home Design</h2>
               <p className="text-base leading-relaxed mb-4">
                   I created the homepage design based on a template provided by the client, adhering to their requirements while adapting it to enhance usability and align with the brand’s visual identity.
                </p>
                <img
                    src="/highproto4.webp"
                    alt="Home Design"
                    className="w-full rounded-lg shadow-lg mx-auto"
                  />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
