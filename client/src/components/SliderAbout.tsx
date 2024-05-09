import React, { useContext, useRef, useEffect, useState } from 'react'

import { SliderImage1, SliderImage2, SliderImage3,SliderImage4 } from '../utils/Images'
import '../css/SlideAbout.scss';


const SliderAbout = () => {

    const [ imageIndex, setImageIndex ] = useState(0);
    const Images = [
        SliderImage1,
        SliderImage2,
        SliderImage3,
        SliderImage4
    ];
    const imageSliderRef = useRef<HTMLImageElement | null>(null);
    const controlContainerRef = useRef<HTMLDivElement | null>(null);
    const buttonSlider = useRef<HTMLButtonElement | null>(null);
  


    function handleChangeImage() {
        if (imageIndex + 1 < 4) {
          setImageIndex(imageIndex + 1);
    
          if (imageSliderRef.current) {
            imageSliderRef.current.src = Images[imageIndex];
          }
    
          removeAllActiveDot();
    
          const controlContainerChildren = controlContainerRef.current?.children;
          if (controlContainerChildren) {
            [...controlContainerChildren][imageIndex + 1]?.classList.add('active-slider');
          }
        } else {
          setImageIndex(0);
    
          if (imageSliderRef.current) {
            imageSliderRef.current.src = Images[imageIndex];
          }
    
          removeAllActiveDot();
    
          const controlContainerChildren = controlContainerRef.current?.children;
          if (controlContainerChildren) {
            [...controlContainerChildren][0]?.classList.add('active-slider');
          }
        }
      }
    
      function removeAllActiveDot() {
        const controlContainerChildren = controlContainerRef.current?.children;
        if (controlContainerChildren) {
          [...controlContainerChildren].forEach((cur) => {
            cur.classList.remove('active-slider');
          });
        }
      }
    
      function handleChangeImgaeById(id: number) {
        setImageIndex(id);
    
        if (imageSliderRef.current) {
          imageSliderRef.current.src = Images[id];
        }
      }
    
      function handleChangeButtonState() {
        handleChangeImage();
      }
    
      useEffect(() => {
        const buttonSliderCurrent = buttonSlider.current;
        const controlContainerChildren = controlContainerRef.current?.children;
    
        if (buttonSliderCurrent) {
          buttonSliderCurrent.addEventListener('click', handleChangeButtonState);
        }
    
        if (controlContainerChildren) {
          Array.from(controlContainerChildren).forEach((cur) => {
            cur.addEventListener('click', () => {
              const id = Number(cur.getAttribute('data-slider-index')) - 1;
              handleChangeImgaeById(id);
              removeAllActiveDot();
              cur.classList.add('active-slider');
            });
          });
        }
    
        return () => {
          if (buttonSliderCurrent) {
            buttonSliderCurrent.removeEventListener('click', handleChangeButtonState);
          }
    
          if (controlContainerChildren) {
            Array.from(controlContainerChildren).forEach((cur) => {
              cur.removeEventListener('click', () => {
                const id = Number(cur.getAttribute('data-slider-index')) - 1;
                removeAllActiveDot();
                cur.classList.add('active-slider');
              });
            });
          }
        };
      }, [buttonSlider, controlContainerRef]);
    

    return (
        <div className="container-slide">
        
            <div className="image-slider">
                
                <div className="view-slider view-slider-1">
                    <img src={SliderImage1} alt=""/>
                </div>
                <div className="view-slider view-slider-2">
                    <img src={SliderImage2} alt=""/>
                </div>
                <div className="view-slider view-slider-3">
                    <img src={SliderImage3} alt="" ref={imageSliderRef}/>
                </div>

                <div className="control-container" ref={controlContainerRef}>
                    <span className="slider-1 active-slider" data-slider-index="1"></span>
                    <span className="slider-2" data-slider-index="2"></span>
                    <span className="slider-3" data-slider-index="3"></span>
                    <span className="slider-4" data-slider-index="4"></span>
                </div>
            </div>
            <span 
                ref={buttonSlider}
                className="slider-next-btn">
                <i className='bx bx-right-arrow'></i>
            </span>
        </div>
    )
}

export default SliderAbout