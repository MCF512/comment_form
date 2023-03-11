const form = document.forms.commentForm;
const commentField = document.querySelector('.comment__field');
const inputsArr = [form.name, form.comment];
let commentsFromStorage;

fillCommentField();

inputsArr.forEach((item, index) => {
  //Если поле не заполнено
  item.onblur = function () {
    if (item.value == '') {
      item.classList.add('invalid');
      let err = document.querySelector(`.error-${index + 1}`);
      err.innerHTML = 'Поле не должно оставаться пустым'
    }
  }

  //Если начинаем заполнять
  item.oninput = function () {
    item.classList.remove('invalid');
    let err = document.querySelector(`.error-${index + 1}`);
    err.innerHTML = ''
  }
});

form.addEventListener('submit', function (e) {
  //Убираем перезагрузку страницы
  e.preventDefault();
  const comment = {};

  if (form.name.value == '' || form.comment.value == '') {
    alert('Заполните форму')
  } else if (isValideDate(form.date.value)) {
    comment.id = Math.round(Math.random() * 10000),
      comment.name = form.name.value,
      comment.date = isValideDate(form.date.value),
      comment.time = `${new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()}:${new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()}`,
      comment.text = form.comment.value,
      comment.favourite = false
    if (localStorage.comments == null) {
      localStorage.setItem('comments', JSON.stringify([comment]));
      fillCommentField();
    } else {
      commentsFromStorage.push(comment);
      localStorage.setItem('comments', JSON.stringify(commentsFromStorage))
      fillCommentField();
    }
  }
}
);

function addCommentHTML(obj) {
  //Верстка блока комментария
  return `
  <div class="comment__wrapper" id="${obj.id}">
        <div class="comment__first__row">
          <h3 class="comment__name">Комментарий пользователя: ${obj.name}</h3>
          <button class="comment__favourite ${obj.favourite ? "comment__favourite--active" : ''}"><svg width="24px" height="24px"
              viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.8824 12.9557L10.5021 19.3071C11.2981 20.2067 12.7019 20.2067 13.4979 19.3071L19.1176 12.9557C20.7905 11.0649 21.6596 8.6871 20.4027 6.41967C18.9505 3.79992 16.2895 3.26448 13.9771 5.02375C13.182 5.62861 12.5294 6.31934 12.2107 6.67771C12.1 6.80224 11.9 6.80224 11.7893 6.67771C11.4706 6.31934 10.818 5.62861 10.0229 5.02375C7.71053 3.26448 5.04945 3.79992 3.59728 6.41967C2.3404 8.6871 3.20947 11.0649 4.8824 12.9557Z"
                stroke="#323232" stroke-width="2" stroke-linejoin="round" />
            </svg></button>
          <button class="comment__del">
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16"
                stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <p class="comment__date">${isTodayOrYesterday(obj)} ${obj.time}</p>
        <p class="comment__text">${obj.text}</p>
      </div>
  `
}

function isTodayOrYesterday(obj) {
  //Функция для проверки, если комментарий написан сегодня или вчера
  let parts = obj.date.split('/');
  let day = parseFloat(parts[0])
  let month = parseFloat(parts[1])
  let year = Number(parts[2]);

  let time = obj.time.split(':');
  let hours = parseFloat(time[0]);
  let minutes = parseFloat(time[1]);
  let date = new Date(year, month - 1, day, hours, minutes);
  let dateNow = new Date();

  let millisecondsPerDay = 24 * 60 * 60 * 1000;

  if (dateNow.getTime() - date.getTime() < millisecondsPerDay) {
    return 'Сегодня, в '
  } else if ((dateNow.getTime() - date.getTime()) < (millisecondsPerDay * 2)) {
    return 'Вчера, в '
  } else {
    return `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}/${(date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)}/${date.getFullYear()}, в`
  }

}

function fillCommentField() {
  //Выгружаем комментарии в поле для комментариев, если они есть.
  if (localStorage.comments == null) {
    commentField.innerHTML = '<p class="empty__text">Здесь пока пусто...<br>Оставьте первый комментарий!</p>'
  } else {
    commentField.innerHTML = ""
    commentsFromStorage = JSON.parse(localStorage.getItem('comments'));
    commentsFromStorage.forEach(item => {
      commentField.innerHTML += addCommentHTML(item)
    })
  }
  delItem();
  addFav();
}

function delItem() {
  //Функция для добавления кнопкам удаления функционала.
  const delBtns = document.querySelectorAll('.comment__del');
  for (let i = 0; i <= delBtns.length - 1; i++) {
    delBtns[i].addEventListener('click', function () {
      let itemId = delBtns[i].closest('div[class="comment__wrapper"]').id;

      delItem: for (let j = 0; j <= commentsFromStorage.length - 1; j++) {
        if (commentsFromStorage.length == 1) {
          localStorage.removeItem('comments');
          fillCommentField();
        } else if (commentsFromStorage[j].id == itemId) {
          commentsFromStorage.splice(j, 1);
          localStorage.setItem('comments', JSON.stringify(commentsFromStorage))
          fillCommentField();
          break delItem;
        }
      }
    })
  }
}

function addFav() {
  //Функция для добавления комментария в избранное/добавления лайка
  const favBtns = document.querySelectorAll('.comment__favourite');

  favBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      let itemId = btn.closest('div[class="comment__wrapper"]').id;

      for (item of commentsFromStorage) {
        if (itemId == item.id) {
          item.favourite = !item.favourite
        }
      } localStorage.setItem('comments', JSON.stringify(commentsFromStorage))
      fillCommentField();
    })
  })
}

function isValideDate(dateString) {
  //Валидация даты. Если инпут с датой пустой, оставляем текущую дату.
  if (dateString === '') {
    return `${new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()}/${(new Date().getMonth() + 1) < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)}/${new Date().getFullYear()}`
  } else {
    let parts = dateString.split('/');
    let day = parts[0];
    let month = parts[1];
    let year = parts[2];
    let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      alert('Введите дату в формате ДД/ММ/ГГГГ')
    } else if (month < 1 || month > 12) {
      alert('Такого месяца быть не может!');
    } else if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
      monthLength[1] = 29;
    } else if (monthLength[Number(month) - 1] < day) {
      alert('В этом месяце такого дня нет!')
    } else {
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
    }
  }
}
