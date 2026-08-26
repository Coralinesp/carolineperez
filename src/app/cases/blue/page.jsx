
import { useEffect, useState, useRef } from 'react';
import Navbar from '../../../components/navbar';
import CaseStudyNav from '../../../components/CaseStudyNav';
import projects from '../../../components/projects/projects';

export default function Bluebreeze() {
  const project = projects.find(
    (p) => p.title === 'DESIGN A FOOD DELIVERY APP FOR A CAFE'
  );


  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'research', label: 'Research' },
    { id: 'define', label: 'Define' },
    { id: 'ideate', label: 'Ideate' },
    { id: 'prototype', label: 'Prototype' },
    { id: 'test', label: 'Test' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8f8f6] text-[#1D212A] overflow-x-clip">
      <Navbar />
     <main className="w-full  mx-auto flex flex-col items-center justify-center gap-6 md:gap-10 pt-32 pb-2 px-4 sm:px-6 md:px-10 lg:px-16">
        <h1 className="text-4xl font-bold text-center">
          {project?.title || 'Project not found'}
        </h1>

        {project && (
          <img
            src={project.cover}
            alt={project.title}
            className="w-full h-48 sm:h-60 md:h-72 object-cover rounded-lg shadow-lg"
          />
        )}

       <div className="flex flex-col md:flex-row w-full mt-8 gap-8"> 
          <CaseStudyNav sections={sections} />

          {/* Contenido desplazable */}
         <div className="md:w-3/4 w-full flex flex-col gap-12 scroll-smooth px-1">
            <section id="overview">
              <h2 className="text-3xl font-semibold mb-2 text-indigo-600">Overview</h2>
              <p className="text-base leading-relaxed">
                Blue & Breeze is a conceptual café for which I designed a delivery app focused on clarity, 
                accessibility, and a seamless ordering experience, including customization and delivery options.
              </p>
              <div className='flex mt-6 justify-between w-full '>
                <div className='flex flex-col'>
                  <h1 className='font-bold'>My Role</h1>
                  <p>Lead UX Designer</p>
                </div>
                <div className='flex flex-col'>
                  <h1 className='font-bold'>Project duration</h1>
                  <p>6 months</p>
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
                    Customers needed a faster and easier way to order from the café without dealing with long lines or confusion.
                  </p>
                </div>
                <div className="bg-black/[0.03] outline outline-[1.5px] outline-neutral-200/20 rounded-xl p-6 w-full md:w-1/2 hover:outline-[#385BF0]">
                  <h3 className="text-lg font-semibold mb-2">The goal</h3>
                  <p className="text-sm text-[#1D212A]/80">
                    Create an intuitive app that would make ordering food from the café faster and more convenient for customers.
                  </p>
                </div>
              </div>
            <div className="flex flex-col items-center mt-12 px-6">
              <h3 className="text-2xl font-bold mb-6 text-[#1D212A]">The Process</h3>
              <div className="flex flex-wrap justify-center gap-3 w-full max-w-5xl">
                {["Empathize", "Define", "Ideate", "Prototype", "Test"].map((step, index, arr) => (
                  <div key={step} className="flex items-center gap-4">
                    <div className="bg-black/[0.03] backdrop-blur-sm border border-black/15 px-5 py-3 rounded-xl shadow-md hover:scale-105 transition-transform text-[#1D212A] text-base font-semibold min-w-[110px] text-center">
                      {step}
                    </div>
                    {index < arr.length - 1 && (
                      <span className="text-[#1D212A]/40 text-3xl">➔</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            </section>

            <section id="research" className="mt-10">
              <h2 className="text-3xl font-semibold mb-6 text-indigo-600">Understanding the user</h2>
              
              <div className="flex flex-col lg:flex-row gap-10">
                {/* Columna izquierda: texto */}
                <div className="lg:w-2/3">
                  <p className="text-base leading-relaxed mb-4">
                    To better understand the needs and behaviors of our target users, I conducted qualitative interviews with a diverse group of participants, including café regulars, university students, and busy professionals who frequently use food delivery services. My research aimed to validate key assumptions and uncover latent needs that could shape a more user-centric product.
                  </p>
                  <p className="text-base leading-relaxed">
                    While initial assumptions centered on speed and simplicity, user feedback revealed deeper expectations. Personalization emerged as a critical theme—participants wanted more control over their orders, including the ability to specify dietary preferences, add special instructions, and receive tailored suggestions. Real-time transparency was another key demand, with users expressing frustration when unsure of order status or delivery timing.
                  </p>
                </div>

                {/* Columna derecha: bloque azul con goals */}
                <div className="lg:w-1/3 bg-[#385BF0] rounded-lg p-6 shadow-lg text-white">
                  <h3 className="text-xl font-bold mb-4">Research Goals</h3>
                  <ul className="list-disc list-inside space-y-3 text-sm leading-relaxed">
                    <li>
                      <span className="font-semibold">Validate Assumptions:</span> Understand whether users truly prioritize speed and ease of ordering.
                    </li>
                    <li>
                      <span className="font-semibold">Identify Pain Points:</span> Discover frustrations users face with current food delivery experiences.
                    </li>
                    <li>
                      <span className="font-semibold">Uncover Hidden Needs:</span> Reveal expectations such as personalization and real-time tracking.
                    </li>
                  </ul>
                </div>
              </div>
              {/* Questions*/}
              <div className="mt-12">
                <h2 className="text-xl font-semibold text-indigo-600 mb-6">Key Questions</h2>
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Card 1 */}
                  <div className="bg-black/[0.03] outline outline-[1.5px] outline-neutral-200/20 hover:outline-[#385BF0] rounded-xl p-5 w-full lg:w-1/3 shadow-sm">
                    <p className="text-lg text-[#1D212A]/90 leading-relaxed">
                      Can you walk me through how you typically decide what to order when using a food or drink delivery app?
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-black/[0.03] outline outline-[1.5px] outline-neutral-200/20 hover:outline-[#385BF0] rounded-xl p-5 w-full lg:w-1/3 shadow-sm">
                    <p className="text-lg text-[#1D212A]/90 leading-relaxed">
                      What kind of information do you usually look for before placing an order, and what do you do if that information isn’t available?
                    </p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-black/[0.03] outline outline-[1.5px] outline-neutral-200/20 hover:outline-[#385BF0] rounded-xl p-5 w-full lg:w-1/3 shadow-sm">
                    <p className="text-lg text-[#1D212A]/90 leading-relaxed">
                     Have you ever needed to make a special request or note an allergy when ordering? How did you handle that, and how did it make you feel?
                    </p>
                  </div>
                </div>
              </div>
              {/* Pain Points*/}
              <div className="mt-20">
                <h2 className="text-xl font-semibold text-indigo-600 mb-6">
                  This is what I found (Pain Points)
                </h2>
                <div className="flex flex-col md:flex-row gap-6 text-white">
                  {[
                    {
                      title: 'No images of items',
                      description:
                        'Customers find it frustrating when the app does not include images of the drinks or food. Without visual representation, it becomes difficult to make informed decisions.',
                    },
                    {
                      title: 'Missing ingredients info',
                      description:
                        'The absence of ingredient lists creates uncertainty, especially for those with dietary preferences or restrictions.',
                    },
                    {
                      title: 'Can’t add allergy notes',
                      description:
                        'Not being able to add allergy notes or special instructions makes customers feel unsafe when ordering.',
                    },
                    {
                      title: 'Cluttered menu',
                      description:
                        'A cluttered or poorly organized menu frustrates users and makes it harder to find desired items.',
                    },
                  ].map((point, index) => (
                    <div
                      key={index}
                      className="bg-indigo-600 rounded-2xl shadow-lg p-6 flex-1 flex flex-col gap-4"
                    >
                      {/* Número en círculo blanco */}
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-indigo-600 font-bold text-lg select-none">
                        {index + 1}
                      </div>

                      {/* Título */}
                      <h3 className="text-xl font-semibold">{point.title}</h3>

                      {/* Descripción */}
                      <p className="text-sm text-white/90 leading-relaxed">{point.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="define" className="mt-10">
              <h2 className="text-3xl font-semibold mb-6 text-indigo-600">User Persona</h2>     
              <img
                src="/Persona.webp"
                alt="User Persona"
                className="w-full rounded-lg shadow-lg mx-auto"
              />
              <div className="mt-12">
                <h2 className="text-xl font-semibold text-indigo-600 mb-6">Problem statement</h2>
                <p className="text-base leading-relaxed">
                  Luis is a busy young professional who needs an app that makes 
                  it quick and easy to order his favorite coffee because he doesn’t have time to 
                  wait in line or navigate a cluttered menu.
              </p>
              </div>
            </section>

            <section id="ideate" className="mt-10">
              <h2 className="text-3xl font-semibold mb-8 text-indigo-600">Ideation</h2>

              {/* INTRODUCCIÓN + BLOQUE DESTACADO */}
              <div className="flex flex-col lg:flex-row gap-10 items-start">
                <div className="lg:w-2/3">
              <p className="text-base leading-relaxed text-[#1D212A]/90">
                  Based on the research insights, I began exploring ideas to solve the key pain points through visual thinking
                  exercises and flow planning. This phase emphasized structured creativity, allowing me to rapidly test ideas before 
                  prototyping. I focused on mapping the user’s path through the system by creating a detailed user flow, which helped 
                  me visualize each interaction and identify areas of friction or confusion. Alongside this, I developed a storyboard 
                  to better understand the user's context, emotions, and expectations at each stage of the experience. 
                </p>
                </div>
                <div className="lg:w-1/3 bg-[#385BF0] rounded-lg p-6 shadow-lg text-white">
                  <h3 className="text-xl font-bold mb-4">Ideation Goals</h3>
                  <ul className="list-disc list-inside space-y-3 text-sm leading-relaxed">
                    <li>Turn user pain points into design opportunities.</li>
                    <li>Visualize user flows to detect bottlenecks.</li>
                    <li>Sketch early concepts to validate ideas quickly.</li>
                  </ul>
                </div>
              </div>

              {/* STORYBOARD */}
              <div className="mt-12">
                <h3 className="text-2xl font-semibold text-indigo-500 mb-4">Storyboarding</h3>
                <div className="flex flex-col gap-6">
                  <p className="text-base leading-relaxed text-[#1D212A]/90">
                    I created a minimal storyboard from the user’s perspective to capture emotional and environmental context during the ordering journey. This narrative technique helped identify overlooked moments that impact usability.
                  </p>
                  <img
                    src="/storyboard1.webp"
                    alt="Storyboard"
                    className="w-full rounded-xl shadow-lg border border-black/10"
                  />
                </div>
              </div>

              {/* USER FLOW MAP */}
              <div className="mt-12">
                <h3 className="text-2xl font-semibold text-indigo-500 mb-4">User Flow Map</h3>
                <div className="flex flex-col lg:flex-row gap-10 items-center">
                  <img
                    src="/userflow1.webp"
                    alt="User Flow Map"
                    className="w-full lg:w-3/4 rounded-xl shadow-lg border border-black/10"
                  />
                  <div className="lg:w-1/4">
                    <p className="text-base leading-relaxed text-[#1D212A]/90">
                      I mapped out the key steps a user takes from app entry to checkout. This visual overview helped uncover friction points and streamline the decision-making process to ensure a smooth experience across all stages.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            
            <section id="prototype" className="mt-10">
              <h2 className="text-3xl font-semibold mb-8 text-indigo-600">Starting the design</h2>

              {/* INTRODUCCIÓN + BLOQUE DESTACADO */}
              <div className="flex flex-col lg:flex-row gap-10 items-start">
                <div className="lg:w-2/3">
                  <p className="text-base leading-relaxed text-[#1D212A]/90">
                    After the ideation phase, I started designing simple digital wireframes to outline the app’s structure and flow. Then, I created low-fidelity and high-fidelity prototypes to test and refine the user experience. The branding was kept minimal and clean, focusing mostly on usability and clear visuals to make the app easy to navigate.
                  </p>
                </div>
                <div className="lg:w-1/3 bg-[#385BF0] rounded-lg p-6 shadow-lg text-white">
                  <h3 className="text-xl font-bold mb-4">Prototype Goals</h3>
                  <ul className="list-disc list-inside space-y-3 text-sm leading-relaxed">
                    <li>Translate ideas into tangible interfaces through wireframes.</li>
                    <li>Test layout and usability with low-fidelity prototypes.</li>
                    <li>Refine visual style and interactivity in high-fidelity versions.</li>
                  </ul>
                </div>
              </div>

              {/* Wireframe */}
              <div className="mt-12">
                <h3 className="text-2xl font-semibold text-indigo-500 mb-4">Digital wireframes </h3>
                  <p className="text-base leading-relaxed text-[#1D212A]/90 mb-6">
                   The main goal through this process was to keep a clean and simple design, so the users could navigate the app easily and place their orders without confusion or delays.
                  </p>
                   <img
                    src="/wireframe1.webp"
                    alt="wireframe"
                    className="w-full rounded-xl mb-6 shadow-lg border border-black/10"
                  />
                   <img
                    src="/wireframe2.webp"
                    alt="wireframe"
                    className="w-full rounded-xl mb-6 marker:shadow-lg border border-black/10"
                  />
                   <img
                    src="/wireframe3.webp"
                    alt="wireframe"
                    className="w-full rounded-xl shadow-lg border border-black/10"
                  />
                  
              </div>

              {/* Low Fidelity prototype */}
              <div className="mt-12">
                <h3 className="text-2xl font-semibold text-indigo-500 mb-4">Low-fidelity prototype</h3>
                <div className="w-full h-[600px] rounded-xl shadow-lg border border-black/10 overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src="https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/proto/Z77jyAEGwbcazTtUveTxbv/Cafe-Delivery-App?node-id=4-2&page-id=0%3A1&starting-point-node-id=4%3A2&scaling=scale-down&content-scaling=fixed"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              {/* Low Fidelity prototype */}
              <section id="test" className="mt-12">
                <h3 className="text-2xl font-semibold text-indigo-500 mb-4">Low Fidelity Prototype Usability Test</h3>
                {/* INTRODUCCIÓN + BLOQUE DESTACADO */}
                <div className="flex flex-col lg:flex-row gap-10 items-start">
                  <div className="lg:w-2/3">
                    <p className="text-base leading-relaxed text-[#1D212A]/90">
                      I tested the low-fidelity prototype of Blue & Breeze with three participants who matched the profile of our target users—busy professionals and students who often order takeout. When creating my wireframes, I had many ideas I wanted to explore, and testing these early concepts helped me see which ones truly resonated with users. While running the prototype, I encouraged participants to share their expectations, confusion, and thoughts in real time. After their first pass through the flow, I explained some of my initial intentions behind the design to get more targeted feedback.
                    </p>
                  </div>
                  <div className="lg:w-1/3 bg-[#385BF0] rounded-lg p-6 shadow-lg text-white">
                    <h3 className="text-xl font-bold mb-4">Research Goals</h3>
                    <ul className="list-disc list-inside space-y-3 text-sm leading-relaxed">
                      <li>Understand user pain points.</li>
                      <li>Identify features users expect in a coffee ordering app.</li>
                      <li>Validate whether our early prototypes are clear, usable, and meet expectations.</li>
                      <li>Discover unmet needs such as personalization or delivery transparency.</li>      
                    </ul>
                  </div>
                </div>
                 {/* Questions*/}
                <div className="mt-12">
                  <h2 className="text-xl font-semibold text-indigo-600 mb-6">Research Questions</h2>
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Card 1 */}
                    <div className="bg-black/[0.03] outline outline-[1.5px] outline-neutral-200/20  rounded-xl p-5 w-full lg:w-1/3 shadow-sm">
                      <p className="text-lg text-[#1D212A]/90 leading-relaxed">
                        What challenges do users face when ordering coffee for delivery or pickup?
                      </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-black/[0.03] outline outline-[1.5px] outline-neutral-200/20  rounded-xl p-5 w-full lg:w-1/3 shadow-sm">
                      <p className="text-lg text-[#1D212A]/90 leading-relaxed">
                        What kind of customization or personalization do users expect when ordering drinks?
                      </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-black/[0.03] outline outline-[1.5px] outline-neutral-200/20  rounded-xl p-5 w-full lg:w-1/3 shadow-sm">
                      <p className="text-lg text-[#1D212A]/90 leading-relaxed">
                      How important is real-time tracking and order status for users?
                      </p>
                    </div>
                    {/* Card 4 */}
                    <div className="bg-black/[0.03] outline outline-[1.5px] outline-neutral-200/20  rounded-xl p-5 w-full lg:w-1/3 shadow-sm">
                      <p className="text-lg text-[#1D212A]/90 leading-relaxed">
                      Can users complete an order successfully and intuitively using the prototype?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-xl font-semibold text-indigo-600 mb-6">Key Performance Indicators (KPIs)</h2>
                    <div className="flex flex-col lg:flex-row gap-6">
                      {[
                        "Task completion rate",
                        "Time on task",
                        "Error rate during checkout",                
                      ].map((kpi, index) => (
                        <div key={index} className="bg-indigo-600 border flex items-center border-white/10 rounded-xl p-5 w-full text-white text-center shadow-sm">
                          <p className="text-base font-medium leading-relaxed">{kpi}</p>
                        </div>
                      ))}
                    </div>
                </div>

                <div className="mt-12">
                  <h2 className="text-2xl font-semibold text-indigo-600 mb-6">Methodology & Test Script</h2>

                  <div className="flex flex-col gap-8 border-l-4 border-indigo-600 pl-6">
                    {/* Step 1 */}
                    <div className="flex gap-4">
                      <div className="text-indigo-600 font-bold text-xl min-w-[30px] select-none">01</div>
                      <div>
                        <h4 className="text-lg font-semibold text-[#1D212A]/90 mb-2">Participant Introduction</h4>
                        <p className="text-[#1D212A]/70 leading-relaxed text-base">
                          We began each session by greeting the participant, explaining the purpose of the test, and reassuring them that we were evaluating the prototype, not their performance.
                        </p>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex gap-4">
                      <div className="text-indigo-600 font-bold text-xl min-w-[30px] select-none">02</div>
                      <div>
                        <h4 className="text-lg font-semibold text-[#1D212A]/90 mb-2">Think-Aloud Protocol</h4>
                        <p className="text-[#1D212A]/70 leading-relaxed text-base">
                          Participants were encouraged to verbalize their thoughts as they interacted with the prototype, sharing doubts, expectations, and feedback in real time.
                        </p>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex gap-4">
                      <div className="text-indigo-600 font-bold text-xl min-w-[30px] select-none">03</div>
                      <div>
                        <h4 className="text-lg font-semibold text-[#1D212A]/90 mb-2">Task-Based Scenarios</h4>
                        <p className="text-[#1D212A]/70 leading-relaxed text-base">
                          Each user was guided through 3 main tasks: browsing the menu, customizing a drink, and completing an order.
                        </p>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex gap-4">
                      <div className="text-indigo-600 font-bold text-xl min-w-[30px] select-none">04</div>
                      <div>
                        <h4 className="text-lg font-semibold text-[#1D212A]/90 mb-2">Post-Test Interview</h4>
                        <p className="text-[#1D212A]/70 leading-relaxed text-base">
                          After completing the tasks, users were asked reflective questions to gather deeper insights on their experience and expectations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="text-xl font-semibold text-indigo-500 mb-4">Test Script Summary</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Script Block 1 */}
                    <div className="bg-black/[0.03] rounded-xl p-5 border border-black/10 shadow-sm text-[#1D212A]">
                      <h4 className="text-lg font-semibold mb-2">Greeting & Consent</h4>
                      <p className="text-[#1D212A]/80 text-base">
                        “Thank you for participating today. This session will help us improve our app. Feel free to share your thoughts aloud while navigating.”
                      </p>
                    </div>

                    {/* Script Block 2 */}
                    <div className="bg-black/[0.03] rounded-xl p-5 border border-black/10 shadow-sm text-[#1D212A]">
                      <h4 className="text-lg font-semibold mb-2">Task 1: Browsing</h4>
                      <p className="text-[#1D212A]/80 text-base">
                        “Can you show me how you'd browse available coffee options and select one that interests you?”
                      </p>
                    </div>

                    {/* Script Block 3 */}
                    <div className="bg-black/[0.03] rounded-xl p-5 border border-black/10 shadow-sm text-[#1D212A]">
                      <h4 className="text-lg font-semibold mb-2">Task 2: Customization</h4>
                      <p className="text-[#1D212A]/80 text-base">
                        “Try customizing the drink to your preferences—such as milk type, sugar level, or size.”
                      </p>
                    </div>

                    {/* Script Block 4 */}
                    <div className="bg-black/[0.03] rounded-xl p-5 border border-black/10 shadow-sm text-[#1D212A]">
                      <h4 className="text-lg font-semibold mb-2">Task 3: Checkout</h4>
                      <p className="text-[#1D212A]/80 text-base">
                        “Now complete the order as if you were doing it in real life. Feel free to comment on anything that feels unclear.”
                      </p>
                    </div>

                    {/* Script Block 5 */}
                    <div className="bg-black/[0.03] rounded-xl p-5 border border-black/10 shadow-sm text-[#1D212A]">
                      <h4 className="text-lg font-semibold mb-2">Post-test questions</h4>
                      <p className="text-[#1D212A]/80 text-base">
                        “What did you enjoy about the process? Was there anything confusing or unexpected? How likely would you be to use this app?”
                      </p>
                    </div>
                  </div>
                </div>

                <section className="mt-12">
                <h2 className="text-2xl font-semibold text-indigo-600 mb-8">Usability Testing Results & KPIs</h2>

                <div className="flex flex-col lg:flex-row gap-10">
                  {/* Resultados - ocupa 2/3 del ancho en desktop */}
                  <div className="lg:w-2/3 space-y-10 text-[#1D212A]/90">
                    {/* Round 1 */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Round 1 Findings</h3>
                      <ul className="list-disc list-inside space-y-3">
                        <li>
                          Users noted that the initial story-like intro felt out of place for a café app. It was replaced with a branded logo intro that better aligns with user expectations.
                        </li>
                        <li>
                          Users found the app intuitive and visually appealing. Most participants could complete an order without assistance.
                        </li>
                        <li>
                          It was observed that the home screen lacked direct access to the full menu. As a result, the first promotional banner was replaced with one that links directly to the menu.
                        </li>
                      </ul>
                    </div>

                    {/* Round 2 */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Round 2 Findings</h3>
                      <ul className="list-disc list-inside space-y-3">
                        <li>
                          Users showed interest in an option to pay for all pending orders together. A combined checkout feature was added.
                        </li>
                        <li>
                          Although product categories were shown, associated items were not displayed. This was corrected to improve product discoverability.
                        </li>
                        <li>
                          Users requested clearer confirmation when a product is added to the cart. An overlay notification was implemented to address this.
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* KPIs - ocupa 1/3 del ancho en desktop */}
                  <div className="lg:w-1/3 bg-indigo-600 rounded-lg p-6 shadow-lg text-white">
                    <h3 className="text-xl font-bold mb-6 text-center">Key Performance Indicators (KPIs)</h3>
                    <ul className="list-disc list-inside space-y-4">
                      <li><strong>Task Completion Rate:</strong> 80% of users completed core tasks (menu navigation, filtering, cart review) without assistance </li>
                      <li><strong>Time on Task:</strong>  Average task completion time was 8 minutes 45 seconds</li>
                      <li><strong>Error Rate:</strong> Users encountered an average of 2.5 errors per session, mostly related to filter usability</li>
                    </ul>
                  </div>
                </div>
                </section>
              </section>

              {/* High Fidelity prototype */}
              <div className="mt-12">
                <h3 className="text-2xl font-semibold text-indigo-500 mb-4">Refining the design</h3>
                <p className="text-base leading-relaxed text-[#1D212A]/90 mb-6">
                    For this project, I wanted to create a solution that felt both simple and sophisticated, focusing on a common pain point: ordering coffee quickly and effortlessly. After considering several ideas, I settled on designing an app for a local café named Blue & Breeze.
                    My goal was to craft a clean, intuitive experience with a calming blue and white color palette that reflects the café’s fresh and welcoming vibe. I aimed to eliminate friction in the ordering process, allowing busy professionals and coffee lovers to customize their drinks and choose delivery or pickup with ease.
                </p>
                 <img
                    src="/brand1.webp"
                    alt="Brand guide"
                    className="w-full rounded-xl mb-6 shadow-lg border border-black/10"
                  />

                <div className="mt-12">
                  <h3 className="text-2xl font-semibold text-indigo-500 mb-4">High-fidelity prototype</h3>
                  <img
                      src="/highproto1.webp"
                      alt="High Fidelity Prototype"
                      className="w-full rounded-xl mb-6 shadow-lg border border-black/10"
                    />
                  <div className="w-full h-[600px] rounded-xl shadow-lg border border-black/10 overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src="https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/proto/Z77jyAEGwbcazTtUveTxbv/Cafe-Delivery-App?node-id=132-32&page-id=125%3A55&starting-point-node-id=143%3A181&scaling=scale-down&content-scaling=fixed"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
                
                <div className="mt-16">
                  <h3 className="text-2xl font-semibold text-indigo-500 mb-6">Takeaways & Reflections</h3>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Impact */}
                    <div className="bg-black/[0.03] border border-black/10 rounded-xl p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-[#1D212A]/90 mb-4">Impact</h4>
                      <p className="text-[#1D212A]/70 leading-relaxed text-base">
                        Users shared highly positive feedback about the app's clarity and ease of use. One participant remarked,
                        <span className="italic"> "Ordering coffee has never been this easy and clear."</span>
                        Although this was a course project, the design decisions made could meaningfully enhance real-world user satisfaction.
                      </p>
                    </div>

                    {/* What I Learned */}
                    <div className="bg-black/[0.03] border border-black/10 rounded-xl p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-[#1D212A]/90 mb-4">What I Learned</h4>
                      <p className="text-[#1D212A]/70 leading-relaxed text-base">
                        This project deepened my understanding of user-centered design. I learned the value of listening to real feedback,
                        iterating based on insights, and applying accessibility principles to create a more inclusive experience.
                        Testing at every step helped refine both usability and aesthetics.
                      </p>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-black/[0.03] border border-black/10 rounded-xl p-6 shadow-md">
                      <h4 className="text-lg font-semibold text-[#1D212A]/90 mb-4">Next Steps</h4>
                      <ul className="list-disc list-inside text-[#1D212A]/70 space-y-2 text-base leading-relaxed">
                        <li>Introduce a rewards system to increase retention and engagement.</li>
                        <li>Add flexible payment options like digital wallets and installment plans.</li>
                        <li>Explore AI-based recommendations tailored to user preferences and history.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>          
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
