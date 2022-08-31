import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { TextareaProps, Textarea } from "@chakra-ui/react";
import autosize from "autosize";

interface Props extends TextareaProps {}

type Ref = HTMLTextAreaElement | null;

const TextareaAutosize = forwardRef<Ref, Props>((props, ref) => {
  const innerRef = useRef<Ref>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const element = e.currentTarget;
    autosize(element);
  };

  useImperativeHandle(ref, () => innerRef.current as HTMLTextAreaElement);

  useEffect(() => {
    if (innerRef.current) {
      autosize(innerRef.current);

      return () => {
        autosize.destroy(innerRef.current as Element);
      };
    }
  }, []);

  return <Textarea onKeyDown={handleKeyDown} {...props} ref={innerRef} />;
});

TextareaAutosize.displayName = "TextareaAutosize";

export default TextareaAutosize;
