/* eslint-disable no-undef */
import { useState } from "react";
// react-pintura
import { pintura } from "@pqina/pintura/pintura.module.css";
import { PinturaEditor } from "@pqina/react-pintura";
import { getEditorDefaults } from '@pqina/pintura';
import { getImage } from "../services/getApi";

const editorDefaults = getEditorDefaults();

export default function Home() {
  // pexels
  const [query, setQuery] = useState();
  const [photo, setPhoto] = useState();
  const [photos, setPhotos] = useState();


  async function validateImage(e) {
    e.preventDefault();

    await getImage(query)
      .then((res) => {
        const data = res;
        // console.log(data);

        const photos_ = data?.photos;
        setPhotos(photos_);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }

  function getPhoto(photo) {
    const photoResult = photo.target.src;
    setPhoto(photoResult);
  }

  function downloadPhoto(photo) {
    const link = document.createElement("a");
    link.href = photo;
    link.download = "photo.jpg";
    link.click();
  }

  // useEffect(() => {
  //   function changeText(text, newText) {
  //     const spans = document?.querySelectorAll("span");
  //     const filteredSpans = Array.from(spans).filter(
  //       (span) => span.textContent.indexOf(text) > -1
  //     );
  //     console.log(filteredSpans);
  //     const span = filteredSpans[0] || [];
  //     span.innerHTML = newText;
  //   }

  //   changeText("Crop", "Cortar");
  //   changeText("Filter", "Filtro");
  //   changeText("Finetune", "Afinar");
  //   changeText("Annotate", "Annotate");
  //   changeText("Rotation", "Rotação");
  //   changeText("Scale", "Escala");
  //   changeText("Rotate left", "Vire à esquerda");
  //   changeText("Flip horizontal", "Virar horizontalmente");
  //   changeText("Brightness", "Brilho");
  //   changeText("Contrast", "Contraste");
  //   changeText("Saturation", "Saturação");
  //   changeText("Exposure", "Exposição");
  //   changeText("Temperature", "Temperatura");
  //   changeText("Clarity", "Claridade");
  //   changeText("Vignette", "Vinheta");

  //   let ignore = false;

  //   if (!ignore)
  //     return () => {
  //       ignore = true;
  //     };
  // }, []);

  return (
    <div className="App">
      <h1>Pintura Image Editor</h1>

      <h2>Inline</h2>

      <form onSubmit={validateImage}>
        <input onChange={(e) => setQuery(e.target.value)} />
        <button type="submit">Buscar</button>
      </form>

      <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {photos?.map((index, idx) => (
          <img
            key={idx}
            src={index.src.original}
            width={"150px"}
            height={"150px"}
            alt={index.alt}
            onClick={getPhoto}
            style={{ cursor: "pointer" }}
          />
        ))}
      </div>

      <div style={{ height: "70vh" }}>
        <PinturaEditor
          {...editorDefaults}
          className={pintura}
          src={photo || "./image.jpeg"}
          resizeSizePresetOptions={[
            [undefined, "Auto"],
            [128, 128],
            [256, 256],
            [512, 256],
            [1024, 1024],
          ]}
          stickers={['🎉', '😄', '👍', '👎', '🍕']}
          onProcess={({ dest }) => {
            downloadPhoto(URL.createObjectURL(dest));
          }}
        />
      </div>
    </div>
  );
}
