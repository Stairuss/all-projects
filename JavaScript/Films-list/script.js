const form = document.querySelector('#film-form')
const tbody = document.querySelector('tbody')
const title = document.getElementById("title");
const genre = document.getElementById("genre");
const releaseYear = document.getElementById("releaseYear");
const isWatched = document.getElementById("isWatched");
const filterTitle = document.querySelector('.title')
const filterGenre = document.querySelector('.genre')
const filterReleaseYear = document.querySelector('.releaseYear')
const selectFilters = document.querySelector('.select-filters')
const selectIsWatched = document.querySelector('.select-isWatched')

// Получить данные из формы
function handleFormSubmit() {
  const film = {
    title: title.value,
    genre: genre.value,
    releaseYear: releaseYear.value,
    isWatched: isWatched.checked,
  };

  addFilm(film);
}

// Добавить новый фильм на сервер
async function addFilm(film) {
  await fetch("https://sb-film.skillbox.cc/films", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      email: "pvy.vapsis@mail.ru",
    },
    body: JSON.stringify(film),
  });
  renderTable();
}

// Создать новый фильм в таблице
function createRowTable(film, container) {
  let tr = document.createElement('tr')
  let tdTitle = document.createElement('td')
  let tdGenre = document.createElement('td')
  let tdReleaseYear = document.createElement('td')
  let tdIsWatched = document.createElement('td')
  let tdAction = document.createElement('td')
  let deleteBtn = document.createElement('button')

  tr.id = film.id
  tdTitle.textContent = film.title
  tdGenre.textContent = film.genre
  tdReleaseYear.textContent = film.releaseYear
  tdIsWatched.textContent = film.isWatched === true ? 'Да' : 'Нет'
  deleteBtn.textContent = 'Удалить'

  deleteBtn.classList.add('btn', 'delete-btn')
  deleteBtn.addEventListener('click', deleteFilm)

  container.append(tr)
  tdAction.append(deleteBtn)
  tr.append(tdTitle, tdGenre, tdReleaseYear, tdIsWatched, tdAction)
}

// Получить все фильмы с сервера
async function gitFilms() {
  return fetch("https://sb-film.skillbox.cc/films", {
    headers: {
      email: "pvy.vapsis@mail.ru",
    },
  }).then(res => res.json());
}

//Выгрузка фильмов в таблицу
async function renderTable(filter = false) {
  const films = await gitFilms()

  tbody.innerHTML = "";

  // Выгрузка фильмов через фильтер
  if (filter) {
    let filmssInputsSearching = getFilmsForParam()

    function chekingFilm(keyFilms, inputName) {
      if (filmssInputsSearching[inputName]) {
        if (!Object.is(filmssInputsSearching[inputName], String(films[keyFilms][inputName])) || filmssInputsSearching[inputName].length === 0) {
          return false
        }
      }
      return true
    }
    for (let film in films) {
      switch (selectFilters.value) {
        case 'all':
          if (!chekingFilm(film, 'title')) continue
          if (!chekingFilm(film, 'genre')) continue
          if (!chekingFilm(film, 'releaseYear')) continue
          if (!chekingFilm(film, 'isWatched')) continue
          createRowTable(films[film], tbody)
          break
        case 'title':
          if (!chekingFilm(film, 'title')) continue
          createRowTable(films[film], tbody)
          break
        case 'genre':
          if (!chekingFilm(film, 'genre')) continue
          createRowTable(films[film], tbody)
          break
        case 'releaseYear':
          if (!chekingFilm(film, 'releaseYear')) continue
          createRowTable(films[film], tbody)
          break
        case 'isWatched':
          if (!chekingFilm(film, 'isWatched')) continue
          createRowTable(films[film], tbody)
          break
      }
    }
  }
  // Выгрузка ВСЕХ фильмов в таблицу
  else {
    films.forEach((film) => {
      createRowTable(film, tbody)
    });
  }

}

