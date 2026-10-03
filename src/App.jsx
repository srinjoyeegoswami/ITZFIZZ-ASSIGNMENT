import React, { useRef } from 'react'
import './index.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import carImg from './car-img.jpg'
import starryVideo from './starry.mp4'

gsap.registerPlugin(ScrollTrigger)

const App = () => {
  const containerRef = useRef(null)
  const welcomeRef = useRef(null)
  const carWrapperRef = useRef(null)
  const carBodyRef = useRef(null)
  const headlightRef = useRef(null)
  const roadRef = useRef(null)

  const statLeftRef = useRef(null)
  const statCenterRef = useRef(null)
  const statRightRef = useRef(null)

  useGSAP(
    () => {
      // 1. Engine idle bounce
      const engineIdle = gsap.to(carBodyRef.current, {
        y: -3,
        duration: 0.07,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      let scrollTimeout = null

      // 2. Master Scrub Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            engineIdle.pause()

            clearTimeout(scrollTimeout)
            // If the user has scrolled to the end (progress near 100%), stop permanently and reset position
            if(self.progress>=0.98){
              gsap.set(carBodyRef.current,{y:0})
              gsap.ser(carWrapperRef.current,{y:0})
              return
            }
            // Otherwise (start or middle), resume vibration after 120ms of no scrolling
            scrollTimeout = setTimeout(() => {
              engineIdle.play()
            }, 120)
          },
        },
      })

      // STAGE 1: Welcome fades out, Headlights beam turns ON, Road brightens
      tl.to(welcomeRef.current, { opacity: 0, y: -25, duration: 0.9 }, 0)
      tl.to(headlightRef.current, { opacity: 1, scaleX: 1.0, duration: 0.4 }, 0)
      tl.to(roadRef.current, { opacity: 0.90, duration: 0.6 }, 0.1)

      // STAGE 2: Move to Center & reveal Left + Center Stats
      tl.to(
        carWrapperRef.current,
        {
          left: '50%',
          transform: 'translate(-50%, -50%)',
          duration: 1.5,
          ease: 'power1.inOut',
        },
        0.2
      )
      tl.to(statLeftRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.4)
      tl.to(statCenterRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.95)

      // STAGE 3: Move to Right & reveal Right Stat
      tl.to(
        carWrapperRef.current,
        {
          left: 'calc(100% - 20px)',
          transform: 'translate(-100%, -50%)',
          duration: 1.5,
          ease: 'power1.inOut',
        },
        1.5
      )
      tl.to(statRightRef.current, { opacity: 1, y: 0, duration: 0.6 }, 1.8)

      // STAGE 4: Final Fade-out of stats only
      tl.to(
        [statLeftRef.current, statCenterRef.current, statRightRef.current,headlightRef.current],
        {
          opacity: 0,
          y: -15,
          duration: 0.8,
          ease: 'power1.out',
        },
        2.5
      )
    },
    { scope: containerRef }
  )

  return (
    <div className='scroll-track' ref={containerRef}>
      <div className='the-stage'>
        <video src={starryVideo} loop autoPlay muted playsInline />

        {/* The Road and Pavement Track */}
        <div className='road-track' ref={roadRef}>
          <div className='pavement-curb top-curb'></div>
          <div className='lane-divider'></div>
          <div className='pavement-curb bottom-curb'></div>
        </div>

        {/* Welcome */}
        <div className='welcome' ref={welcomeRef}>
          <div><p>Welcome Itzfizz</p></div>
          <div><p>Scroll To see magic</p></div>
        </div>

        {/* Car with Headlight */}
        <div className='car-wrapper' ref={carWrapperRef}>
          <div className='car-body' ref={carBodyRef}>
            {/* The Cast Light Beam */}
            <div className='headlight-beam' ref={headlightRef}></div>
            <img className='car-img' src={carImg} alt='Car' />
          </div>
        </div>

        {/* Stats */}
        <div className='stats'>
          <div className='stat-box stat-left' ref={statLeftRef}>
            <h3>98%</h3>
            <p>Efficiency</p>
          </div>

          <div className='stat-box stat-center' ref={statCenterRef}>
            <h3>2.4s</h3>
            <p>0-100 km/h</p>
          </div>

          <div className='stat-box stat-right' ref={statRightRef}>
            <h3>850hp</h3>
            <p>Power</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App