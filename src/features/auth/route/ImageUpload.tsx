import React, { useState } from "react";
import { toast } from "react-toastify";
import { authenticationStep } from "../type";
import { useAuth } from "@/lib/auth";
import { useUploadImage } from "@/features/user/api/uploadImage";
import { Button } from "@/components/Elements";
import Compressor from 'compressorjs';

type ImageUploadProps = {
  setAuthenticationStep: (e: authenticationStep) => void;
};

export const ImageUpload = ({ setAuthenticationStep }: ImageUploadProps) => {
  const { currentUser } = useAuth();
  const { uploadImageFn } = useUploadImage();
  const [imageData, setImage] = useState({
    imageName: "",
    imageUrl: {} as File | Blob,
  });
  const [imageUploaded, setImageUploaded] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function upload() {
    const currentImage = { ...imageData };
    const imageInput = document.querySelector<HTMLInputElement>(
      ".image-upload__input"
    );
    imageInput?.click();
    if (imageInput) {
      imageInput.onchange = function (e) {
        const input = e.target as HTMLInputElement;
        if (input.files && Object.keys(input.files).length > 0) {
          const file = input.files[0];
          new Compressor(file, {
              quality: 0.6,
              success(result) {
                const imageName = input?.value.split("\\")[input.value.split("\\").length - 1];
                currentImage.imageName = imageName;
                currentImage.imageUrl = result;
                setImage(currentImage);
                setImageUploaded(true);
              }
          })
          
        }
      };
    }
  }

  function submitImage() {
    if (!imageUploaded) {
      toast.error("You must upload an image");
      return;
    }
    setSubmitting(true);
    const userId = currentUser.uid;
    const file = imageData.imageUrl;
    uploadImageFn({ file, userId })
      .then(() => {
        setSubmitting(false);
        setAuthenticationStep("userInfo");
      })
      .catch((e) => {
        setSubmitting(false);
      });
  }

  return (
    <div className="register image-upload">
      <input type="file" accept="image/*" className="image-upload__input" />
      {!imageUploaded ? (
        <React.Fragment>
          <button className="button button--wide" onClick={upload}>
            Upload Profile Image
          </button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="image-upload__avatar">
            <img alt="profile" src={URL.createObjectURL(imageData.imageUrl)} />
          </div>
          <div className="image-upload__buttons">
            <Button
              type="submit"
              size="lg"
              variant="inverse"
              onClick={upload}
            >
              Edit
            </Button>
            <Button
              type="submit"
              size="lg"
              variant="primary"
              onClick={submitImage}
              isLoading={submitting}
              disabled={submitting}
            >
              Submit
            </Button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};


