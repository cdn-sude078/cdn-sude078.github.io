const video = document.getElementById('video');

const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if(!id){
  alert('Video tidak ditemukan');
  throw new Error('No ID');
}

const base = "https://cdn.videy.co/" + id;

video.src = base + ".mp4";

video.onerror = () => {
  if (!video.dataset.alt) {
    video.dataset.alt = 1;
    video.src = base + ".mov";
  }
};
