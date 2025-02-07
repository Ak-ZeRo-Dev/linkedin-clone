const POST_ID = "";
const Widget = () => {
  return (
    <div className="ml-6 h-[790px] max-h-[790px]">
      <iframe
        src={`https://www.linkedin.com/embed/feed/update/urn:li:share:${POST_ID}`}
        title="Linkedin Clone Widget"
        className="h-full w-fit 2xl:min-w-[400px]"
      ></iframe>
    </div>
  );
};
export default Widget;
