const converter = (amountSelector, fromSelector, toSelector, convertBtn, resultElement) => {
  const amountEl = document.querySelector(amountSelector);
  const fromEl = document.querySelector(fromSelector);
  const toEl = document.querySelector(toSelector);
  const btn = document.querySelector(convertBtn);
  const result = document.querySelector(resultElement);

  fetch('https://api.frankfurter.app/currencies')
    .then(res => res.json())
    .then(data => {
      const entries = Object.entries(data);

      entries.forEach(([code, name]) => {
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');

        option1.value = option2.value = code;
        option1.textContent = option2.textContent = `${code} - ${name}`;

        fromEl.appendChild(option1);
        toEl.appendChild(option2);

      });
      fromEl.value = 'USD';
      toEl.value = 'EUR';
    });

    btn.addEventListener('click', () => {
      const amount = parseFloat(amountEl.value);

      const from = fromEl.value;
      const to = toEl.value;

      if (isNaN(amount) || amount <= 0) {
        result.textContent = 'Введите корректную сумму';
        return;
      }

      if (from === to) {
        result.textContent = 'Введите разные валюты';
        return;
      }

      const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          const rate = data.rates[to];

        result.textContent = `${amount} ${from} = ${rate} ${to}`;
        })
        .catch(() => {
          result.textContent = 'Ошибка при получении';
        });
    });
}

export default converter;