// Удалить конкретный фильм
async function deleteFilm() {
  let tr = this.closest('tr')
  const responce = await fetch(`https://sb-film.skillbox.cc/films/${tr.id}`, {
    method: 'DELETE',
    headers: {
      email: 'pvy.vapsis@mail.ru'
    }
  })
  const data = await responce.json()
  if (responce.status === 200) {
    console.log(data.message)
    tr.remove()
  }
}

// Удалить все фильмы
async function allDeleteFilms() {
  await fetch(`https://sb-film.skillbox.cc/films/`, {
    method: 'DELETE',
    headers: {
      email: 'pvy.vapsis@mail.ru'
    }
  })
    .then(res => res.json())
    .then(res => {
      tbody.textContent = ''
      alert(res.message)
    })
}

// Сбор данных из полей фильтра
function getFilmsForParam() {
  let film = {}
  if (selectFilters.value == 'all') {
    film.title = filterTitle.value
    film.genre = filterGenre.value
    film.releaseYear = filterReleaseYear.value
    if (selectIsWatched.value != 'Смотрели?') {
      film.isWatched = selectIsWatched.value
    }
  } else if (selectFilters.value == 'title') {
    film.title = filterTitle.value
  } else if (selectFilters.value == 'genre') {
    film.genre = filterGenre.value
  } else if (selectFilters.value == 'releaseYear') {
    film.releaseYear = filterReleaseYear.value
  } else if (selectFilters.value == 'isWatched') {
    if (selectIsWatched.value != 'Смотрели?') {
      film.isWatched = selectIsWatched.value
    }
  }
  return film
}

// Запустить поиск фильма по фильтру
async function runFilter(inputName, timeoutId) {
  inputName.addEventListener('input', () => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(async () => {
      await renderTable(true)
    }, 1000)
  })
}

// Отчистить все поля формы
function clearForm() {
  form.querySelectorAll('input').forEach((input) => {
    if (input.type === 'checkbox') {
      input.checked = false
    } else if (input.type === 'submit') {
      true
    }
    else {
      input.value = ''
    }
  })
}

document.addEventListener('DOMContentLoaded', () => {
  renderTable();
  new Choices(selectFilters, {
    itemSelectText: '',
    searchEnabled: false
  })

  new Choices(selectIsWatched, {
    itemSelectText: '',
    searchEnabled: false
  })

  const validator = new JustValidate(form)
  validator
    .addField('#title', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'Минимум 2 символа',
      },
      {
        rule: 'maxLength',
        value: 15,
        errorMessage: 'Максимум 15 символов',
      },
    ],
      {
        errorsContainer: document.querySelector('.error-title'),
      }
    )
    .addField('#genre', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
      {
        rule: 'minLength',
        value: 2,
        errorMessage: 'Минимум 2 символа',
      },
      {
        rule: 'maxLength',
        value: 15,
        errorMessage: 'Максимум 15 символов',
      },
    ],
      {
        errorsContainer: document.querySelector('.error-genre'),
      }
    )
    .addField('#releaseYear', [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
      {
        rule: 'number',
        errorMessage: 'Некорректный формат года',
      },
      {
        rule: 'minNumber',
        value: 1950,
        errorMessage: 'Год должен быть больше 1950',
      },
      {
        rule: 'maxNumber',
        value: 2025,
        errorMessage: 'Год должен быть меньше 2025',
      },
    ],
      {
        errorsContainer: document.querySelector('.error-releaseYear'),
      }
    )
    .onSuccess(() => {
      handleFormSubmit()
      clearForm()
    })

  let timeoutId
  runFilter(filterTitle, timeoutId)
  runFilter(filterGenre, timeoutId)
  runFilter(filterReleaseYear, timeoutId)
  selectFilters.addEventListener('change', () => {
    filterTitle.value = ''
    filterGenre.value = ''
    filterReleaseYear.value = ''
    renderTable(true)
  })

  selectIsWatched.addEventListener('change', () => {
    renderTable(true)
  })

  document
    .querySelector('.all-delete-btn')
    .addEventListener('click', allDeleteFilms)
})




