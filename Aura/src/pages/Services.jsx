import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import services from '../data/services'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

const PURPLE = '#2D1C3E'
const GOLD = '#C8A96A'
const IVORY = '#FBF7EF'
const LINE = 'rgba(45,28,62,0.15)'

const PETAL_COUNT = 8

const Services = () => {
  const pageRef = useRef(null)
  const heroLabelRef = useRef(null)
  const heroTitleRef = useRef(null)
  const heroRuleRef = useRef(null)
  const heroTextRef = useRef(null)
  const headerRef = useRef(null)
  const cardRefs = useRef([])

  // Couple illustration refs — now on actual shape elements, not <g> groups
  const coupleVisualRef = useRef(null)
  const groomHeadRef = useRef(null)
  const groomBodyRef = useRef(null)
  const brideHeadRef = useRef(null)
  const brideBodyRef = useRef(null)
  const brideVeilRef = useRef(null)
  const groomFillRef = useRef(null)
  const brideFillRef = useRef(null)
  const handHoldLineRef = useRef(null)
  const heartRef = useRef(null)
  const petalRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ---- Hero entrance ----
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      heroTl
        .from(heroLabelRef.current, { y: 16, opacity: 0, duration: 0.5 })
        .from(heroTitleRef.current, { y: 28, opacity: 0, duration: 0.8 }, '-=0.3')
        .from(heroRuleRef.current, { scaleX: 0, transformOrigin: 'left', duration: 0.7 }, '-=0.4')
        .from(heroTextRef.current, { y: 16, opacity: 0, duration: 0.6 }, '-=0.4')

      // ---- Couple illustration: outlines draw in, then fill, then hands connect, then heart pulses ----
      const drawableShapes = [
        groomHeadRef.current,
        groomBodyRef.current,
        brideHeadRef.current,
        brideBodyRef.current,
        brideVeilRef.current,
        handHoldLineRef.current,
      ].filter(Boolean)

      if (drawableShapes.length && coupleVisualRef.current) {
        // Set up stroke-draw state for every shape that supports getTotalLength
        drawableShapes.forEach((el) => {
          const len = el.getTotalLength()
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
        })

        gsap.set([groomFillRef.current, brideFillRef.current], { opacity: 0 })
        gsap.set(heartRef.current, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' })
        gsap.set(coupleVisualRef.current, { opacity: 0, y: 20 })
        // Hand-hold line shouldn't draw until later, so pull it out of the initial batch
        gsap.set(handHoldLineRef.current, { strokeDashoffset: handHoldLineRef.current.getTotalLength() })

        const coupleTl = gsap.timeline({ delay: 0.3 })
        coupleTl
          .to(coupleVisualRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
          .to(
            [groomHeadRef.current, groomBodyRef.current],
            { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' },
            '-=0.2'
          )
          .to(
            [brideHeadRef.current, brideBodyRef.current, brideVeilRef.current],
            { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' },
            '-=1.0'
          )
          .to([groomFillRef.current, brideFillRef.current], { opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.3')
          .to(handHoldLineRef.current, { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' }, '-=0.2')
          .to(heartRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2.2)' }, '-=0.2')
          .call(() => {
            // Gentle heartbeat loop
            gsap.to(heartRef.current, {
              scale: 1.18,
              duration: 0.55,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            })
            // Whole illustration breathes ever so slightly
            gsap.to(coupleVisualRef.current, {
              y: -5,
              duration: 2.8,
              ease: 'sine.inOut',
              repeat: -1,
              yoyo: true,
            })
          })
      }

      // ---- Floating petals around the couple ----
      petalRefs.current.forEach((petal, i) => {
        if (!petal) return
        const startX = gsap.utils.random(-20, 20)
        const drift = gsap.utils.random(-40, 40)
        const duration = gsap.utils.random(7, 12)
        const delay = gsap.utils.random(1, 6)

        gsap.set(petal, { x: startX, y: 30, opacity: 0, rotate: gsap.utils.random(-30, 30) })

        gsap.to(petal, {
          y: -340,
          x: startX + drift,
          rotate: '+=180',
          opacity: 0.5,
          duration,
          delay,
          repeat: -1,
          ease: 'sine.inOut',
        })
      })

      // ---- Section header reveal ----
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
      })

      // ---- Staggered card reveal, in rows ----
      gsap.fromTo(
        cardRefs.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: {
            each: 0.12,
            grid: 'auto',
            from: 'start',
          },
          scrollTrigger: {
            trigger: cardRefs.current[0],
            start: 'top 88%',
          },
        }
      )

      // ---- Subtle image parallax inside each card ----
      cardRefs.current.forEach((el) => {
        if (!el) return
        const img = el.querySelector('img')
        if (!img) return
        gsap.to(img, {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    }, pageRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pageRef} style={{ backgroundColor: IVORY }}>
      {/* ============ Hero ============ */}
      <section className="relative px-6 lg:px-8 pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero text */}
          <div className="lg:col-span-7">
            <span
              ref={heroLabelRef}
              style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}
              className="text-xl italic tracking-wide block"
            >
              What We Offer
            </span>
            <h1
              ref={heroTitleRef}
              style={{ fontFamily: "'Unbounded', sans-serif", color: PURPLE }}
              className="text-4xl md:text-6xl font-light tracking-tight mt-3"
            >
              Services, Crafted for Every Detail
            </h1>
            <div ref={heroRuleRef} className="h-px w-24 mt-8" style={{ backgroundColor: GOLD }} />
            <p
              ref={heroTextRef}
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: PURPLE }}
              className="max-w-lg text-sm opacity-70 leading-relaxed mt-6"
            >
              Whether it's a single ceremony or a week of celebrations, each service is built around
              one goal — you, fully present in your own wedding.
            </p>
          </div>

          {/* Couple illustration + petals visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[280px]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {Array.from({ length: PETAL_COUNT }).map((_, i) => (
                <div
                  key={i}
                  ref={(el) => (petalRefs.current[i] = el)}
                  className="absolute rounded-full"
                  style={{
                    left: `${10 + ((i * 91) % 85)}%`,
                    bottom: '5%',
                    width: i % 3 === 0 ? 9 : 6,
                    height: i % 3 === 0 ? 13 : 8,
                    backgroundColor: i % 2 === 0 ? GOLD : PURPLE,
                    opacity: 0.15,
                    borderRadius: '60% 40% 60% 40%',
                  }}
                />
              ))}
            </div>

            <div ref={coupleVisualRef} className="relative w-64 h-64 sm:w-72 sm:h-72">
              <svg
                viewBox="0 0 300 300"
                className="w-full h-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* ---- Groom (left figure): suit silhouette ---- */}
                {/* Fill (fades in after outline draws) */}
                <g ref={groomFillRef}>
                  <circle cx="105" cy="95" r="20" fill={PURPLE} opacity="0.12" />
                  <path
                    d="M75,235 C73,190 78,150 105,140 C132,150 137,190 135,235 Z"
                    fill={PURPLE}
                    opacity="0.12"
                  />
                </g>
                {/* Outline shapes — refs go directly on the drawable elements */}
                <circle
                  ref={groomHeadRef}
                  cx="105"
                  cy="95"
                  r="20"
                  stroke={PURPLE}
                  strokeWidth="2.5"
                />
                <path
                  ref={groomBodyRef}
                  d="M75,235 C73,190 78,150 105,140 C132,150 137,190 135,235"
                  stroke={PURPLE}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path d="M105,140 L105,235" stroke={PURPLE} strokeWidth="1.5" opacity="0.5" />

                {/* ---- Bride (right figure): gown silhouette ---- */}
                <g ref={brideFillRef}>
                  <circle cx="195" cy="95" r="20" fill={GOLD} opacity="0.15" />
                  <path
                    d="M170,235 C160,190 165,150 195,138 C225,150 230,190 220,235 Z"
                    fill={GOLD}
                    opacity="0.18"
                  />
                </g>
                <circle
                  ref={brideHeadRef}
                  cx="195"
                  cy="95"
                  r="20"
                  stroke={GOLD}
                  strokeWidth="2.5"
                />
                <path
                  ref={brideBodyRef}
                  d="M170,235 C160,190 165,150 195,138 C225,150 230,190 220,235"
                  stroke={GOLD}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                {/* Veil hint */}
                <path
                  ref={brideVeilRef}
                  d="M182,80 C178,100 180,118 188,130"
                  stroke={GOLD}
                  strokeWidth="1.5"
                  opacity="0.6"
                />

                {/* ---- Holding hands connecting line ---- */}
                <path
                  ref={handHoldLineRef}
                  d="M133,178 C143,185 157,185 167,178"
                  stroke={PURPLE}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* ---- Heart above their hands ---- */}
                <path
                  ref={heartRef}
                  d="M150,158 C146,152 137,152 135,160 C133,168 141,174 150,182 C159,174 167,168 165,160 C163,152 154,152 150,158 Z"
                  fill={GOLD}
                />
              </svg>

              {/* Caption */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 translate-y-full text-center pt-4 w-full">
                <p
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}
                  className="text-lg italic tracking-wide"
                >
                  Two hearts, one aura
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Services grid ============ */}
      <section className="relative py-16 sm:py-24">
        <div className="absolute top-0 left-12 right-12 h-px" style={{ backgroundColor: LINE }} />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div
            ref={headerRef}
            className="mb-16 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6"
          >
            <div>
              <span
                style={{ fontFamily: "'Cormorant Garamond', serif", color: GOLD }}
                className="text-xl italic tracking-wide"
              >
                Our Offerings
              </span>
              <h2
                style={{ fontFamily: "'Unbounded', sans-serif", color: PURPLE }}
                className="text-3xl md:text-5xl font-light tracking-tight mt-2"
              >
                Every Ceremony, Considered
              </h2>
            </div>
            <p
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: PURPLE }}
              className="max-w-xs text-xs opacity-70 leading-relaxed md:text-right"
            >
              From the first sketch of an idea to the final guest goodbye — pick a single service
              or the full journey.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <div
                key={service.id}
                ref={(el) => (cardRefs.current[i] = el)}
                className="group relative flex flex-col overflow-hidden"
                style={{ backgroundColor: '#fff' }}
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-stone-900">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-[115%] object-cover will-change-transform transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 transition-opacity duration-500 opacity-30 group-hover:opacity-55"
                    style={{ background: `linear-gradient(to top, ${PURPLE} 10%, transparent 65%)` }}
                  />
                  {/* Index marker */}
                  <span
                    className="absolute top-4 left-4 text-xs tracking-widest"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: GOLD }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Text */}
                <div
                  className="flex-1 flex flex-col p-7 border border-t-0"
                  style={{ borderColor: LINE }}
                >
                  <h3
                    style={{ fontFamily: "'Unbounded', sans-serif", color: PURPLE }}
                    className="text-lg font-light leading-snug mb-3"
                  >
                    {service.title}
                  </h3>
                  <p
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: PURPLE }}
                    className="text-sm opacity-70 leading-relaxed mb-6"
                  >
                    {service.description}
                  </p>

                  <Link
                    to={'/contact'}
                    style={{ fontFamily: "'Space Grotesk', sans-serif", color: PURPLE }}
                    className="mt-auto inline-flex items-center gap-2 text-xs tracking-widest uppercase group/btn self-start"
                  >
                    Enquire
                    <svg
                      className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover/btn:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>

                {/* Gold corner accent on hover */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: `inset 0 0 0 1px ${GOLD}` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services