const fileInput = document.getElementById('fileInput');
const dropArea  = document.getElementById('dropArea');

const btnUploadTop = document.getElementById('btnUploadTop');
const btnUpload    = document.getElementById('btnUpload');

let uploading = false;

/* CLICK HANDLER */
$('#btnUploadTop,#btnUpload,#dropArea').on('click', () => {
  if (!uploading) fileInput.click();
});

/* FILE SELECT */
fileInput.addEventListener('change', () => {
  if (fileInput.files.length) upload();
});

/* DRAG & DROP */
['dragenter','dragover'].forEach(ev => {
  dropArea.addEventListener(ev, e => {
    e.preventDefault();
    dropArea.classList.add('drag');
  });
});

['dragleave','drop'].forEach(ev => {
  dropArea.addEventListener(ev, e => {
    e.preventDefault();
    dropArea.classList.remove('drag');

    if (ev === 'drop' && e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      upload();
    }
  });
});

/* UPLOAD FUNCTION */
function upload(){
  if (uploading) return;

  const file = fileInput.files[0];
  if (!file) return;

  if (!['video/mp4','video/quicktime'].includes(file.type)) {
    alert('Format video tidak didukung (MP4 / MOV)');
    return;
  }

  if (file.size > 100 * 1024 * 1024) {
    alert('Ukuran maksimal 100MB');
    return;
  }

  uploading = true;

  const bar  = $('#progressBar');
  const wrap = $('#progressWrap');

  wrap.show();
  bar.css('width','0%');

  const fd = new FormData();
  fd.append('file', file);

  $.ajax({
    url: 'https://videy.co/api/upload',
    method: 'POST',
    data: fd,
    processData: false,
    contentType: false,
    xhr: function () {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = e => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          bar.css('width', percent + '%');
        }
      };
      return xhr;
    },
    success: res => {
      if (res && res.id) {
        location.href = '/v/?id=' + res.id;
      } else {
        alert('Upload berhasil tapi response tidak valid');
        reset();
      }
    },
    error: () => {
      alert('Upload gagal, coba lagi');
      reset();
    }
  });
}

/* RESET STATE */
function reset(){
  uploading = false;
  $('#progressWrap').hide();
  $('#progressBar').css('width','0%');
  fileInput.value = '';
}
