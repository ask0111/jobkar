import { Carousel } from "antd";

const ImageCarousel = () => {
  const images = [
    "/assets/login1.svg",
    "/assets/login2.svg",
    "/assets/logIn3.svg",
  ];
  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <Carousel autoplay autoplaySpeed={3000} dots={true} effect="scrollx">
        {images.map((src, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px", // Set a fixed height for the carousel container
              overflow: "hidden",
            }}
          >
            <img
              src={src}
              alt={`Slide ${index + 1}`}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "cover", // Ensures the image covers the area proportionally
              }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
