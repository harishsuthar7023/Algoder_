import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import {
  aboutHeader,
  toolFeatures,
  mission,
  reasonsToChoose,
  callToAction,
} from "../content/aboutContent";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-neutral-800 text-white px-4 md:px-6 py-24">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* What We Do */}
          <section className="bg-[#303030] rounded-2xl p-8 shadow-xl border border-neutral-700">
            <h2 className="text-3xl font-bold mb-4 text-indigo-400 tracking-tight">{aboutHeader.title}</h2>
            <p className="text-gray-300 text-lg leading-relaxed">{aboutHeader.description}</p>
          </section>

          {/* Our Tools & Expertise */}
          <section className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
            {toolFeatures.map((section, idx) => (
              <div key={idx} className="bg-[#303030] p-6 rounded-xl border border-neutral-700 shadow-md hover:shadow-lg transition duration-300">
                <h3 className="text-xl font-semibold text-indigo-400 mb-2">{section.title}</h3>
                {section.intro && (
                  <p className="text-gray-400 mb-3">{section.intro}</p>
                )}
                <ul className="list-disc list-inside text-gray-300 space-y-1 pl-1">
                  {section.points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Mission */}
          <section className="bg-[#303030] rounded-2xl p-8 shadow-xl border border-neutral-700">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">{mission.title}</h2>
            <p className="text-gray-300 text-lg leading-relaxed">{mission.description}</p>
          </section>

          {/* Why Choose Us */}
          <section className="bg-[#303030] rounded-2xl p-8 shadow-xl border border-neutral-700">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">{reasonsToChoose.title}</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-lg pl-2">
              {reasonsToChoose.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </section>

          {/* Call to Action */}
          <div className="text-center">
            <h3 className="text-3xl font-semibold text-indigo-400 mb-4">{callToAction.title}</h3>
            <p className="text-gray-400 mb-6 text-lg">{callToAction.subtitle}</p>
            <a
              href={callToAction.buttonLink}
              className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-8 py-3 rounded-full shadow-md transition duration-300"
            >
              {callToAction.buttonText}
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
