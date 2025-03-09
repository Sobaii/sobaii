import html2canvas from "html2canvas";

const convertHTMLElementToImage = async (
  element: HTMLElement
): Promise<Blob | null> => {
  if (element) {
    try {
      // Capture the screenshot
      const canvas = await html2canvas(element);

      // Convert the canvas to a Blob
      const blob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((blob) => resolve(blob!), 'image/png')
      );

      return blob;
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      return null;
    }
  }
  return null;
};

export default convertHTMLElementToImage;
