import Container from "@/components/ui/Container";

function ScpVideo() {
  return (
    // <div className="absolute inset-0 w-full h-full">
    // <div className="scp-video-sticky -top-[45%] sm:-top-[55%] bottom-1/2 h-screen w-full z-30">
    <div className="scp-video-sticky absolute h-screen w-full z-30">
      <Container>
        <div
          className="w-full h-screen pt-[88px] top-0"
          style={{
            transformStyle: "preserve-3d",
            perspective: 200,
          }}
        >
          <video
            muted
            autoPlay
            loop
            controls={false}
            // src="/videos/home-diamond-2.mp4"
            className="scp-video w-[85%] sm:w-[40%] h-full mx-auto object-contain"
            playsInline
            // style={{
            //   transform: "translate3d(0, 27vh, 200px)",
            // }}
          >
            <source
              src="/videos/speed-creativity-precision.webm"
              type="video/webm"
            />
            <source
              src="/videos/speed-creativity-precision.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </Container>
    </div>
    // {/* </div> */}
  );
}

export default ScpVideo;
