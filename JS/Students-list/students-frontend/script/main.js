(() => {
  const form = document.querySelector('.form');
  const openFormBtn = document.querySelector('.add-student__open-form-btn');
  const newSurname1 = document.querySelector('.surname1-new-student');
  const newName = document.querySelector('.name-new-student');
  const newSurname2 = document.querySelector('.surname2-new-student');
  const newFaculty = document.querySelector('.faculty-new-student');
  const newDateOfBirth = document.querySelector('.date-of-birth');
  const newStartDate = document.querySelector('.start-date');
  const table = document.querySelector('.table');
  const tableBody = document.querySelector('.table__body')
  const filterBtn = document.querySelector('.filter__btn');
  const removeBtn = document.querySelector('.delete-student-btn');



  // Валидатор символов
  function checkValid(element) {
    return /^[а-яА-Яa-zA-Z0-9-]+$/.test(element)
  };

  // ------------------------Валидация формы----------------------------
  function validation() {

    let result = true;

    // Удаляем все error
    function removeError(input) {
      const parent = input.parentNode;
      const labelError = parent.querySelector('.error-label');
      if (input.classList.contains('error')) {
        input.classList.remove('error');
        labelError.remove();
      }
    }

    // Создаем error
    function createErrorLabel(input) {

      const parent = input.parentNode;
      const errorLabel = document.createElement('label');
      const typeInput = (input.getAttribute("type"));
      errorLabel.classList.add('error-label');

      function addError() {
        parent.append(errorLabel);
        input.classList.add('error');
        result = false;
      }

      if (typeInput == 'text') {
        if (input.value == '') {
          errorLabel.textContent = 'Заполните поле';
          addError();
        } else if (input.value.length < 3) {
          errorLabel.textContent = 'Минимальное количество символов 3';
          addError();
        }
        else if (input.value.length <= 10) {
          if (checkValid(input.value) == false) {
            errorLabel.textContent = 'Введены не допустимые символы';
            addError();
          }
        } else if (input.value.length > 15) {
          errorLabel.textContent = 'Максимальное количество символов 15';
          addError();
        }
      }

      if (typeInput == 'date') {
        if (new Date(input.value) > new Date()) {
          errorLabel.textContent = 'Дата не может быть выше текущей даты';
          console.log(input.value)
          addError();
        }
        if (input.value == '') {
          errorLabel.textContent = 'Выберите дату';
          addError();
        } else if (input.classList.contains('date-of-birth')) {
          if (new Date(input.value).getFullYear() < 1900) {
            errorLabel.textContent = 'Дата не может быть меньше 01.01.1900';
            addError();
          }
        } else if (input.classList.contains('start-date')) {
          if (new Date(input.value).getFullYear() < 2000) {
            errorLabel.textContent = 'Год не может быть меньше 2000';
            addError();
          }
        }
      }
    };

    // Перебираем все инпуты и применяем validator
    document.querySelectorAll('.form__input').forEach(input => {
      removeError(input);
      createErrorLabel(input);
    })
    return result
  };

  // Открытие окна добавления студента
  function openWindowAddStudent() {
    form.classList.toggle('add-student__form-opacity');
  };

  // Отчистка формы добавления студента
  function cleaningForm() {
    document.querySelectorAll('.form__input').forEach((i) => {
      i.value = '';
    })
  };

  // ------------------------Добавление студента----------------------------
  function createNewStudent() {
    let surname1 = newSurname1.value;
    let name = newName.value;
    let surname2 = newSurname2.value;
    let faculty;
    let dateOfBirth = newDateOfBirth.value;
    let startDate = new Date(newStartDate.value);
    let arrFullName = [surname1, name, surname2];
    let arr2FullName = [];

    // Обрабатываем ФИО
    for (let i of arrFullName) {
      let a = i.split(' ').join('-');
      let name = String(a).toLowerCase().trim();
      let finishedName = (name[0].toUpperCase() + name.substring(1));
      arr2FullName.push(finishedName);
    }
    let fullName = (String(arr2FullName).split(',').join(' '));

    // Обрабатываем название факультета
    faculty = newFaculty.value;
    faculty = String(faculty).split(' ').join('-').toLowerCase().trim();
    faculty = (faculty[0].toUpperCase() + faculty.substring(1));

    // Вычисляем возраст и дату рождения
    let age = () => {
      let years = new Date().getTime() - Date.parse(dateOfBirth);
      years = Math.floor(years / 1000 / 60 / 60 / 24 / 365);
      return { years };
    };

    let dateOfBirth2 = new Date(dateOfBirth).toLocaleDateString();

    // Вычисляем годы обучения и курс
    let yearsEducation = () => {
      let checkMonth = startDate.getMonth() + 1;
      let startYear = startDate.getFullYear();
      let endYear = startYear + 4;
      let well = new Date().getFullYear() - startYear + 1;
      let result;
      if (checkMonth >= 9 && well >= 4) {
        result = `${startYear} - ${endYear} (Закончил)`;
      } else {
        result = `${startYear} - ${endYear} (${well} курс)`;
      };

      return { result };
    };

    // Добавляем нового студента в таблицу
    let students = {};
    students.fullName = fullName;
    students.faculty = faculty;
    students.dateOfBirth = `${dateOfBirth2} (Возраст: ${age().years})`;
    students.startDate = yearsEducation().result;

    let newTr = document.createElement('tr');
    tableBody.append(newTr);

    for (let i in students) {
      let newTh = document.createElement('td');
      newTh.classList.add('table-body__td');
      newTr.append(newTh);
      newTh.textContent = students[i];
    };

    return {
      students,
      dateOfBirth,
      startDate,
      newTr
    };
  };
  // ------------------------------------------------------------------------

  // Сохраняем студента на сервер
  async function saveStudentOnServer(objStudent) {
    let strFullName = objStudent.students.fullName;
    let arrFullName = strFullName.split(' ');
    const response = await fetch('http://localhost:3000/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: arrFullName[0],
        surname: arrFullName[1],
        lastname: arrFullName[2],
        birthday: String(new Date(objStudent.dateOfBirth).toISOString()),
        studyStart: String(new Date(objStudent.startDate).getFullYear()),
        faculty: objStudent.students.faculty,
      })
    });
  }

  // Выгружаем данные из сервера в таблицу
  async function pushDataInTable() {
    const response = (await fetch('http://localhost:3000/api/students'));
    let data = await response.json();
    for (let student of data) {

      // Обрабатываем ФИО
      let fullName = `${student.name} ${student.surname} ${student.lastname}`;

      // Вычисляем возраст и дату рождения
      let dateBirthday = new Date((student.birthday));
      let age = () => {
        let years = new Date().getTime() - Date.parse(dateBirthday);
        years = Math.floor(years / 1000 / 60 / 60 / 24 / 365);
        return { years };
      };
      dateBirthday = `${dateBirthday.toLocaleDateString()} (Возраст: ${age().years})`;

      // Вычисляем годы обучения и курс
      let thisYear = new Date().getFullYear();
      let studyStart = student.studyStart;
      let studyEnd = Number(studyStart) + 4;
      let checkMonth = new Date().getMonth() + 1;
      let well = thisYear - studyStart + 1;
      let yearsEducation
      if (checkMonth >= 9 && well > 4) {
        yearsEducation = `${studyStart} - ${studyEnd} (Закончил)`;
      } else {
        yearsEducation = `${studyStart} - ${studyEnd} (${well} курс)`;
      }

      // Массив с готовыми данными для заноса в таблицу
      let arrStudent = [];
      arrStudent.push(fullName, student.faculty, dateBirthday, yearsEducation)

      // Добавляем готовые данные в таблицу
      let newTr = document.createElement('tr');
      newTr.id = student.id;
      tableBody.append(newTr);

      for (let el in arrStudent) {
        let newTh = document.createElement('td');
        newTh.classList.add('table-body__td');
        newTr.append(newTh);
        newTh.textContent = arrStudent[el];
      }
    }
  }


  // Сортировка таблицы
  function sortTable(indexCell, type) {
    let rowsArray = Array.from(tableBody.rows);
    let compare;
    switch (type) {
      case 'string':
        compare = (rowA, rowB) => {
          return rowA.cells[indexCell].innerHTML > rowB.cells[indexCell].innerHTML ? 1 : -1
        }
        break;
      case 'dateOfBirth':
        compare = (rowA, rowB) => {
          let str1 = rowA.cells[indexCell].innerHTML;
          let str2 = rowB.cells[indexCell].innerHTML;
          str1 = new Date(str1.substr(0, 11)).getTime();
          str2 = new Date(str2.substr(0, 11)).getTime();
          return str1 - str2
        }
        break;
      case 'dateEducation':
        compare = (rowA, rowB) => {
          let str1 = rowA.cells[indexCell].innerHTML;
          let str2 = rowB.cells[indexCell].innerHTML;
          str1 = Number(str1.substr(0, 5));
          str2 = Number(str2.substr(0, 5));
          return str2 - str1
        }
        break;
    }
    rowsArray.sort(compare);
    tableBody.append(...rowsArray);
  }

  // ------------------------Фильтра быстрого поиска по таблице----------------------------
  function tableSearch() {
    let objSearch = {};
    let allRows = table.getElementsByTagName('tr');
    let allInputFilter = document.querySelector('.filter').getElementsByTagName('input');
    // Создаем обьект со всеми найдеными значениями в таблице
    for (let i = 0; i < allInputFilter.length; i++) {
      if (allInputFilter[i].value.length > 0) {
        let cellNum;
        let type;
        let inputType = allInputFilter[i].dataset.type;
        let filter = allInputFilter[i].value.toUpperCase();
        let dateOfBirth = new Date(allInputFilter[i].value);
        switch (inputType) {
          case 'name':
            cellNum = 0;
            type = 'name';
            break;
          case 'faculty':
            cellNum = 1;
            type = 'faculty';
            break;
          case 'start-date':
            cellNum = 2;
            type = 'dateOfBirth';
            break;
          case 'end-date':
            cellNum = 3;
            type = 'endDate';
            break;
        }
        for (let i = 1; i < allRows.length; i++) {
          td = allRows[i].getElementsByTagName('td')[cellNum];
          if (td) {
            if (type === 'name' || type === 'faculty') {
              let txtValue = td.textContent;
              if (txtValue.toUpperCase().indexOf(filter) > -1) {
                objSearch[type] = txtValue;
              }
            } else if (type === 'dateOfBirth') {
              let txtValue = td.textContent;
              txtValue = new Date(txtValue.substr(0, 11)).toLocaleDateString();
              txtValue = new Date(txtValue)
              txtValue = `${txtValue.getDate()}.${txtValue.getMonth() + 1}.${txtValue.getFullYear()}`;
              let filterDate = `${dateOfBirth.getDate()}.${dateOfBirth.getMonth() + 1}.${dateOfBirth.getFullYear()}`;
              if (txtValue === filterDate) {
                objSearch[type] = txtValue;
              }
            } else if (type === 'endDate') {
              let txtValue = td.textContent;
              txtValue = txtValue.substr(0, 5).trim();
              let startDate = new Date(filter).getFullYear();
              startDate = String(startDate);
              if (txtValue == startDate) {
                objSearch[type] = txtValue;
              }
            }
          }
        }
      }
    }
    // Перебираем все строки и ищем ту которая соответствует всем значениям фильтров(сравниваем каждую строку со значениями обьекта)
    for (let i = 1; i < allRows.length; i++) {
      let chekTr = true;
      let row = allRows[i];
      for (let i = 0; i < row.cells.length; i++) {
        switch (i) {
          case 0:
            if (objSearch.name) {
              if (objSearch.name.indexOf(row.cells[i].textContent) === -1) {
                chekTr = false;
                console.log(0)
              }
            }
            break
          case 1:
            if (objSearch.faculty) {
              if (objSearch.faculty.indexOf(row.cells[i].textContent) === -1) {
                chekTr = false;
                console.log(1)
              }
            }
            break
          case 2:
            if (objSearch.dateOfBirth) {
              let tdValueDateOfBirth = row.cells[i].textContent;
              tdValueDateOfBirth = tdValueDateOfBirth.substr(0, 11);
              if (new Date(tdValueDateOfBirth).toLocaleDateString() !== new Date(objSearch.dateOfBirth).toLocaleDateString()) {
                chekTr = false;
                console.log(2)
              }
            }
            break
          case 3:
            if (objSearch.endDate) {
              let tdValuEndDate = row.cells[i].textContent;
              tdValuEndDate = tdValuEndDate.substr(0, 5).trim();
              if (new Date(tdValuEndDate).toLocaleDateString() !== new Date(objSearch.endDate).toLocaleDateString()) {
                chekTr = false;
                console.log(3)
              }
            }
            break
        }
      }
      if (chekTr === true && Object.keys(objSearch).length > 0) {
        row.setAttribute('style', "background-color: #4e8af2; color: white; font-size: 20px; transition: background-color .2s linear;");
      } else {
        row.setAttribute('style', "background-color: ''; color: ''; font-size: 16px");
      }
    }
  }

  // Выбор строки в таблице
  let eventTr = (event) => {
    tableBody.querySelectorAll('tr').forEach((tr) => {
      if (tr.classList.contains('table-body__select') == true) {
        tr.classList.remove('table-body__select');
      }
    })

    if (event.target.tagName != 'TD') return
    let tr = event.target.parentNode;
    tr.classList.add('table-body__select');
    return tr
  }

  // Удаление студента из таблицы и сервера
  async function removeStudent() {
    let selectLine = tableBody.querySelector('.table-body__select');
    if (!selectLine) return
    let selectLineId = selectLine.id;
    selectLine.remove();
    const response = fetch(`http://localhost:3000/api/students/${selectLineId}`, {
      method: 'DELETE',
    })

  }

  // Добавление id новому студенту
  async function addIDNewStudent(objStudent) {
    const response = (await fetch('http://localhost:3000/api/students'));
    let data = await response.json();
    let id = data.at(-1).id;
    objStudent.newTr.id = id;
  }


  document.addEventListener('DOMContentLoaded', () => {
console.log(1)
    pushDataInTable();

    // Открываем окно добавления студентов
    openFormBtn.addEventListener('click', openWindowAddStudent);

    form.addEventListener('submit', (event) => {

      event.preventDefault();

      validation();

      if (validation() == true) {
        let objStudent = createNewStudent();
        saveStudentOnServer(objStudent);
        addIDNewStudent(objStudent);
        cleaningForm();
      }
    });

    tableBody.addEventListener('click', (event) => {
      eventTr(event);
    })

    table.addEventListener('click', (event) => {
      if (event.target.tagName != 'TH') return
      let th = event.target;
      sortTable(th.cellIndex, th.dataset.type);
    })

    filterBtn.addEventListener('click', tableSearch);

    removeBtn.addEventListener('click', removeStudent)

  });
})();



