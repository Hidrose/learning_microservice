import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Download from "yet-another-react-lightbox/plugins/download";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

type Props = {
  image: string;
  open: boolean;
  onClose: () => void;
};

function ImageViewer({ image, open, onClose }: Props) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      slides={[{ src: image }]}
      render={{
        buttonPrev: () => null,
        buttonNext: () => null,
      }}
      plugins={[Download, Zoom]}
    />
  );
}

export default ImageViewer;
