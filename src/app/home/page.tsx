import type { Metadata } from "next";
import Link from "next/link";
import axios from "axios";
import { BLOG_API, SERVICE_API, TESTIMONIAL_API } from "@/api/api";
import { SERVICES } from "@/utils/content";
import { SITE } from "@/utils/site";
import Navbar from "@/components/Navbar";
import Hero from "@/components/ui/Hero";
import TherapistIntro from "@/components/ui/TherapistIntro";
import ServiceCards, { type ServiceItem } from "@/components/ui/ServiceCards";
import Testimonials from "@/components/ui/Testimonials";
import LatestBlogs from "@/components/ui/LatestBlogs";
import BringsYouHere from "@/components/ui/BringsYouHere";
import SupportMoments from "@/components/ui/OurApproach";
import OurApproach from "@/components/ui/OurApproach";
import YourJourney from "@/components/ui/YouJourney";
import FrequentlyAskedQuestions from "@/components/ui/FrequentlyAskedQuestions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Helping You Reclaim Your Inner Harmony",
  description: "Individual, career, family and relationship counselling with Kiran Khullar at Mind and Soul Klinik.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  let services: ServiceItem[] = [];
  let blogs: any[] = [];
  let testimonials: any[] = [];

  const getServices = async () => {
    try {
      const response = await axios.get(`${SITE.url}${SERVICE_API.GET_ALL}`);
      services = (response.data.data || []).map((s: any) => ({ id: String(s._id), title: s.title, tone: s.tone, description: s.description, points: s.points || [] }));
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
    }
  };
  const getLatestBlogs = async () => {
    try {
      const response = await axios.get(`${SITE.url}${BLOG_API.GET_ALL}`, { params: { limit: 3 } });
      blogs = response.data.data || [];
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
    }
  };
  const getTestimonials = async () => {
    try {
      const response = await axios.get(`${SITE.url}${TESTIMONIAL_API.GET_ALL}`, { params: { limit: 6 } });
      testimonials = response.data.data || [];
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  await Promise.all([getServices(), getLatestBlogs(), getTestimonials()]);
  // If the database has no services yet, show the supplied copy so the page is never empty.
  const cards: ServiceItem[] = services.length ? services : SERVICES.map((s) => ({ ...s }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: SITE.name,
    telephone: SITE.phone,
    email: SITE.email,
    url: SITE.url,
  };

  return (
    <>
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <main className="design-system-page">
        <Hero />
        <BringsYouHere />
        <TherapistIntro />
        <ServiceCards services={cards} />
        <OurApproach />
        <YourJourney />
        <FrequentlyAskedQuestions />
        <Testimonials items={testimonials} />
        <LatestBlogs items={blogs} />
        <section className="section">
          <div className="container-site text-center">
            <h2 className="heading-lg">Ready to talk?</h2>
            <p className="text-body mx-auto mt-4">Call {SITE.phone} or send a message, and we will help you take the first step.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/book-session" className="btn btn-primary">Book an Appointment</Link>
              <Link href="/contact" className="btn btn-outline">Contact us</Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
