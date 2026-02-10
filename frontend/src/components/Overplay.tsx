type Props = {
  onClose?: () => void;
  IndexForZ: number;
  children?: React.ReactNode;
};
function Overplay({ onClose, IndexForZ, children }: Props) {
  const handleOverlayClick = () => {
    if (onClose) onClose();
  };
  return (
    <div
      className="fixed inset-0 flex flex-col gap-10 items-center justify-center text-center bg-black/50"
      style={{ zIndex: IndexForZ }}
      onClick={handleOverlayClick}
    >
      {children}
    </div>
  );
}

export default Overplay;
