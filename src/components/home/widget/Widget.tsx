const POST_ID = ["7289021913677357057", "7289016185944174594"];

const Widget = () => {
  return (
    <>
      <div className="ml-6 h-[790px] max-h-[790px]">
        <iframe
          src={`https://www.linkedin.com/embed/feed/update/urn:li:share:${POST_ID[0]}`}
          title="Linkedin Clone Widget"
          className="h-full w-fit 2xl:min-w-[400px]"
        ></iframe>
      </div>
      <div className="ml-6 mt-2 h-[790px] max-h-[790px]">
        <iframe
          src={`https://www.linkedin.com/embed/feed/update/urn:li:share:${POST_ID[1]}`}
          title="Linkedin Clone Widget"
          className="h-full w-fit 2xl:min-w-[400px]"
        ></iframe>
      </div>
    </>
  );
};
export default Widget;
