import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "./ui/button";
import { LucideIcon, Printer } from "lucide-react";
import { pageStyle } from "@/utils/pageStyle";


interface PrintProps {
  children: React.ReactNode;
  documentTitle?: string;
  iconButton?: () => JSX.Element;
  sizeButton?: "default" | "sm" | "lg" | "icon" | null | undefined;
  textButton: string;
  onAfterPrint?: () => void;
  varianteButton?:
    | "link"
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined;
    pageOrientation?: string;
}

export default function PrintDocComponent({
  children,
  documentTitle,
  sizeButton = "sm",
  textButton,
  iconButton,
  onAfterPrint,
  varianteButton='outline',
  pageOrientation=pageStyle
}: PrintProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const print = useReactToPrint({
    pageStyle: pageOrientation,
    content: () => ref.current,
    onBeforeGetContent: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    },
    documentTitle: documentTitle ?? "Documento",
    onAfterPrint: onAfterPrint,
  });

  return (
    <>
      <Button size={sizeButton} variant={varianteButton} onClick={print}>
        {iconButton ? iconButton() : <Printer />}
        {textButton}
      </Button>

      <div style={{ display: "none" }}>
        <div ref={ref}>{children}</div>
      </div>
    </>
  );
}
