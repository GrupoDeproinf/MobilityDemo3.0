import React, { useEffect, useState } from "react";
import "./Carousel.scss";


const Carousel = () => {
  return (
    <div
      id="carouselExampleCaptions"
      className="carousel slide CarouselWi"
      data-bs-ride="carousel"
    >
      <div className="IconMobility">
        {/* <div className="aJa">
                    <img className="ImgIco" src="/logo512.png" />
                    <img className="brandi " src="assets/images/logos/Branding.png" />
                </div> */}
      </div>
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>
      <div className="carousel-inner ">
        <div className="carousel-item active">
          <img src='/imageness/imgcarousel.jpg' className="item" alt="..." />
          <div className="carousel-caption d-none d-md-block">
            <div variant="h2" className=" subTituloCarousel justify-center">
              Descubre aquí el
              <br /> trabajo de tus sueños{" "}
            </div>
            <div variant="h5" className=" subTituloCarousel2 justify-center">
              Explora todos los puestos de trabajo más emocionantes
              <br />
              en función de su interés y especialidad de estudio.{" "}
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <img src='/imageness/imgcarousel.jpg' className="item" alt="..." />
          <div className="carousel-caption d-none d-md-block">
            <div variant="h2" className=" subTituloCarousel justify-center">
              Descubre aquí el
              <br /> trabajo de tus sueños{" "}
            </div>
            <div variant="h5" className=" subTituloCarousel2 justify-center">
              Explora todos los puestos de trabajo más emocionantes
              <br />
              en función de su interés y especialidad de estudio.{" "}
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <img src='/imageness/imgcarousel.jpg' className="item" alt="..." />
          <div className="carousel-caption d-none d-md-block">
            <div className=" subTituloCarousel justify-center">
              Descubre aquí el
              <br /> trabajo de tus sueños{" "}
            </div>
            <div className=" subTituloCarousel2 justify-center">
              Explora todos los puestos de trabajo más emocionantes
              <br />
              en función de su interés y especialidad de estudio.{" "}
            </div>
          </div>
        </div>
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};
export default Carousel;
