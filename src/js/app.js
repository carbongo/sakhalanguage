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
  // App root methods
  methods: {
    // helloWorld: function () {
    //   app.dialog.alert('Hello World!');
    // },
    storageSet: function (target, value) {
      console.log("storageSet: Storage (" + target + ") is set to " + value)
      localForage.setItem(target, value);
    },

    progressbarSet: function (value) {
      console.log("progressbarSet: Progressbar " + value + " is set")
      app.progressbar.set(course_progress, value, 150);
    },

    taskSet: function (self, data, value) {
      console.log("taskSet: Task " + value + " is set")
      self.$setState(data["task" + value]);
    },

    courseMounted: function (data, self) {
      let courseName = self.$f7route.path.slice(1, -1);
      localForage.getItem(courseName, function (err, value) {
        let taskCount = Object.keys(data).length;
        if (value) {
          app.methods.taskSet(self, data, value);
          app.methods.progressbarSet(((value - 1) / taskCount) * 100);
        } else {
          app.methods.storageSet(courseName, 1);
          app.methods.progressbarSet(0);
        }
      })
    },

    answerIsRight: function (data, self) {
      var toast = app.toast.create({
        icon: app.theme === 'ios' ? '<i class="f7-icons">star</i>' : '<i class="material-icons">star</i>',
        text: 'Отлично!',
        position: 'center',
        closeTimeout: 1000,
      });
      toast.open();

      let courseName = self.$f7route.path.slice(1, -1);
      let _value;
      localForage.getItem(courseName, function (err, value) {
        let taskCount = Object.keys(data).length;
        _value = value + 1;
        if (value < taskCount) {
          app.methods.progressbarSet(value / taskCount * 100);
          app.methods.storageSet(courseName, _value);
          app.methods.taskSet(self, data, _value);
        } else {
          console.log("All is done");
        }
      })
    },

    answerIsWrong: function () {
      var toast = app.toast.create({
        icon: app.theme === 'ios' ? '<i class="f7-icons">close_round</i>' : '<i class="material-icons">close_round</i>',
        text: 'Неверный ответ',
        position: 'center',
        closeTimeout: 1000,
      });
      toast.open();
    },

    answerConfirm: function (checkedAnswer, data, self) {
      let answer = 0;
      if (checkedAnswer === '1') {
        app.methods.answerIsRight(data, self);
        answer = 1;
      } else {
        app.methods.answerIsWrong();
        answer = 0;
      }
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