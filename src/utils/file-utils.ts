export async function blobToBase64(input: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result as string);
    fileReader.onerror = () => reject();
    fileReader.readAsDataURL(input);
  });
}
