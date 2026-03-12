type Props = {
  source: string;
  alt: string;
  className: string;
  loading: "lazy" | "eager";
};
function Image({ source, alt, className, loading }: Props) {
  return <img src={source} alt={alt} className={className} loading={loading} />;
}

export default Image;
