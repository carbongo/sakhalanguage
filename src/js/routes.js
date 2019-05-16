import HomePage from '../pages/home.f7.html';
import Finished from '../pages/finished.f7.html';
import AboutPage from '../pages/about.f7.html';

import Lesson from '../pages/lesson.f7.html';

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
    path: '/lessons/:lessonType/:lessonId',
    component: Lesson,
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