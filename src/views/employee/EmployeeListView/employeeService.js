//We are importing axios library here, this is use to send/get requests to server
import axios from "axios";

//We are initilizing a variable "SERVER_URL" component here, that is getting value
//variable by using "process.env"
let SERVER_URL = process.env.REACT_APP_SERVER_URL;

//Here we are developing a metod named as "addAnEmployee" that accepts 4 parameters and
//Pass to the server by "POST" request.
export const addAnEmployee = async (firstname, lastname, email, hiredate, tagsToStore, employeeMetaData) => {
	//In try block, we will try to execute our logic if works fine.

	try {
		//Here we are passing that parameters in the body of post request.

		const response = await axios.post(
			`${SERVER_URL}Employees`,
			{
				firstname: firstname,
				lastname: lastname,
				email: email,
				hiredate: hiredate,
				tags: tagsToStore,
				employeeMetaData: employeeMetaData
			},
			{
				headers: { Authorization: `Bearer ${localStorage.getItem("x-auth-token")}` }
			}
		);

		//We are getting response back from server and storing in variable named as "data"
		const data = await response;

		//Here we are returing our variable that we will listen from the components
		// by which this service is being called.
		return data;
	} catch (error) {
		//here we are catching the error, and returning it.
		return error;
	}
};

//***this method will send a get request to get all Employees***
export const getEployees = async () => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.get(`${SERVER_URL}Employees?_sort=id:desc`, {
			headers: { Authorization: `Bearer ${localStorage.getItem("x-auth-token")}` }
		});

		//we are getting response back from server and storing in variable named as "data"
		const data = await response.data;

		//here we are returing our variable that we will listen from the components
		// by which this service is being called.
		return data;
	} catch (error) {
		console.log(error);

		//here we are catching the error, and returning it.
		return error;
	}
};

//***here we are sending a delete request and it will require an ID of a user***
export const deleteEployee = async (id) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.delete(`${SERVER_URL}Employees/${id}`, {
			headers: { Authorization: `Bearer ${localStorage.getItem("x-auth-token")}` }
		});

		//We are getting response back from server and storing in variable named as "data"
		const data = await response.data;

		//Here we are returing our variable that we will listen from the components
		//By which this service is being called.So if we will get data back that would mean that a
		//User has successfully deleted
		return data;
	} catch (error) {
		console.log(error);
		//Here we are catching the error, and returning it.
		return error;
	}
};

//***Here we are developing a metod named as "updateAnEmployee" that accepts 5 parameters and
//pass to the server by "PUT" request.***

export const updateAnEmployee = async (empId, firstname, lastname, email, hiredate, tagsToStore, employeeMetaData) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		//We are initilizating "id" to empId, because the name of variable that was declared by
		//Strapi as ID should be same in our frontend.
		let id = empId;
		const response = await axios.put(
			`${SERVER_URL}Employees/${id}`,
			{
				firstname: firstname,
				lastname: lastname,
				email: email,
				hiredate: hiredate,
				tags: tagsToStore,
				employeeMetaData: employeeMetaData
			},
			{
				headers: { Authorization: `Bearer ${localStorage.getItem("x-auth-token")}` }
			}
		);
		//We are getting response back from server and storing in variable named as "data"
		const data = await response;

		//Here we are returing our variable that we will listen from the components
		//by which this service is being called.
		return data;
	} catch (error) {
		console.log(error);
		//Here we are catching the error, and returning it.
		return error;
	}
};

export const updateAnEmployeeForBulkTags = async (empId, tagsToStore) => {
	//In try block, we will try to execute our logic if works fine.
	try {
		//We are initilizating "id" to empId, because the name of variable that was declared by
		//Strapi as ID should be same in our frontend.
		let id = empId;
		const response = await axios.put(
			`${SERVER_URL}Employees/${id}`,
			{
				tags: tagsToStore
			},
			{
				headers: { Authorization: `Bearer ${localStorage.getItem("x-auth-token")}` }
			}
		);
		//We are getting response back from server and storing in variable named as "data"
		const data = await response;

		//Here we are returing our variable that we will listen from the components
		//by which this service is being called.
		return data;
	} catch (error) {
		console.log(error);
		//Here we are catching the error, and returning it.
		return error;
	}
};

//***this method will send a get request to get all employee-meta-fields***
export const getEployeesMetaFields = async () => {
	//In try block, we will try to execute our logic if works fine.
	try {
		const response = await axios.get(`${SERVER_URL}employee-meta-fields`, {
			headers: { Authorization: `Bearer ${localStorage.getItem("x-auth-token")}` }
		});

		//we are getting response back from server and storing in variable named as "data"
		const data = await response.data;

		//here we are returing our variable that we will listen from the components
		// by which this service is being called.
		return data;
	} catch (error) {
		console.log(error);

		//here we are catching the error, and returning it.
		return error;
	}
};

export const addAnEmployeeMetaData = async (employee_id, employeemetafield_id, content, field_name) => {
	//In try block, we will try to execute our logic if works fine.

	try {
		//Here we are passing that parameters in the body of post request.

		const response = await axios.post(
			`${SERVER_URL}employee-meta-data`,
			{
				employee_id: employee_id,
				employeemetafield_id: employeemetafield_id,
				empid: employee_id,
				empMfId: employeemetafield_id,
				content: content,
				field_name: field_name
			},
			{
				headers: { Authorization: `Bearer ${localStorage.getItem("x-auth-token")}` }
			}
		);

		//We are getting response back from server and storing in variable named as "data"
		const data = await response;

		//Here we are returing our variable that we will listen from the components
		// by which this service is being called.
		return data;
	} catch (error) {
		console.log(error);
		//here we are catching the error, and returning it.
		return error;
	}
};

export const updateEmployeeMetaData = async (metaDataId, content) => {
	//In try block, we will try to execute our logic if works fine.

	try {
		//Here we are passing that parameters in the body of post request.
		let id = metaDataId;
		const response = await axios.put(
			`${SERVER_URL}employee-meta-data/${id}`,
			{
				content: content
			},
			{
				headers: { Authorization: `Bearer ${localStorage.getItem("x-auth-token")}` }
			}
		);

		//We are getting response back from server and storing in variable named as "data"
		const data = await response;

		//Here we are returing our variable that we will listen from the components
		// by which this service is being called.
		return data;
	} catch (error) {
		//here we are catching the error, and returning it.
		return error;
	}
};
