import { useState, useEffect } from "react";
import {
  RiFacebookCircleFill,
  RiLinkedinBoxFill,
  RiTwitterFill,
  RiMailFill,
  RiPhoneFill,
  RiMapPinFill,
  RiHome4Line,
  RiKey2Line,
  RiBriefcase2Line,
  RiMapLine,
  RiSearchLine,
} from "@remixicon/react";
import api from "../services/api";
import { searchProperties, fetchProperties } from "../services/propertyService";

// Typing animation component
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
        setCurrentText((prev) =>
          isDeleting
            ? fullText.substring(0, prev.length - 1)
            : fullText.substring(0, prev.length + 1)
        );
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
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Search filters
  const [filters, setFilters] = useState({
    "location.county": "",
    "location.town": "",
    propertyType: "",
    category: "",
    price: "",
    "specs.bedrooms": "",
    "specs.bathrooms": "",
  });

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Fetch properties with filters
  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        const isEmpty = Object.values(filters).every((val) => !val);
        const res = isEmpty
          ? await fetchProperties()
          : await searchProperties(filters);
        setProperties(res.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () =>
    setFilters({
      "location.county": "",
      "location.town": "",
      propertyType: "",
      category: "",
      price: "",
      "specs.bedrooms": "",
      "specs.bathrooms": "",
    });

  const getImageUrl = (image) =>
    image?.startsWith("http")
      ? image
      : "https://placehold.co/600x400?text=No+Image";

  // Services
  const services = [
    {
      title: "Buy Homes",
      icon: <RiHome4Line />,
      desc: "Explore verified listings for buying homes with ease and confidence.",
    },
    {
      title: "Rent Apartments",
      icon: <RiKey2Line />,
      desc: "Find quality apartments for rent across Kenya.",
    },
    {
      title: "Sell Property",
      icon: <RiBriefcase2Line />,
      desc: "List your property and reach verified buyers fast.",
    },
    {
      title: "Land & Plots",
      icon: <RiMapLine />,
      desc: "Secure land or plots in prime locations.",
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

  return (
    <div className="w-full bg-gray-50 text-gray-800 overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 bg-gradient-to-br from-white via-blue-50 to-indigo-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16 relative">
          <div className="flex-1 text-center lg:text-left space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
              We Help You Find <br />
              <span className="text-3xl lg:text-4xl">
                <TextType
                  text={[
                    "Your Perfect Home",
                    "Affordable Properties",
                    "Trusted Agents",
                  ]}
                  typingSpeed={70}
                  deletingSpeed={40}
                  pauseDuration={2000}
                  showCursor={true}
                  cursorCharacter="|"
                  textColors={["#1E3A8A", "#2563EB", "#047857"]}
                />
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Browse verified listings for sale and rent across the country —
              modern apartments, family homes, and investment plots.
            </p>
          </div>
          <div className="flex-1 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="/images/appartment.jpg"
                alt="Modern apartment"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ✅ SEARCH & FILTER SECTION - REDESIGNED */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center justify-center gap-3 mb-8">
              <RiSearchLine className="text-blue-600 text-2xl" />
              <h3 className="text-2xl font-bold text-gray-900">
                Find Your Perfect Property
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <input
                name="location.county"
                value={filters["location.county"]}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="County (e.g., Nairobi)"
              />
              <input
                name="location.town"
                value={filters["location.town"]}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Town (e.g., Westlands)"
              />
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Property Type</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Category</option>
                <option value="apartment">Apartment</option>
                <option value="bungalow">Bungalow</option>
                <option value="land">Land</option>
                <option value="office">Office</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <input
                name="price"
                type="number"
                value={filters.price}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Max Price (KES)"
              />
              <select
                name="specs.bedrooms"
                value={filters["specs.bedrooms"]}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Bedrooms</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
              <select
                name="specs.bathrooms"
                value={filters["specs.bathrooms"]}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Bathrooms</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
              <button
                onClick={resetFilters}
                className="w-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 py-3 rounded-xl font-semibold hover:from-gray-200 hover:to-gray-300 transition-all shadow-sm hover:shadow-md"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES - REDESIGNED HEADING */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {loading ? "Loading Properties..." : "Available Properties"}
            </h2>
            <p className="text-lg text-gray-600">
              {loading
                ? "Please wait"
                : `${properties.length} properties ${
                    filters["location.county"]
                      ? `in ${filters["location.county"]}`
                      : "across Kenya"
                  }`}
            </p>
          </div>

          {error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : properties.length === 0 ? (
            <p className="text-center text-gray-500">
              No properties match your filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <a
                  key={property._id}
                  href={`/property/${property._id}`}
                  className="block bg-white rounded-xl shadow-md hover:shadow-lg transition"
                >
                  <img
                    src={getImageUrl(property.images?.[0])}
                    alt={property.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-lg text-gray-900">
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

      {/* SERVICES */}
      <section id="services" className="py-24 bg-white relative">
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
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-white transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 group-hover:text-blue-100 transition-colors mb-4">
                  {service.desc}
                </p>
                <button className="text-blue-700 group-hover:text-white font-semibold flex items-center gap-2 transition-colors">
                  READ MORE{" "}
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIMPLE SOLUTIONS */}
      <section className="relative py-24 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full opacity-5 translate-x-1/2 translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
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
                Read more{" "}
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </button>
            </div>
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

      {/* FOOTER - FIXED ALIGNMENT */}
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
