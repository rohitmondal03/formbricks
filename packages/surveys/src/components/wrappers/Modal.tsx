import { cn } from "@/lib/utils";
import { TPlacement } from "@formbricks/types/common";
import { VNode } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";

interface ModalProps {
  children: VNode;
  isOpen: boolean;
  placement: TPlacement;
  clickOutside: boolean;
  darkOverlay: boolean;
  highlightBorderColor: string | null;
  onClose: () => void;
}

export default function Modal({
  children,
  isOpen,
  placement,
  clickOutside,
  darkOverlay,
  highlightBorderColor,
  onClose,
}: ModalProps) {
  const [show, setShow] = useState(false);
  const isCenter = placement === "center";
  const modalRef = useRef(null);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (!isCenter) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        clickOutside &&
        show &&
        modalRef.current &&
        !(modalRef.current as HTMLElement).contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, clickOutside, onClose, isCenter]);

  // This classes will be applied only when screen size is greater than sm, hence sm is common prefix for all
  const getPlacementStyle = (placement: TPlacement) => {
    switch (placement) {
      case "bottomRight":
        return "sm:bottom-3 sm:right-3";
      case "topRight":
        return "sm:top-3 sm:right-3 sm:bottom-3";
      case "topLeft":
        return "sm:top-3 sm:left-3 sm:bottom-3";
      case "bottomLeft":
        return "sm:bottom-3 sm:left-3";
      case "center":
        return "sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2";
      default:
        return "sm:bottom-3 sm:right-3";
    }
  };

  const highlightBorderColorStyle = useMemo(() => {
    if (!highlightBorderColor) return {};

    return {
      borderRadius: "8px",
      border: "2px solid",
      overflow: "hidden",
      borderColor: highlightBorderColor,
    };
  }, [highlightBorderColor]);

  if (!show) return null;

  return (
    <div
      aria-live="assertive"
      className={cn(
        isCenter ? "pointer-events-auto" : "pointer-events-none",
        "z-999999 fixed inset-0 flex items-end"
      )}>
      <div
        className={cn(
          "relative h-full w-full",
          isCenter
            ? darkOverlay
              ? "bg-gray-700/80"
              : "bg-white/50"
            : "bg-none transition-all duration-500 ease-in-out"
        )}>
        <div
          ref={modalRef}
          className={cn(
            getPlacementStyle(placement),
            show ? "opacity-100" : "opacity-0",
            "pointer-events-auto absolute bottom-0 h-fit w-full overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-500 ease-in-out sm:m-4 sm:max-w-sm"
          )}>
          {!isCenter && (
            <div class="absolute right-0 top-0 block pr-[1.4rem] pt-2">
              <button
                type="button"
                onClick={onClose}
                class="text-close-button hover:text-close-button-focus focus:ring-close-button-focus relative rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2">
                <span class="sr-only">Close</span>
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div style={highlightBorderColorStyle}>{children}</div>
        </div>
      </div>
    </div>
  );
}
