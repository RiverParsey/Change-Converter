const converter = (amountSelector, fromSelector, toSelector, convertBtn, resultElement) => {
  // получаем элементы DOM по указанным селекторам
  const amountEl = document.querySelector(amountSelector); // элемент для ввода суммы
  const fromEl = document.querySelector(fromSelector); // выпадающий список from
  const toEl = document.querySelector(toSelector); // выпадающий список to
  const btn = document.querySelector(convertBtn); // кнопка конвертации
  const result = document.querySelector(resultElement); // элемент для вывода результата

  // fetch запрос к API Frankfurter для получения списка валют
  fetch('https://api.frankfurter.app/currencies')
    .then(res => res.json()) // преобразование ответа в JSON
    .then(data => { // обработка полученных данных
      const entries = Object.entries(data); // преобразование обьекта в массив пар [ключ, значение]

      // перебор кайдой валюты и добавленные ее в выпадающие списки
      entries.forEach(([code, name]) => {

        // создание двух элементов option для обоих выпадающих списков
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');

        // устанавливаем значение кода валюты для обоих элементов option
        option1.value = option2.value = code;
        // устанавливаем текст для отображения кода и названия валюты
        option1.textContent = option2.textContent = `${code} - ${name}`;

        // добавляем элементы option в выпадающие списки
        fromEl.appendChild(option1);
        toEl.appendChild(option2);

      });

      // устанавливаем значение по умолчанию из usd в eur
      fromEl.value = 'USD';
      toEl.value = 'EUR';
    });

    // вешаем обработчик клика на кнопку конвертации
    btn.addEventListener('click', () => {

      // получаем введенную сумму и преобразуем в число
      const amount = parseFloat(amountEl.value);

      // получаем выбранные валюты
      const from = fromEl.value; // исходная валюта
      const to = toEl.value; // целевая валюта

      // проверяем корректность суммы на положительное число
      if (isNaN(amount) || amount <= 0) {
        result.textContent = 'Введите корректную сумму';
        return; // прерываем выполнение
      }

      // проверяем на выбор разных валют
      if (from === to) {
        result.textContent = 'Введите разные валюты';
        return; // прерываем выполнение
      }

      // формируем url для запроса конвертации с указанными параметрами
      const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;

      // отправка запроса на API для конвертации
      fetch(url)
        .then(res => res.json()) // преобразование в JSON
        .then(data => { // обработка данных

          // получаем результат конвертации
          const rate = data.rates[to];

          // выводим результат конвертации
        result.textContent = `${amount} ${from} = ${rate} ${to}`;
        })
        .catch(() => {

          // обрабатываем ошибку при запросе
          result.textContent = 'Ошибка при получении';
        });
    });
}

export default converter;

// получение элементов
// document.querySelector() - ищет и возвращает элемент соответствующий указанному селектору

// работа с API и заполнение выпадающих списков
// fetch() - метод для выполнения http-запросов, возвращает promise который разрешается в обьект response
// .then() - метод promise для добавления функции обратного вызова при успешном выполнении fetch
// res.json() - метод обьекта response преобразует тело ответа из JSON в обьект
// Object.entries() - метод возвращает массив пар [ключ, значение] обьекта с валютами
// forEach() - метод перебора массива
// document.createElement() - метод создания html элемента
// .value - свойство для установки или получения значения
// .textContent - свойство для установки или получения текстового содержимого
// .appendChild() - метод для добавления дочернего элемента

// обработчик клика
// addEventListener() - метод для установки обработчика события
// parseFloat() - метод для преобразования строки в число с плавающей точкой
// isNaN() - функция проверки значения на Not a Number
// template literals - строки в обратных кавычках


// общая логика работы
// 1. получение элементов формы по селекторам
// 2. отправление запроса к API Frankfurter для получения списка валют
// 3. использование полученного списка для заполнения выпадающих списков с установкой значений по умолчанию
// 4. при клике на кнопку конвертации
// проверяется корректность введенной суммы и выбраных валют
// формируется url для запроса конвертации
// отправляется запрос к API для получения курса
// результат отображается на странице
// в случае ошибки выводится сообщение