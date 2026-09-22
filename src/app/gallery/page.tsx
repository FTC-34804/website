import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { UploadDialog } from "./UploadDialog";
import { GalleryView } from "./GalleryView";

export default function Gallery() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-between p-4 font-mono">
      <section>
        <Header page="gallery"/>

        <div className="m-2">
          <h1 className="text-2xl font-bold">gallery</h1>
        </div>

        <GalleryView/>

        <UploadDialog/>
      </section>

      <section>
        <Footer/>
      </section>
    </div>
  );
}
