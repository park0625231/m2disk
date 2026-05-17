// 미투디스크 쿠폰 - shared scripts

function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 1800);
}

function copyCoupon(code, btn) {
  const open = () => window.open('https://me2disk.com/', '_blank', 'noopener');
  const onSuccess = () => {
    showToast('쿠폰 코드가 복사되었습니다. 등록 페이지로 이동합니다.');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '✓ 복사 완료';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 1800);
    }
    open();
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(code).then(onSuccess).catch(() => {
      fallbackCopy(code); onSuccess();
    });
  } else {
    fallbackCopy(code); onSuccess();
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); } catch(e) {}
  document.body.removeChild(ta);
}

// FAQ accordion
document.addEventListener('click', function (e) {
  const q = e.target.closest('.faq-q');
  if (!q) return;
  q.parentElement.classList.toggle('open');
});

// Storage savings calculator (page 1)
function initCalc() {
  const fileSize = document.getElementById('calc-size');
  const fileCount = document.getElementById('calc-count');
  const planSelect = document.getElementById('calc-plan');
  const result = document.getElementById('calc-result');
  const breakdown = document.getElementById('calc-breakdown');
  if (!fileSize || !result) return;

  function calc() {
    const size = parseFloat(fileSize.value) || 0;
    const count = parseInt(fileCount.value) || 0;
    const plan = planSelect.value;
    const totalGB = (size * count) / 1024;
    const planMap = {
      'basic': { gb: 10, won: 5500 },
      'standard': { gb: 50, won: 11000 },
      'premium': { gb: 200, won: 22000 }
    };
    const p = planMap[plan];
    const requiredPlans = Math.ceil(totalGB / p.gb) || 1;
    const cost = requiredPlans * p.won;
    const couponSaving = Math.min(cost, 5500 * 3); // 3 coupons * 5,500won
    const finalCost = Math.max(cost - couponSaving, 0);

    result.querySelector('.num').textContent = finalCost.toLocaleString() + '원';
    breakdown.innerHTML =
      '· 총 데이터: <b>' + totalGB.toFixed(2) + ' GB</b><br>' +
      '· 필요 요금제: <b>' + requiredPlans + '개월 × ' + p.won.toLocaleString() + '원 = ' + cost.toLocaleString() + '원</b><br>' +
      '· 쿠폰 절감액: <b style="color:#10b981">- ' + couponSaving.toLocaleString() + '원</b>';
  }
  [fileSize, fileCount, planSelect].forEach(el => el.addEventListener('input', calc));
  calc();
}

// Daily savings calculator (page 2)
function initFreeCalc() {
  const days = document.getElementById('fc-days');
  const perDay = document.getElementById('fc-perday');
  const result = document.getElementById('fc-result');
  const breakdown = document.getElementById('fc-breakdown');
  if (!days || !result) return;

  function calc() {
    const d = parseInt(days.value) || 0;
    const p = parseInt(perDay.value) || 0;
    const totalCoupons = d * p;
    const wonPerCoupon = 5500;
    const saved = totalCoupons * wonPerCoupon;
    const gbGained = totalCoupons * 10;
    result.querySelector('.num').textContent = saved.toLocaleString() + '원';
    breakdown.innerHTML =
      '· 누적 쿠폰 수: <b>' + totalCoupons + '개</b><br>' +
      '· 환산 저장 용량: <b>' + gbGained.toLocaleString() + ' GB</b><br>' +
      '· 일평균 절약: <b>' + Math.round(saved / Math.max(d,1)).toLocaleString() + '원/일</b>';
  }
  [days, perDay].forEach(el => el.addEventListener('input', calc));
  calc();
}

document.addEventListener('DOMContentLoaded', function () {
  initCalc();
  initFreeCalc();
});
