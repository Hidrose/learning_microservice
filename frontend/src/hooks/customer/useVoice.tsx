import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onInput?: () => void;
  lang?: string;
};

export function useVoice({ inputRef, onInput, lang = "vi-VN" }: Props) {
  const recognitionRef = useRef<any>(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop?.();
        recognitionRef.current = null;
      }
    };
  }, []);

  const startVoice = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Trình duyệt không hỗ trợ voice");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = lang;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      if (inputRef.current) {
        inputRef.current.value = transcript;
        onInput?.();
      }
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognition.start();
    setRecording(true);
  }, [inputRef, onInput, lang]);

  const stopVoice = useCallback(() => {
    recognitionRef.current?.stop();
    setRecording(false);
  }, []);

  return {
    recording,
    startVoice,
    stopVoice,
  };
}
