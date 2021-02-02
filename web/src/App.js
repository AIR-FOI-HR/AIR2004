import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Dashboard, HomeView } from "./pages/Dashboard/Dashboard";
import StudentsView from "./pages/StudentsView/StudentsView";
import StudentsViewAdd from "./pages/StudentsViewAdd/StudentsViewAdd";
import StudentsViewEdit from "./pages/StudentsViewEdit/StudentsViewEdit";
import TeachersView from "./pages/TeachersView/TeachersView";
import TeachersViewAdd from "./pages/TeachersViewAdd/TeachersViewAdd";
import TeachersViewEdit from "./pages/TeachersViewEdit/TeachersViewEdit";
import CoursesView from "./pages/CoursesView/CoursesView";
import CoursesViewAdd from "./pages/CoursesViewAdd/CoursesViewAdd";
import CoursesViewEdit from "./pages/CoursesViewEdit/CoursesViewEdit";
import LecturesView from "./pages/LecturesView/LecturesView";
import LecturesViewAdd from "./pages/LecturesViewAdd/LecturesViewAdd";
import LecturesViewEdit from "./pages/LecturesViewEdit/LecturesViewEdit";
import AttendanceView from "./pages/AttendanceView/AttendanceView";
import Login from "./pages/Login/Login";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <PrivateRoute exact path="/students">
          <Dashboard>
            <StudentsView />
          </Dashboard>
        </PrivateRoute>
        <PrivateRoute path="/students/add">
          <Dashboard>
            <StudentsViewAdd />
          </Dashboard>
        </PrivateRoute>
        <PrivateRoute path="/students/edit">
          <Dashboard>
            <StudentsViewEdit />
          </Dashboard>
        </PrivateRoute>
        <PrivateRoute exact path="/teachers">
          <Dashboard>
            <TeachersView />
          </Dashboard>
        </PrivateRoute>
        <PrivateRoute path="/teachers/add">
          <Dashboard>
            <TeachersViewAdd />
          </Dashboard>
        </PrivateRoute>
        <PrivateRoute path="/teachers/edit">
          <Dashboard>
            <TeachersViewEdit />
          </Dashboard>
        </PrivateRoute>
        <PrivateRoute exact path="/courses">
          <Dashboard>
            <CoursesView />
          </Dashboard>
        </PrivateRoute>
        <PrivateRoute path="/courses/add">
          <Dashboard>
            <CoursesViewAdd />
          </Dashboard>
        </PrivateRoute>
        <PrivateRoute path="/courses/edit">
          <Dashboard>
            <CoursesViewEdit />
          </Dashboard>
        </PrivateRoute>
        <PrivateRoute exact path="/lectures">
          <Dashboard>
            <LecturesView />
          </Dashboard>
        </PrivateRoute>
        <PrivateRoute path="/lectures/add">
          <Dashboard>
            <LecturesViewAdd />
          </Dashboard>
        </PrivateRoute>
        <PrivateRoute path="/lectures/edit">
          <Dashboard>
            <LecturesViewEdit />
          </Dashboard>
        </PrivateRoute>
        <PrivateRoute exact path="/attendances">
          <Dashboard>
            <AttendanceView />
          </Dashboard>
        </PrivateRoute>
        <PrivateRoute path="/">
          <Dashboard>
            <HomeView />
          </Dashboard>
        </PrivateRoute>
      </Switch>
    </Router>
  );
};

export default App;
