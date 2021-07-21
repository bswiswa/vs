import React from "react";
import './styles/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route } from "react-router-dom";
import Edit from "./components/Edit";
import Create from "./components/Create";
import TemplateList from "./components/TemplateList";
import NavigationBar from "./components/NavigationBar";

function App() {
  return (
    <div className="App">
      <NavigationBar />
      <Route exact path="/">
        <TemplateList />
      </Route>
      <Route path="/template/:id" component={Edit}/>
      <Route path="/create">
        <Create />
      </Route>
    </div>
  );
}

export default App;
