/* eslint-disable no-undef */
import { useState } from "react";

import { pintura } from "@pqina/pintura/pintura.module.css";

// react-pintura
import {
  PinturaEditor,
  PinturaEditorModal,
  PinturaEditorOverlay,
} from "@pqina/react-pintura";

// pintura
import {
  // editor
  locale_en_gb,
  createDefaultImageReader,
  createDefaultImageWriter,
  createDefaultShapePreprocessor,

  // plugins
  setPlugins,
  plugin_crop,
  plugin_crop_locale_en_gb,
  plugin_finetune,
  plugin_finetune_locale_en_gb,
  plugin_finetune_defaults,
  plugin_filter,
  plugin_filter_locale_en_gb,
  plugin_filter_defaults,
  plugin_annotate,
  plugin_annotate_locale_en_gb,
  markup_editor_defaults,
  markup_editor_locale_en_gb,
} from "@pqina/pintura";
import { getImage } from "../services/getApi";

setPlugins(plugin_crop, plugin_finetune, plugin_filter, plugin_annotate);

const editorDefaults = {
  imageReader: createDefaultImageReader(),
  imageWriter: createDefaultImageWriter(),
  shapePreprocessor: createDefaultShapePreprocessor(),
  ...plugin_finetune_defaults,
  ...plugin_filter_defaults,
  ...markup_editor_defaults,
  locale: {
    ...locale_en_gb,
    ...plugin_crop_locale_en_gb,
    ...plugin_finetune_locale_en_gb,
    ...plugin_filter_locale_en_gb,
    ...plugin_annotate_locale_en_gb,
    ...markup_editor_locale_en_gb,
  },
};

export default function Home() {
  // pexels
  const [query, setQuery] = useState();
  const [photo, setPhoto] = useState();

  // inline
  const [inlineResult, setInlineResult] = useState("");

  // modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalResult, setModalResult] = useState("");

  // overlay
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [overlayResult, setOverlayResult] = useState({
    imagePreview: photo || "./image.jpeg",
    imageState: undefined,
  });

  async function validateImage(e) {
    e.preventDefault();
    console.log("overlayResult", overlayResult);

    await getImage(query)
      .then((res) => {
        const data = res;
        console.log(data);

        const photo_ = data?.photos[0]?.src?.original;
        setPhoto(photo_);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });
  }

  return (
    <div className="App">
      <h1>Pintura Image Editor</h1>

      <h2>Inline</h2>

      <form onSubmit={validateImage}>
        <input onChange={(e) => setQuery(e.target.value)} />
        <button type="submit">Buscar</button>
      </form>

      <div style={{ height: "70vh" }}>
        <PinturaEditor
          {...editorDefaults}
          className={pintura}
          src={photo || "./image.jpeg"}
          onLoad={(res) => {
            console.log("load inline image", res);
          }}
          onProcess={({ dest }) => {
            setInlineResult(URL.createObjectURL(dest));
          }}
        />
      </div>

      {!!inlineResult.length && (
        <p>
          <img src={inlineResult} alt="" />
        </p>
      )}

      <h2>Modal</h2>

      <p>
        <button onClick={() => setModalVisible(true)}>Open editor</button>
      </p>
      {modalVisible && (
        <PinturaEditorModal
          {...editorDefaults}
          className={pintura}
          src={photo || "./image.jpeg"}
          onLoad={(res) => console.log("load modal image", res)}
          onHide={() => setModalVisible(false)}
          onProcess={({ dest }) => setModalResult(URL.createObjectURL(dest))}
        />
      )}
      {!!modalResult.length && (
        <p>
          <img src={modalResult} alt="" />
        </p>
      )}

      <h2>Overlay</h2>

      <p>
        {!overlayVisible && (
          <button onClick={() => setOverlayVisible(true)}>Edit image</button>
        )}
        {overlayVisible && (
          <button onClick={() => setOverlayVisible(false)}>Close editor</button>
        )}
      </p>

      {!overlayVisible && (
        <p>
          <img
            width="50px"
            height="256"
            src={overlayResult.imagePreview}
            alt=""
          />
        </p>
      )}
      {overlayVisible && (
        <div style={{ width: "512px", height: "256px" }}>
          <PinturaEditorOverlay
            src={photo || "./image.jpeg"}
            {...editorDefaults}
            className={pintura}
            imageState={overlayResult.imageState}
            onLoad={(res) => console.log("load overlay image", res)}
            onProcess={({ dest, imageState }) => {
              setOverlayResult({
                imagePreview: URL.createObjectURL(dest),
                imageState: imageState,
              });
              setOverlayVisible(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
