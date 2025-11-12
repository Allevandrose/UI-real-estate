import { useState, useEffect } from "react";
// NEW IMPORTS FOR REMIX ICONS
import {
  RiFacebookCircleFill,
  RiLinkedinBoxFill,
  RiTwitterFill,
  RiMailFill,
  RiPhoneFill,
  RiMapPinFill,
  RiHome4Line, // For Buy Homes
  RiKey2Line, // For Rent Apartments
  RiBriefcase2Line, // For Sell Property
  RiMapLine, // For Land & Plots
} from "@remixicon/react";

// NEW: API service
import api from "../services/api";

function TextType({
  text,
  typingSpeed,
  deletingSpeed,
  pauseDuration,
  showCursor,
  cursorCharacter,
  textColors,
}) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const fullText = text[currentTextIndex];

    if (isPaused) {
      const timer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(timer);
    }

    if (!isDeleting && currentText === fullText) {
      setIsPaused(true);
      return;
    }

    if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentTextIndex((prev) => (prev + 1) % text.length);
      return;
    }

    const timer = setTimeout(
      () => {
        setCurrentText((prev) => {
          if (isDeleting) {
            return fullText.substring(0, prev.length - 1);
          } else {
            return fullText.substring(0, prev.length + 1);
          }
        });
      },
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [
    currentText,
    isDeleting,
    isPaused,
    currentTextIndex,
    text,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return (
    <span style={{ color: textColors[currentTextIndex] }}>
      {currentText}
      {showCursor && <span className="animate-pulse">{cursorCharacter}</span>}
    </span>
  );
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  // NEW: Property state
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // NEW: Fetch properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await api.get("/properties");
        if (res.data.success) {
          // Show only first 6 properties
          setProperties(res.data.data.slice(0, 6) || []);
        }
      } catch (err) {
        setError("Failed to load properties");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // UPDATED services array with Remix Icons as components instead of Emojis
  const services = [
    {
      title: "Buy Homes",
      icon: <RiHome4Line />, // Replaced 🏡 with RiHome4Line
      desc: "Explore verified listings for buying homes with ease and confidence.",
    },
    {
      title: "Rent Apartments",
      icon: <RiKey2Line />, // Replaced 🔑 with RiKey2Line
      desc: "Explore verified listings for renting apartments with ease and confidence.",
    },
    {
      title: "Sell Property",
      icon: <RiBriefcase2Line />, // Replaced 💼 with RiBriefcase2Line
      desc: "Explore verified listings for selling property with ease and confidence.",
    },
    {
      title: "Land & Plots",
      icon: <RiMapLine />, // Replaced 🗺️ with RiMapLine
      desc: "Explore verified listings for land & plots with ease and confidence.",
    },
  ];

  const testimonials = [
    {
      name: "Jane Wanjiku",
      role: "Home Buyer",
      text: "Home254 helped me find my dream home in Kilimani quickly — professional and trustworthy!",
    },
    {
      name: "David Omondi",
      role: "Property Investor",
      text: "The platform made it so easy to browse and compare properties. Found the perfect investment!",
    },
    {
      name: "Sarah Muthoni",
      role: "First-Time Renter",
      text: "Transparent pricing and verified listings gave me confidence. Highly recommend Home254!",
    },
  ];

  // Helper for image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://placehold.co/600x400?text=No+Image";
    return `http://localhost:5000${imagePath}`;
  };

  return (
    <div className="w-full bg-gray-50 text-gray-800 overflow-x-hidden">
      {/* HERO SECTION (REST OF THE COMPONENT) */}
      <section className="relative pt-32 pb-24 bg-gradient-to-br from-white via-blue-50 to-indigo-50 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 relative">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-6 animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
              We Help You Find <br />
              <TextType
                text={[
                  "the Perfect Home in Kenya",
                  "Affordable Apartments & Plots",
                  "Trusted Agents Nationwide",
                ]}
                typingSpeed={70}
                deletingSpeed={40}
                pauseDuration={2000}
                showCursor={true}
                cursorCharacter="|"
                textColors={["#1E3A8A", "#2563EB", "#047857"]}
              />
            </h1>

            <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Browse verified listings for sale and rent across the country —
              modern apartments, family homes, and investment plots.
            </p>

            <button className="group bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 mx-auto lg:mx-0">
              Get Started
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>

            {/* Stats */}
            <div className="flex gap-8 pt-8 justify-center lg:justify-start">
              <div>
                <div className="text-3xl font-bold text-blue-700">500+</div>
                <div className="text-sm text-gray-600">Properties</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-700">1000+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-700">50+</div>
                <div className="text-sm text-gray-600">Locations</div>
              </div>
            </div>
          </div>

          {/* Hero Image with circular design */}
          <div className="flex-1 relative">
            <div className="relative">
              {/* Large circular background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full transform scale-110 opacity-10"></div>

              {/* Image container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img
                  src="/images/appartment.jpg"
                  alt="Modern apartment"
                  className="w-full h-auto object-cover"
                  onError={(e) =>
                    (e.target.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23e5e7eb" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%239ca3af"%3EProperty Image%3C/text%3E%3C/svg%3E')
                  }
                />
              </div>

              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Verified</div>
                    <div className="text-sm text-gray-600">All Listings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-gray-400">SCROLL DOWN</div>
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full mx-auto mt-2 flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* 👇 NEW: PROPERTY LISTINGS SECTION (PUBLIC) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore the latest verified listings for sale and rent across
              Kenya.
            </p>
            <div className="mt-6">
              <a
                href="/property"
                className="inline-block text-blue-600 font-medium hover:underline"
              >
                View all properties →
              </a>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-gray-50 rounded-xl animate-pulse h-80"
                ></div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">{error}</div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No properties available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <a
                  key={property._id}
                  href={`/property/${property._id}`}
                  className="block bg-white rounded-xl shadow-md hover:shadow-lg transition group"
                >
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={getImageUrl(property.images[0])}
                      alt={property.title}
                      className="w-full h-48 object-cover rounded-t-xl"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/600x400?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-t-xl flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-blue-700 transition-colors">
                        {property.title}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {property.propertyType === "sale"
                          ? "For Sale"
                          : "For Rent"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {property.location.town}, {property.location.county}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-green-600">
                      KES {property.price.toLocaleString()}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-50 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              We Provide the Best Services
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need to buy, sell, or rent property in Kenya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                className="group relative p-8 bg-gradient-to-br from-blue-50 to-white hover:from-blue-700 hover:to-blue-800 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">
                  {service.icon} {/* Now displays the Remix Icon component */}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 group-hover:text-blue-100 transition-colors mb-4">
                  {service.desc}
                </p>
                <button className="text-blue-700 group-hover:text-white font-semibold flex items-center gap-2 transition-colors">
                  READ MORE
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>

                {/* Highlight effect */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-700 rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIMPLE SOLUTIONS */}
      <section className="relative py-24 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full opacity-5 translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image side with circular design */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-white rounded-full opacity-10 transform scale-110"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/appartment1.jpg"
                  alt="Simple solutions"
                  className="w-full h-auto object-cover"
                  onError={(e) =>
                    (e.target.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%233b82f6" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%23ffffff"%3EWorkspace%3C/text%3E%3C/svg%3E')
                  }
                />
              </div>
            </div>

            {/* Content side */}
            <div className="order-1 lg:order-2 space-y-8">
              <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
                Simple Solutions!
              </h2>

              <p className="text-blue-100 text-lg">
                Follow our streamlined process to find your perfect property in
                Kenya
              </p>

              <div className="space-y-6">
                {[
                  {
                    num: "1",
                    title: "Contact us",
                    desc: "Reach out to our expert team",
                  },
                  {
                    num: "2",
                    title: "Consult",
                    desc: "Discuss your property needs",
                  },
                  {
                    num: "3",
                    title: "Place order",
                    desc: "Select your ideal property",
                  },
                  {
                    num: "4",
                    title: "Payment",
                    desc: "Secure and transparent process",
                  },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-12 h-12 bg-white/20 group-hover:bg-white rounded-xl flex items-center justify-center font-bold text-xl group-hover:text-blue-700 transition-all">
                      {step.num}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xl mb-1">
                        {step.title}
                      </h4>
                      <p className="text-blue-200">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  Get Started
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-700 transition-all">
                  Read more
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT AGENCY */}
      <section
        id="about"
        className="py-24 bg-gradient-to-b from-white to-gray-50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Our Agency
              </h2>

              <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                <p>
                  Home254 connects Kenyans with trusted property listings across
                  Nairobi, Mombasa, Kisumu, and beyond.
                </p>
                <p>
                  Our mission is to make property search transparent, safe, and
                  effortless. With hundreds of verified listings and a dedicated
                  team of professionals, we're revolutionizing real estate in
                  Kenya.
                </p>
                <p>
                  We believe everyone deserves access to quality housing and
                  investment opportunities. That's why we've built a platform
                  that puts your needs first.
                </p>
              </div>

              <button className="bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
                Read more
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            </div>

            {/* Image with modern layout */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/appartment2.jpg"
                  alt="Our agency"
                  className="w-full h-auto object-cover"
                  onError={(e) =>
                    (e.target.src =
                      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect fill="%23e5e7eb" width="600" height="400"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="%239ca3af"%3EAgency%3C/text%3E%3C/svg%3E')
                  }
                />
              </div>

              {/* Decorative element */}
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 text-gray-900">
              What Clients Say
            </h2>
            <p className="text-gray-600 text-lg">
              Real stories from satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>

                <p className="text-gray-600 leading-relaxed mb-4">
                  "{testimonial.text}"
                </p>

                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      ★
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section
        id="contact"
        className="relative bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white py-20 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Start exploring homes or list your property for free today. Join
            thousands of satisfied customers.
          </p>
          <button className="bg-white text-blue-700 px-10 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 text-lg">
            Contact us
          </button>
        </div>
      </section>

      {/* FOOTER - UPDATED WITH REMIX ICONS */}
      <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-950 text-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">H</span>
                </div>
                <span className="text-2xl font-bold text-white">Home254</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Kenya's trusted home marketplace — connecting buyers, sellers,
                and renters nationwide.
              </p>
              {/* Social Icons */}
              <div className="flex gap-3 pt-2">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                  aria-label="Facebook"
                >
                  <RiFacebookCircleFill className="text-lg text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                  aria-label="LinkedIn"
                >
                  <RiLinkedinBoxFill className="text-lg text-white" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                  aria-label="Twitter"
                >
                  <RiTwitterFill className="text-lg text-white" />
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-white text-lg mb-4">Contact Us</h4>
              <div className="space-y-3 text-gray-400">
                <p className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                  <RiMailFill className="text-lg" />
                  info@home254.com
                </p>
                <p className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                  <RiPhoneFill className="text-lg" />
                  +254 700 000 000
                </p>
                <p className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                  <RiMapPinFill className="text-lg" />
                  Nairobi, Kenya
                </p>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold text-white text-lg mb-4">Services</h4>
              <div className="space-y-3">
                <p className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Buy Homes
                </p>
                <p className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Rent Apartments
                </p>
                <p className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Sell Property
                </p>
                <p className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Land Listings
                </p>
              </div>
            </div>

            {/* About */}
            <div>
              <h4 className="font-bold text-white text-lg mb-4">About Us</h4>
              <div className="space-y-3">
                <p className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  News
                </p>
                <p className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  About Us
                </p>
                <p className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </p>
                <p className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Terms of Use
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>© 2025 Home254.com – All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
