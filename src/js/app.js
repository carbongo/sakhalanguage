import $$ from 'dom7';
import Framework7 from 'framework7/framework7.esm.bundle.js';
import localForage from 'localforage/dist/localforage.js';

// Import F7 Styles
import 'framework7/css/framework7.bundle.css';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';
import '../css/images.css';

// Import Cordova APIs
import cordovaApp from './cordova-app.js';

// Import Routes
import routes from './routes.js';
import {
  resolve
} from 'url';

var app = new Framework7({
  root: '#app', // App root element
  id: 'io.georgean.sakhalanguage', // App bundle ID
  name: 'Саха тыла', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
      user: {
        firstName: 'George',
        lastName: 'An.',
      },
    };
  },
  // Корневые методы app
  methods: {

    // Установить значение value к target в localStorage посредством localForage
    setStorage: function (target, value) {
      console.log("setStorage: Значение " + target + " изменено на " + value);
      localForage.setItem(target, value);
    },

    // Установить значение value к course_progress
    setProgressbar: function (value) {
      console.log("setProgressbar: Прогресс " + value + "% установлен");
      app.progressbar.set(course_progress, value, 150);
    },

    // Отобразить задание под номером value
    setTask: function (currPage, data, value) {
      console.log("setTask: Задание под номером " + value + " отображено");
      currPage.$setState(data["task" + value]);
    },

    // Открыть страницу с именем view
    setView: function (view) {
      console.log("setView: Страница " + view + " открыта");
      app.views.main.router.navigate('/' + view, {
        reloadAll: true,
      });
    },

    // Вернуть значение value от target из localStorage посредством localForage
    getStorage: async function (target) {
      return await localForage.getItem(target);
    },

    // Показать значок загрузки
    showPreloader: function (timeout = 500) {
      app.preloader.show();
      setTimeout(function () {
        app.preloader.hide()
      }, timeout);
    },

    courseMounted: function (data, currPage) {
      app.methods.showPreloader();
      let courseName = currPage.$f7route.path.slice(9);
      localForage.getItem(courseName, function (err, value) {
        let taskCount = Object.keys(data).length;
        if (value === null) {
          console.log("courseMounted: Задание с номером не найдено, отображается задание 1");
          app.methods.setStorage(courseName, 1);
          app.methods.setStorage(courseName + '_wrong', 0);
          app.methods.setProgressbar(0);
        } else if (value <= taskCount) {
          console.log("courseMounted: Найдено задание с номером, отображается задание " + value);
          app.methods.setTask(currPage, data, value);
          app.methods.setProgressbar(((value - 1) / taskCount) * 100);
        } else if (value > taskCount) {
          console.log("courseMounted: Все выполнено!");
          setTimeout(function () {
            app.methods.setView("finished/" + courseName);
          }, 500);
        };
      });
    },

    answerIsRight: function (data, currPage) {
      var toast = app.toast.create({
        icon: app.theme === 'ios' ? '<i class="f7-icons">star</i>' : '<i class="material-icons">star</i>',
        text: 'Отлично!',
        position: 'center',
        closeTimeout: 1000,
      });
      toast.open();

      let courseName = currPage.$f7route.path.slice(9);
      let _value;
      localForage.getItem(courseName, function (err, value) {
        let taskCount = Object.keys(data).length;
        _value = value + 1;
        app.methods.setStorage(courseName, _value);
        if (value < taskCount) {
          app.methods.setProgressbar(value / taskCount * 100);
          app.methods.setTask(currPage, data, _value);
        } else {
          console.log("All is done");
          setTimeout(function () {
            app.methods.setView("finished/" + courseName);
          }, 500);
        };
      });
    },

    answerIsWrong: function (data, currPage) {
      var toast = app.toast.create({
        icon: app.theme === 'ios' ? '<i class="f7-icons">close_round</i>' : '<i class="material-icons">close_round</i>',
        text: 'Неверный ответ',
        position: 'center',
        closeTimeout: 1000,
      });
      toast.open();

      let courseName = currPage.$f7route.path.slice(9);
      let _value;
      localForage.getItem(courseName + '_wrong', function (err, value) {
        _value = value + 1;
        if (value) {
          app.methods.setStorage(courseName + '_wrong', _value);
        } else {
          app.methods.setStorage(courseName + '_wrong', 1);
        };
      });
    },

    answerConfirm: function (checkedAnswer, data, currPage) {
      let answer = 0;
      if (checkedAnswer === '1') {
        app.methods.answerIsRight(data, currPage);
        answer = 1;
      } else {
        app.methods.answerIsWrong(data, currPage);
        answer = 0;
      };
    },

  },
  // App routes
  routes: routes,

  // Input settings
  input: {
    scrollIntoViewOnFocus: !!Framework7.device.cordova,
    scrollIntoViewCentered: !!Framework7.device.cordova,
  },
  // Cordova Statusbar settings
  statusbar: {
    overlay: Framework7.device.cordova && Framework7.device.ios || 'auto',
    iosOverlaysWebView: true,
    androidOverlaysWebView: false,
    androidTextColor: 'white',
    androidBackgroundColor: 'black',
  },
  on: {
    init: function () {
      var f7 = this;
      if (f7.device.cordova) {
        // Init cordova APIs (see cordova-app.js)
        cordovaApp.init(f7);
      }
    },
  },
});