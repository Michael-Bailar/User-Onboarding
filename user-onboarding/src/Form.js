import React, {useState, useEffect} from "react";
import {withFormik, Form, Field} from "formik";
import * as Yup from "yup";
import axios from "axios";


const UserForm = ({values, errors, touched, status}) => {
    
    const [users, setUsers] = useState([]);

    useEffect(() => {
        status && setUsers(users => [...users, status]);
    }, [status]);

    return (
        <div className="user-form">
            <Form >
                <label htmlFor="name">
                    Name:
                    <Field 
                        id="name"
                        type="text"
                        name="name"
                        placeholder="name"
                    />
                    {touched.name && errors.name &&(
                        <p className="errors">{errors.name}</p>
                    )}
                </label>
                <br/>
                <label htmlFor="email">
                    Email:
                    <Field 
                        id="email"
                        type="text"
                        name="email"
                        placeholder="email address"
                    />
                    {touched.email && errors.email &&(
                        <p className="errors">{errors.email}</p>
                    )}
                </label>
                <br/>    
                <label htmlFor="password">
                    Password:
                    <Field 
                        id="password"
                        type="text"
                        name="password"
                        placeholder="password"
                    />
                    {touched.password && errors.password &&(
                        <p className="errors">{errors.password}</p>
                    )}
                </label> 
                <br/>
                <button type="submit">Submit!</button>       
            </Form> 

            {users.map(user => {
                return (
                    <ul>
                        <li>Name: {user.name}</li>
                        <li>Email: {user.email}</li>
                        <li>Password: {user.password}</li>
                    </ul>
                );
            })}
        </div>
    );
};

const FormikUserForm = withFormik({
    mapPropsToValues(props) {
        return {
            name: props.name || "",
            email: props.email || "",
            password: props.password || ""
        }
    },

    validationSchema: Yup.object({
        name: Yup.string().required("name is required")
                          .test('test-name', "you cannot have numbers in your name",
                          function(value) {
                              const nameCheck = /^([^0-9]*)$/;
                              let isValidName = nameCheck.test(value);
                              if (!isValidName) {
                                  return false;
                              }
                              return true;
                          }),
        email: Yup.string().required("Email is required")
                           .test('test-name', 'Enter valid email', 
                            function(value) {
                              const emailCheck = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                              let isValidEmail = emailCheck.test(value);
                              if (!isValidEmail){
                                return false;
                              }
                              return true;
                            }),
        password: Yup.string().required("Password is required")
                              .test('length', 'Password must be exactly 6 characters', value => value.length === 6)
    }),

    handleSubmit(values, { setStatus, resetForm }) {
        console.log("submitting", values);
        axios
            .post("https://reqres.in/api/users", values)
            .then(result => {
                console.log("success", result);
                setStatus(result.data);
                resetForm();
            })
            .catch(error => console.log(error.response));
    }
})(UserForm);

export default FormikUserForm;