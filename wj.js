function beliKereta(el) {
    const namaMotor = el.closest('.card').querySelector('.card-title').innerText;
    hubungiPenjual(namaMotor);
}
function hubungiPenjual(namaMotor) {
    const noHp = "6281362879164";
    const pesan = `Halo Bang, saya lihat di web. Saya tertarik dengan motor ${namaMotor}. Masih ada unitnya?`;
    const linkWA = `https://wa.me/${noHp}?text=${encodeURIComponent(pesan)}`;
    
    window.open(linkWA, '_blank');
}

function hubungiDeveloper() {
    const noHp = "6282181858276";
    const pesan = "Halo Bang, saya mau tanya jasa pembuatan webnya.";
    const linkWA = `https://wa.me/${noHp}?text=${encodeURIComponent(pesan)}`;
    window.open(linkWA, '_blank');
}
const toggle = document.getElementById('modeToggle');
      const body = document.body;
      const judul = document.querySelector('h3');


      function setDark(isDark) {
        const root = document.documentElement;
        if (isDark) {
          body.style.backgroundColor = "#1a0a2e";
          if (judul) judul.style.color = "#fff";
          toggle.checked = true;
          root.style.setProperty('--hover-color', '#ffe430');
          root.style.setProperty('--hover-shadow', '#f52465');

        } else {
          body.style.backgroundColor = "#000";
          if (judul) judul.style.color = "#f52465";
          toggle.checked = false;
          root.style.setProperty('--hover-color', '#0f18');
          root.style.setProperty('--hover-shadow', 'rgba(255, 255, 255, 0.8)');
        }
      }

      const temaTersimpan = localStorage.getItem('modeToggle');

      if (temaTersimpan === 'dark') {
        setDark(true);
      } else {
        setDark(false);
      }
      toggle.addEventListener('change', function () {
        if (this.checked) {
          setDark(true);
          localStorage.setItem('modeToggle', 'dark');
        } else {
          setDark(false);
          localStorage.setItem('modeToggle', 'light');
        }
      });
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});

const hiddenElements = document.querySelectorAll('.card');
hiddenElements.forEach((el) => observer.observe(el));

if (judul) {
    const text = judul.innerText;
    const words = text.split(' ');
    let html = '';
    let charIndex = 0;

    words.forEach((word, index) => {
        html += `<span style="display: inline-block; white-space: nowrap;">`;
        word.split('').forEach(char => {
            html += `<span class="hover-char" style="animation-delay: ${charIndex * 0.05}s">${char}</span>`;
            charIndex++;
        });
        html += `</span>`;
        if (index < words.length - 1) {
            html += `<span style="display: inline-block; width: 0.3em;">&nbsp;</span>`;
            charIndex++;
        }
    });
    judul.innerHTML = html;
}