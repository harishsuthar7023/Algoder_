import { useEffect, useRef, useState } from "react";
import "../index.css";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import Navbar from "../components/NavBar";
import Footer from "../components/HomeSections/Footer";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomIn, ZoomOut, RotateCcw, X, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";

function ProductDetail() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const mainImageRef = useRef(null);
  const buyNowRef = useRef(null);
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("animate-in");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    document.querySelectorAll(".animate-element").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [product]);

  useEffect(() => {
    API.get(`/products/${id}/`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error(err);
        setNotFound(true);
      });
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setIsModalOpen(false);
    if (isModalOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isModalOpen]);

  const convertToEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  if (notFound) {
    return (
      <>
        <Navbar />
        <div className="relative flex items-center justify-center min-h-screen bg-neutral-900 px-5">
          <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl text-white p-8 rounded-2xl border border-white/10 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Product not found</h2>
            <p className="text-neutral-400 text-sm mb-6">
              This product may have been removed or the link is incorrect.
            </p>
            <button
              onClick={() => navigate("/products")}
              className="bg-gradient-to-r from-blue-500 to-cyan-400 text-neutral-900 px-5 py-2.5 rounded-lg text-sm font-semibold"
            >
              Browse products
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="relative bg-neutral-900 min-h-screen pt-24 px-4 sm:px-6 md:px-12 pb-24 overflow-hidden">
          <div className="pointer-events-none absolute top-24 left-1/4 w-96 h-96 bg-blue-500/[0.07] rounded-full blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/[0.06] rounded-full blur-[120px]" />
          <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 animate-pulse">
            <div className="aspect-video rounded-2xl bg-white/[0.04] border border-white/10" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 bg-white/[0.04] rounded-lg" />
              <div className="h-24 rounded-2xl bg-white/[0.04]" />
              <div className="h-16 rounded-2xl bg-white/[0.04]" />
              <div className="h-12 rounded-xl bg-white/[0.04]" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // 👇 Ab yahan aane tak product guaranteed non-null hai
  const productImages =
    product.images?.length > 0
      ? product.images.map((img) => img.image_url)
      : ["https://via.placeholder.com/800x600/171717/525252?text=No+Image"];

  const imageSlides = productImages.map((img, index) => ({
    type: "image",
    src: img,
    title: `Product image ${index + 1}`,
  }));

  const videoSlides = [product.video_url_1]
    .filter(Boolean)
    .map((url, index) => ({
      type: "video",
      src: url,
      title: `Product video ${index + 1}`,
    }));

  const images = [...videoSlides, ...imageSlides];

  const updateImage = (index) => {
    const imgEl = mainImageRef.current;
    if (imgEl) {
      imgEl.style.opacity = "0.4";
      imgEl.style.transform = "scale(0.97)";
      setTimeout(() => {
        setCurrentImageIndex(index);
        imgEl.style.opacity = "1";
        imgEl.style.transform = "scale(1)";
      }, 150);
    } else {
      setCurrentImageIndex(index);
    }
  };

  const nextImage = () => updateImage((currentImageIndex + 1) % images.length);
  const prevImage = () => updateImage((currentImageIndex - 1 + images.length) % images.length);
  const goToImage = (index) => updateImage(index);

  const openModal = () => {
    if (images[currentImageIndex].type === "video") return;
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleBuyNow = () => {
    const btn = buyNowRef.current;
    if (!btn) return;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>Processing…</span>';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      navigate(`/checkout/${product.id}/${product.types}`);
    }, 700);
  };

  return (
    <>
      <Navbar />
      <div className="relative bg-neutral-900 text-neutral-200 min-h-screen pt-24 px-4 sm:px-6 md:px-12 pb-24 overflow-hidden">
        <div className="pointer-events-none absolute top-24 left-1/4 w-96 h-96 bg-blue-500/[0.07] rounded-full blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/[0.06] rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-start">
          {/* LEFT: Media Section */}
          <div className="lg:sticky lg:top-24">
            <div className="relative w-full h-[220px] sm:h-[420px] lg:h-[360px] bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              {images[currentImageIndex].type === "video" ? (
                <iframe
                  src={convertToEmbedUrl(images[currentImageIndex].src)}
                  title={images[currentImageIndex].title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  frameBorder="0"
                />
              ) : (
                <img
                  ref={mainImageRef}
                  src={images[currentImageIndex].src}
                  alt={images[currentImageIndex].title}
                  className="w-full h-full object-cover transition-all duration-200 cursor-zoom-in"
                  onClick={openModal}
                />
              )}

              {images[currentImageIndex].type !== "video" && (
                <button
                  onClick={openModal}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-neutral-900/70 backdrop-blur-md border border-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-neutral-800/80 transition-colors"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  Tap to zoom
                </button>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    aria-label="Previous"
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-neutral-900/60 backdrop-blur-md border border-white/10 hover:bg-neutral-800/80 text-white rounded-full p-2 sm:p-2.5 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    aria-label="Next"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-neutral-900/60 backdrop-blur-md border border-white/10 hover:bg-neutral-800/80 text-white rounded-full p-2 sm:p-2.5 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute top-3 left-3 bg-neutral-900/70 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToImage(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentImageIndex === index
                        ? "w-6 bg-gradient-to-r from-blue-400 to-cyan-300"
                        : "w-2 bg-white/15 hover:bg-white/25"
                    }`}
                  />
                ))}
              </div>
            )}

            {images.length > 1 && (
              <div className="hidden lg:flex gap-2 mt-4 overflow-x-auto pb-1">
                {images.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToImage(idx)}
                    className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors bg-neutral-800 ${
                      currentImageIndex === idx ? "border-blue-400" : "border-white/10 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {slide.type === "video" ? (
                      <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                        <PlayCircle className="w-6 h-6 text-white/70" />
                      </div>
                    ) : (
                      <img src={slide.src} alt="" className="w-full h-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Product Info */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                {product.name}
              </h1>
              <p className="inline-flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                Instant delivery
              </p>
            </div>

            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 sm:p-6 rounded-2xl overflow-hidden">
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-3">
                ₹{product.price}
              </div>
              {product.original_price && Number(product.original_price) > Number(product.price) && (
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="text-neutral-500 line-through">₹{product.original_price}</span>
                  {product.discount && (
                    <span className="bg-red-500/15 text-red-400 border border-red-400/20 px-2.5 py-0.5 rounded-full text-xs font-bold">
                      {product.discount}% off
                    </span>
                  )}
                  <span className="text-emerald-400 font-medium">
                    Save ₹{(product.original_price - product.price).toFixed(0)}
                  </span>
                </div>
              )}
            </div>

            {product.description && (
              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-5 sm:p-6 rounded-2xl">
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                  Description
                </h3>
                <p className="text-neutral-300 text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            <button
              ref={buyNowRef}
              onClick={handleBuyNow}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-neutral-900 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-bold transition-all duration-200 shadow-[0_0_24px_rgba(34,211,238,0.35)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Buy now — ₹{product.price}
            </button>
          </div>
        </div>

        {/* Product Details */}
        {product.details?.length > 0 && (
          <div className="relative max-w-7xl mx-auto mt-8 animate-element fade-in-up">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-2xl">

              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
                Product details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">

                {product.details.flatMap((item) =>
                  item.text
                    .split(/\/n|\\n|\n/)
                    .map((text) => text.trim())
                    .filter(Boolean)
                ).map((text, i) => (
                  <div className="flex items-center gap-3" key={i}>

                    <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300" />

                    <span className="text-neutral-300 text-sm sm:text-base">
                      {text}
                    </span>

                  </div>
                ))}

              </div>
            </div>
          </div>
        )}

        {/* Descriptions */}
        {product.descriptions?.length > 0 && (
          <div className="relative max-w-7xl mx-auto mt-6 animate-element fade-in-up">
            <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 sm:p-8 rounded-2xl space-y-6">
              {product.descriptions.map((desc, i) => (
                <div key={i}>
                  {desc.heading && (
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{desc.heading}</h3>
                  )}
                  <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line">
                    {desc.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trust Cards */}
        <div className="relative max-w-7xl mx-auto mt-8 animate-element fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              { iconColor: "from-emerald-500 to-emerald-400", ring: "ring-emerald-400/20", title: "Lifetime license", desc: "One-time purchase with unlimited access and updates", iconPath: "M5 13l4 4L19 7" },
              { iconColor: "from-blue-500 to-cyan-400", ring: "ring-blue-400/20", title: "Tech support", desc: "WhatsApp and Zoom help for setup, bugs, or strategy issues", iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
              { iconColor: "from-purple-500 to-fuchsia-400", ring: "ring-purple-400/20", title: "Remote setup", desc: "Free AnyDesk or Zoom support for first-time setup", iconPath: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
            ].map((item, i) => (
              <div
                className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 p-7 sm:p-8 rounded-2xl text-center transition-transform duration-300 hover:-translate-y-1 hover:border-white/20"
                key={i}
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${item.iconColor} ring-4 ${item.ring} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <svg className="w-7 h-7 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.iconPath} />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FULLSCREEN ZOOM MODAL */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-neutral-950/95 backdrop-blur-sm z-[100] flex flex-col"
          style={{ touchAction: "none" }}
        >
          <TransformWrapper
            key={currentImageIndex}
            initialScale={1}
            minScale={1}
            maxScale={5}
            centerOnInit
            wheel={{ step: 0.15 }}
            pinch={{ step: 5 }}
            doubleClick={{ mode: "zoomIn", step: 1 }}
            panning={{ velocityDisabled: true }}
            alignmentAnimation={{ disabled: true }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 z-10">
                  <div className="text-white/70 text-sm font-medium">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => zoomOut()}
                      aria-label="Zoom out"
                      className="bg-white/5 border border-white/10 text-white w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => zoomIn()}
                      aria-label="Zoom in"
                      className="bg-white/5 border border-white/10 text-white w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => resetTransform()}
                      aria-label="Reset zoom"
                      className="bg-white/5 border border-white/10 text-white w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={closeModal}
                      aria-label="Close"
                      className="bg-white/5 border border-white/10 text-white w-10 h-10 rounded-lg flex items-center justify-center hover:bg-red-500/20 hover:border-red-400/30 transition-colors ml-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="relative flex-1 flex items-center justify-center overflow-hidden">
                  {images.length > 1 && (
                    <button
                      onClick={() => {
                        resetTransform();
                        prevImage();
                      }}
                      aria-label="Previous"
                      className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/5 border border-white/10 text-white w-11 h-11 rounded-full items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  )}

                  <TransformComponent
                    wrapperStyle={{ width: "100%", height: "100%" }}
                    contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <img
                      src={images[currentImageIndex].src}
                      alt={images[currentImageIndex].title}
                      className="max-w-[92vw] max-h-[75vh] object-contain select-none"
                      draggable={false}
                    />
                  </TransformComponent>

                  {images.length > 1 && (
                    <button
                      onClick={() => {
                        resetTransform();
                        nextImage();
                      }}
                      aria-label="Next"
                      className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/5 border border-white/10 text-white w-11 h-11 rounded-full items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="px-4 sm:px-6 pb-5 pt-2">
                  {images.length > 1 && (
                    <div className="flex sm:hidden items-center justify-center gap-6 mb-4">
                      <button
                        onClick={() => {
                          resetTransform();
                          prevImage();
                        }}
                        className="bg-white/5 border border-white/10 text-white w-11 h-11 rounded-full flex items-center justify-center"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-white/60 text-xs">Pinch to zoom · double-tap to reset</span>
                      <button
                        onClick={() => {
                          resetTransform();
                          nextImage();
                        }}
                        className="bg-white/5 border border-white/10 text-white w-11 h-11 rounded-full flex items-center justify-center"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  {images.length > 1 && (
                    <div className="flex gap-2 justify-center overflow-x-auto pb-1">
                      {images.map((slide, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            resetTransform();
                            goToImage(idx);
                          }}
                          className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${
                            currentImageIndex === idx ? "border-blue-400" : "border-white/10 opacity-60 hover:opacity-100"
                          }`}
                        >
                          {slide.type === "video" ? (
                            <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                              <PlayCircle className="w-5 h-5 text-white/70" />
                            </div>
                          ) : (
                            <img src={slide.src} alt="" className="w-full h-full object-cover" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </TransformWrapper>
        </div>
      )}

      <Footer />
    </>
  );
}

export default ProductDetail;