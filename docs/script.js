const urlInput = document.getElementById('url-input');
const qrContainer = document.getElementById('qr-container');
const copyBtn = document.getElementById('copy-btn');
const downloadBtn = document.getElementById('download-btn');
const toast = document.getElementById('toast');

let qrCode = null;
let currentData = '';
let qrCanvas = null;

function generateQR(data) {
  qrContainer.innerHTML = '';

  qrCode = new QRCode(qrContainer, {
    text: data,
    width: 200,
    height: 200,
    colorDark: '#000000',
    colorLight: '#ffffff',
    correctLevel: QRCode.CorrectLevel.M
  });

  // Wait for canvas to be created
  setTimeout(() => {
    qrCanvas = qrContainer.querySelector('canvas');
    if (qrCanvas) {
      copyBtn.disabled = false;
      downloadBtn.disabled = false;
    }
  }, 100);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

urlInput.addEventListener('input', (e) => {
  const value = e.target.value.trim();

  if (!value) {
    qrContainer.innerHTML = `
      <div class="placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h2m10 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
        </svg>
        <p>Enter a URL to generate QR code</p>
      </div>
    `;
    copyBtn.disabled = true;
    downloadBtn.disabled = true;
    currentData = '';
    qrCanvas = null;
    return;
  }

  currentData = value;
  generateQR(value);
});

copyBtn.addEventListener('click', async () => {
  if (!qrCanvas) return;

  try {
    const blob = await new Promise(resolve => qrCanvas.toBlob(resolve, 'image/png'));
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    showToast('Copied to clipboard!');
  } catch (err) {
    // Fallback for browsers that don't support clipboard API with images
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = qrCanvas.width;
    tempCanvas.height = qrCanvas.height;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(qrCanvas, 0, 0);

    tempCanvas.toBlob(async (blob) => {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('Copied to clipboard!');
      } catch (e) {
        showToast('Failed to copy. Try downloading instead.');
      }
    }, 'image/png');
  }
});

downloadBtn.addEventListener('click', () => {
  if (!qrCanvas) return;

  const link = document.createElement('a');
  link.download = 'qrcode.png';
  link.href = qrCanvas.toDataURL('image/png');
  link.click();
  showToast('Downloaded as qrcode.png');
});

// Handle Enter key
urlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    urlInput.blur();
  }
});
