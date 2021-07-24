import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Template = ({ template, deleteTemplate }) => {
    return (
        <tr>
        <td>{template.name}</td>
        <td>
          <Link to={"/template/" + template._id}>Edit</Link> {' | '}
          <a
            href="/"
            onClick={() => {
              deleteTemplate(template._id);
            }}
          >
            Delete
          </a>
        </td>
      </tr>
    );
};

export default class TemplateList extends Component
{
    // the constructor shall store data received from the db
    constructor(props) {
        super(props);
        this.deleteTemplate = this.deleteTemplate.bind(this);
        this.state = { templates: [] };
    }

    // get data from the database each time component renders
    componentDidMount() {
        axios
            .get("http://localhost:3001/")
            .then((response) => {
                this.setState({ templates: response.data });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    // delete a record based on the method
    deleteTemplate(id) {
        axios.delete("http://localhost:3001/template/" + id).then((response) => {
            console.log("deleted", response.data);
            
            this.setState({
              templates: this.state.records.filter((el) => el._id !== id)
          });
        });
    }
    // map out the templates on a table
    templateList() {
        return this.state.templates.map((template) => {
            return (
                <Template
                    template={template}
                    deleteTemplate={this.deleteTemplate}
                    key={template._id}
                />
            );
        });
    }

    // display the table of templates
    render() {
        return (
            <div>
            <h5>Saved Templates</h5>
            <table className="table table-striped table-sm" variant="light" style={{ marginTop: 20 }}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{this.templateList()}</tbody>
            </table>
          </div>
        );
    }
} 