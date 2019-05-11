import HomePage from '../pages/home.f7.html';
import Finished from '../pages/finished.f7.html';
import AboutPage from '../pages/about.f7.html';

import LessonWords from '../pages/lessons/words.f7.html';

import NotFoundPage from '../pages/404.f7.html';

var routes = [{
    path: '/',
    component: HomePage,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/lessons/words/:lessonId',
    component: LessonWords,
  },
  {
    path: '/finished/:lessonType/:lessonId',
    component: Finished,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;