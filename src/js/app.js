import $$ from 'dom7';
import Framework7 from 'framework7/framework7.esm.bundle.js';

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
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
    courseProgress: function (data, completedTasks, course_completed, course_overall, course_progress) {

    },
    showTask: function (data, task, task_type, task_hint, task_answers) {
      
    },
    answerIsRight: function () {
      var toast = app.toast.create({
        icon: app.theme === 'ios' ? '<i class="f7-icons">star</i>' : '<i class="material-icons">star</i>',
        text: 'Отлично!',
        position: 'center',
        closeTimeout: 2000,
      });
      toast.open();
    },
    answerIsWrong: function () {
      var toast = app.toast.create({
        icon: app.theme === 'ios' ? '<i class="f7-icons">close_round</i>' :
          '<i class="material-icons">close_round</i>',
        text: 'Неверный ответ',
        position: 'center',
        closeTimeout: 2000,
      });
      toast.open();
    },
    answerConfirm: function (checkedAnswer) {
      checkedAnswer === '1' ? this.methods.answerIsRight() : this.methods.answerIsWrong();
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